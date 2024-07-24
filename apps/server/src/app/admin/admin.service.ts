import { Injectable } from '@nestjs/common'
import { InjectClient } from 'nest-postgres'
import {
  PendingActionsSchema,
  PendingMembersSchema,
  PendingUsersSchema,
  AdminDashBoardSchema,
} from 'api-contract/types'
import { Client } from 'pg'
import z from 'zod'

@Injectable()
export class AdminService {
  constructor(@InjectClient() private readonly pg: Client) {}
  /**
   * Get all of the user that are pending
   **/
  async getAllPendingUsers(): Promise<
    z.infer<typeof PendingUsersSchema> | undefined
  > {
    const result = await this.pg.query(
      `SELECT
          p.id AS profile_id,
          p.first_name,
          p.middle_name,
          p.last_name,
          p.user_name,
          p.gender,
          p.date_of_birth,
          p.profile_url,
          a.street,
          a.city,
          a.state,
          a.postal_code,
          a.country_id,
          c.number,
          c.prefix,
          u.email
      FROM profile p
      JOIN address a ON p.id = a.profile_id
      JOIN contact c ON p.id = c.profile_id
      JOIN users u ON u.id = p.user_id
      LEFT JOIN document d ON p.id = d.profile_id
      WHERE d.verified IS NULL`,
    )

    if (result.rowCount === 0) {
      return undefined
    }

    const pendingUsers: z.infer<typeof PendingUsersSchema> = []

    for (const row of result.rows) {
      pendingUsers.push({
        personalInfo: {
          id: row.profile_id,
          firstName: row.first_name,
          middleName: row.middle_name,
          lastName: row.last_name,
          userName: row.user_name,
          gender: row.gender,
          dob: row.date_of_birth,
          profileUrl: row.profile_url,
          email: row.email,
        },
        addressInfo: {
          city: row.city,
          state: row.state,
          street: row.street,
          countryId: row.country_id,
          phoneCode: row.prefix,
          phoneNumber: row.number,
          postalCode: row.postal_code,
        },
      })
    }

    return pendingUsers
  }
  /**
   * Pending user actions
   **/

  async pendingUserActions({
    action,
    ids,
  }: z.infer<typeof PendingActionsSchema>): Promise<boolean> {
    try {
      await this.pg.query('BEGIN')

      const updateQuery = `UPDATE public.document SET verified = $1 WHERE profile_id = ANY($2)`
      const values = [action === 'accept', ids]

      const result = await this.pg.query(updateQuery, values)

      if (result.rowCount !== ids.length) {
        await this.pg.query('ROLLBACK')
        return false
      }

      await this.pg.query('COMMIT')
      return true
    } catch {
      await this.pg.query('ROLLBACK')
      return false
    }
  }
  /**
   * Get all of the member that are pending
   **/
  async getAllPendingMembers(): Promise<
    z.infer<typeof PendingMembersSchema> | undefined
  > {
    const result = await this.pg.query(
      `SELECT
          fm.id AS member_id,
          fm.first_name AS member_first_name,
          fm.middle_name AS member_middle_name,
          fm.last_name AS member_last_name,
          fm.date_of_birth AS member_date_of_birth,
          fm.gender AS member_gender,
          fm.profile_url AS member_profile_url,
          fd.verified AS member_verified,
          p.id AS user_id,
          p.first_name AS user_first_name,
          p.middle_name AS user_middle_name,
          p.last_name AS user_last_name,
          p.user_name,
          p.gender AS user_gender,
          p.date_of_birth AS user_date_of_birth,
          p.profile_url AS user_profile_url,
          u.email AS user_email
      FROM family_member fm
      JOIN family_document fd ON fm.id = fd.family_member_id
      JOIN profile p ON p.id = fm.profile_id
      JOIN contact c ON p.id = c.profile_id
      JOIN users u ON u.id = p.user_id
      LEFT JOIN document d ON p.id = d.profile_id
      WHERE fd.verified IS NULL`,
    )

    if (result.rowCount === 0) {
      return undefined
    }

    const pendingUsers: z.infer<typeof PendingMembersSchema> = []

    for (const row of result.rows) {
      pendingUsers.push({
        familyMemberInfo: {
          id: row.member_id,
          firstName: row.member_first_name,
          middleName: row.member_middle_name,
          lastName: row.member_last_name,
          dob: row.member_date_of_birth,
          gender: row.member_gender,
          profileUrl: row.member_profile_url,
          verified: row.member_verified,
        },
        userPersonalInfo: {
          id: row.user_id,
          firstName: row.user_first_name,
          middleName: row.user_middle_name,
          lastName: row.user_last_name,
          userName: row.user_name,
          gender: row.user_gender,
          dob: row.user_date_of_birth,
          profileUrl: row.user_profile_url,
          email: row.user_email,
        },
      })
    }

    return pendingUsers
  }
  /**
   * Pending member actions
   **/
  async pendingMemberActions({
    action,
    ids,
  }: z.infer<typeof PendingActionsSchema>): Promise<boolean> {
    try {
      await this.pg.query('BEGIN')

      const updateQuery = `UPDATE public.family_document SET verified = $1 WHERE family_member_id = ANY($2)`
      const values = [action === 'accept', ids]

      const result = await this.pg.query(updateQuery, values)

      if (result.rowCount !== ids.length) {
        await this.pg.query('ROLLBACK')
        return false
      }

      await this.pg.query('COMMIT')
      return true
    } catch {
      await this.pg.query('ROLLBACK')
      return false
    }
  }
  /**
   * Pending member actions
   **/
  async getDashBoard(): Promise<
    z.infer<typeof AdminDashBoardSchema> | undefined
  > {
    const result = await this.pg.query(`
      SELECT
        (SELECT COUNT(*) FROM users) AS totalUser,
        (SELECT COUNT(*) FROM payments) AS requestCompleted,
        (SELECT COUNT(*) FROM service_request WHERE status = 'open') AS activeRequest,
				(SELECT COUNT(*) FROM payments) AS totalRevenue
    `)

    if (result.rowCount === 0) {
      return undefined
    }

    const currentYear = new Date().getFullYear()
    const monthlyRevenue = []
    for (let i = 1; i <= 12; i++) {
      const monthCount = await this.pg.query(
        `
        SELECT COUNT(*) FROM payments
        WHERE EXTRACT(YEAR FROM created_at) = $1
        AND EXTRACT(MONTH FROM created_at) = $2
      `,
        [currentYear, i],
      )

      const totalMonthlyRevenue = Number(monthCount.rows[0].count) * 2
      monthlyRevenue.push({
        month: new Date(currentYear, i - 1, 1).toLocaleString('en-US', {
          month: 'short',
        }),
        totalMonthlyRevenue: totalMonthlyRevenue,
      })
    }

    const recentCompleteRequestQuery = await this.pg.query(
      `
      SELECT
        json_agg(json_build_object(
          'buyerProfile', json_build_object(
            'id', p_buyer.id,
            'firstName', p_buyer.first_name,
            'middleName', p_buyer.middle_name,
            'lastName', p_buyer.last_name,
            'userName', p_buyer.user_name,
            'dob', p_buyer.date_of_birth,
            'gender', p_buyer.gender,
            'profileUrl', p_buyer.profile_url,
            'email', u_buyer.email
          ),
          'sellerProfile', json_build_object(
            'id', p_seller.id,
            'firstName', p_seller.first_name,
            'middleName', p_seller.middle_name,
            'lastName', p_seller.last_name,
            'userName', p_seller.user_name,
            'dob', p_seller.date_of_birth,
            'gender', p_seller.gender,
            'profileUrl', p_seller.profile_url,
            'email', u_seller.email
          ),
          'price', sr.price::text
        )) AS recent_completed_request
      FROM payments pm
      JOIN service_request_accepted sra ON pm.service_request_accepted_id = sra.id
      JOIN service_request sr ON sra.service_request_id = sr.id
      JOIN profile p_buyer ON sr.profile_id = p_buyer.id
      JOIN profile p_seller ON sra.accepted_profile_id = p_seller.id
      JOIN users u_buyer ON p_buyer.user_id = u_buyer.id
      JOIN users u_seller ON p_seller.user_id = u_seller.id
      WHERE DATE_TRUNC('month', pm.created_at) = DATE_TRUNC('month', CURRENT_DATE)
      `,
    )

    if (recentCompleteRequestQuery.rowCount === 0) {
      return undefined
    }

    return {
      totalUser: Number(result.rows[0].totaluser).toLocaleString(),
      totalRequestCompleted: Number(
        result.rows[0].requestcompleted,
      ).toLocaleString(),
      totalActiveRequest: Number(result.rows[0].activerequest).toLocaleString(),
      totalRevenue: (Number(result.rows[0].totalrevenue) * 2).toLocaleString(),
      overView: monthlyRevenue,
      recentCompletedRequest:
        recentCompleteRequestQuery.rows[0].recent_completed_request ?? [],
    }
  }
}
