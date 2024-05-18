import { Injectable } from '@nestjs/common'
import { InjectClient } from 'nest-postgres'
import {
  ExtendedFamilyInfoFormSchema,
  ExtendedPersonalInfoFormSchema,
  ExtendedRequestSchema,
  RequestSchema,
  RequestWithPaidStatus,
} from 'api-contract/types'
import { Client } from 'pg'
import z from 'zod'

@Injectable()
export class RequestService {
  constructor(@InjectClient() private readonly pg: Client) {}

  /**
   * Get the personal data using profile_id
   **/
  async createRequest(
    body: z.infer<typeof RequestSchema>,
    profileId: string,
  ): Promise<boolean> {
    try {
      await this.pg.query('BEGIN')

      const result1 = await this.pg.query(
        'INSERT INTO service_request (id, profile_id, description, start_time, end_time, status, prefered_gender, mandatory_gender, prefered_age, mandatory_age, prefered_nationality_id, mandatory_nationality, location, price) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)  ON CONFLICT (id) DO UPDATE SET description = EXCLUDED.description, start_time = EXCLUDED.start_time, end_time = EXCLUDED.end_time, status = EXCLUDED.status, prefered_gender = EXCLUDED.prefered_gender, mandatory_gender = EXCLUDED.mandatory_gender, prefered_age = EXCLUDED.prefered_age, mandatory_age = EXCLUDED.mandatory_age, prefered_nationality_id = EXCLUDED.prefered_nationality_id, location = EXCLUDED.location, price = EXCLUDED.price',
        [
          body.id,
          profileId,
          body.description,
          body.startTime,
          body.endTime,
          body.status,
          body.preferedGender,
          body.mandatoryGender,
          body.preferedAge,
          body.mandatoryAge,
          body.preferedNationality
            ? body.preferedNationality.replace(/-[^-]*$/, '')
            : null, // Replace last string with empty string as it contain country nationality
          body.mandatoryNationality,
          body.location,
          body.price,
        ],
      )
      if (result1.rowCount === 0) {
        throw new Error()
      }

      // Fetch existing family member IDs for the service request
      const existingFamilyMemberIds = (
        await this.pg.query(
          'SELECT family_member_id FROM service_request_member WHERE service_request_id = $1',
          [body.id],
        )
      ).rows.map((row) => row.family_member_id)

      // Insert new family members and remove deleted ones
      for (const familyMemberId of body.familyMemberIds) {
        if (!existingFamilyMemberIds.includes(familyMemberId)) {
          const result2 = await this.pg.query(
            'INSERT INTO service_request_member (family_member_id, service_request_id) VALUES ($1, $2)',
            [familyMemberId, body.id],
          )

          if (result2.rowCount === 0) {
            throw new Error()
          }
        }
      }

      // Remove family members that are no longer in the request
      for (const existingFamilyMemberId of existingFamilyMemberIds) {
        if (!body.familyMemberIds.includes(existingFamilyMemberId)) {
          const result3 = await this.pg.query(
            'DELETE FROM service_request_member WHERE family_member_id = $1 AND service_request_id = $2',
            [existingFamilyMemberId, body.id],
          )

          if (result3.rowCount === 0) {
            throw new Error()
          }
        }
      }

      await this.pg.query('COMMIT')

      return true
    } catch {
      await this.pg.query('ROLLBACK')
      return false
    }
  }
  /**
   * Get all sellers request
   **/
  async getMyRequest(
    profileId: string,
  ): Promise<z.infer<typeof RequestSchema>[] | undefined> {
    const result = await this.pg.query(
      `
      SELECT
        sr.id,
        sr.status,
        sr.start_time,
        sr.end_time,
        sr.price,
        sr.location,
        sr.description,
        sr.prefered_age,
        sr.mandatory_age,
        sr.prefered_gender,
        sr.mandatory_gender,
        sr.prefered_nationality_id AS prefered_nationality,
        sr.mandatory_nationality,
        ARRAY_AGG(srm.family_member_id) AS family_member_ids
      FROM service_request sr
      LEFT JOIN service_request_member srm ON sr.id = srm.service_request_id
      WHERE sr.profile_id = $1
      GROUP BY sr.id
    `,
      [profileId],
    )

    if (result.rowCount === 0) {
      return undefined
    }

    const data: z.infer<typeof RequestSchema>[] = result.rows.map((row) => ({
      id: row.id,
      status: row.status,
      startTime: row.start_time,
      endTime: row.end_time,
      price: row.price,
      location: row.location,
      description: row.description,
      preferedAge: row.prefered_age,
      mandatoryAge: row.mandatory_age,
      preferedGender: row.prefered_gender,
      mandatoryGender: row.mandatory_gender,
      preferedNationality: row.prefered_nationality,
      mandatoryNationality: row.mandatory_nationality,
      familyMemberIds: row.family_member_ids,
    }))

    return data
  }

  /**
   * Get specific requset
   **/
  async getRequest(
    id: string,
    profileId: string,
  ): Promise<z.infer<typeof ExtendedRequestSchema> | undefined> {
    const result1 = await this.pg.query(
      `
      SELECT
        sr.id,
        sr.profile_id,
        sr.status,
        sr.start_time,
        sr.end_time,
        sr.price,
        sr.location,
        sr.description,
        sr.prefered_age,
        sr.mandatory_age,
        sr.prefered_gender,
        sr.mandatory_gender,
        sr.prefered_nationality_id AS prefered_nationality,
        sr.mandatory_nationality,
        ARRAY_AGG(srm.family_member_id) AS family_member_ids
      FROM service_request sr
      LEFT JOIN service_request_member srm ON sr.id = srm.service_request_id
      WHERE sr.id = $1
      GROUP BY sr.id
    `,
      [id],
    )

    if (result1.rowCount === 0) {
      return undefined
    }

    const familyMemberIds = result1.rows[0].family_member_ids // Assuming there's only one row in result1

    const result2 = await this.pg.query(
      `
        SELECT
          fm.id,
          fm.profile_id,
          fm.first_name,
          fm.middle_name,
          fm.last_name,
          fm.gender,
          fm.profile_url,
          fm.date_of_birth
        FROM family_member fm
        WHERE EXISTS (
          SELECT 1
          FROM UNNEST($1::uuid[]) AS family_member_id
          WHERE family_member_id = fm.id
        )
      `,
      [familyMemberIds],
    )

    const familyMembers: z.infer<typeof ExtendedFamilyInfoFormSchema>[] = []

    for (const row of result2.rows) {
      familyMembers.push({
        id: row.id,
        profileUrl: row.profile_url,
        verified: true, // Set verified to true as mentioned
        firstName: row.first_name,
        middleName: row.middle_name,
        lastName: row.last_name,
        gender: row.gender,
        dob: row.date_of_birth,
      })
    }

    const data: z.infer<typeof ExtendedRequestSchema> = {
      id: result1.rows[0].id,
      status: result1.rows[0].status,
      startTime: result1.rows[0].start_time,
      endTime: result1.rows[0].end_time,
      price: result1.rows[0].price,
      location: result1.rows[0].location,
      description: result1.rows[0].description,
      preferedAge: result1.rows[0].prefered_age,
      mandatoryAge: result1.rows[0].mandatory_age,
      preferedGender: result1.rows[0].prefered_gender,
      mandatoryGender: result1.rows[0].mandatory_gender,
      preferedNationality: result1.rows[0].prefered_nationality,
      mandatoryNationality: result1.rows[0].mandatory_nationality,
      familyMemberIds: result1.rows[0].family_member_ids,
      familyMembers:
        result1.rows[0].profile_id === profileId
          ? familyMembers
          : Array(familyMembers.length).fill(''),
    }

    return data
  }
  /**
   * Get request for seller
   **/
  async getRequestForSeller(
    profileId: string,
  ): Promise<z.infer<typeof RequestSchema>[] | undefined> {
    const result = await this.pg.query(
      `
      SELECT
        sr.id,
        sr.status,
        sr.start_time,
        sr.end_time,
        sr.price,
        sr.location,
        sr.description,
        sr.prefered_age,
        sr.mandatory_age,
        sr.prefered_gender,
        sr.mandatory_gender,
        sr.prefered_nationality_id AS prefered_nationality,
        sr.mandatory_nationality,
        ARRAY_AGG(srm.family_member_id) AS family_member_ids
      FROM service_request sr
      LEFT JOIN service_request_member srm ON sr.id = srm.service_request_id
      WHERE sr.profile_id <> $1 AND sr.status = 'open'
      GROUP BY sr.id
    `,
      [profileId],
    )

    if (result.rowCount === 0) {
      return undefined
    }

    const data: z.infer<typeof RequestSchema>[] = result.rows.map((row) => ({
      id: row.id,
      status: row.status,
      startTime: row.start_time,
      endTime: row.end_time,
      price: row.price,
      location: row.location,
      description: row.description,
      preferedAge: row.prefered_age,
      mandatoryAge: row.mandatory_age,
      preferedGender: row.prefered_gender,
      mandatoryGender: row.mandatory_gender,
      preferedNationality: row.prefered_nationality,
      mandatoryNationality: row.mandatory_nationality,
      familyMemberIds: Array(row.family_member_ids.length).fill(''),
    }))

    return data
  }
  /**
   * Apply for request
   **/
  async applyForRequest(
    requestId: string,
    profileId: string,
  ): Promise<boolean | undefined> {
    const result1 = await this.pg.query(
      `SELECT id from service_request WHERE id=$1`,
      [requestId],
    )
    if (result1.rowCount === 0) {
      return undefined
    }

    const result2 = await this.pg.query(
      `SELECT id from service_request_application WHERE service_request_id = $1 AND applicant_profile_id = $2`,
      [requestId, profileId],
    )
    if (result2.rowCount !== 0) {
      return true
    }

    const result3 = await this.pg.query(
      `
      INSERT INTO service_request_application (applicant_profile_id, service_request_id) VALUES ($1, $2)
      `,
      [profileId, requestId],
    )
    if (result3.rowCount === 0) {
      return false
    }

    return true
  }
  /**
   * Get applied user for certain request
   **/
  async getRequestApplicant(
    requestId: string,
  ): Promise<z.infer<typeof ExtendedPersonalInfoFormSchema>[] | undefined> {
    const result = await this.pg.query(
      `
      SELECT
        sra.applicant_profile_id as id,
        p.first_name,
        p.middle_name,
        p.last_name,
        p.user_name,
        p.gender,
        p.date_of_birth,
        p.profile_url
      FROM service_request_application sra
      LEFT JOIN profile p ON p.id = sra.applicant_profile_id
      WHERE sra.service_request_id = $1
    `,
      [requestId],
    )

    if (result.rowCount === 0) {
      return undefined
    }

    const data: z.infer<typeof ExtendedPersonalInfoFormSchema>[] =
      result.rows.map((row) => ({
        id: row.id,
        firstName: row.first_name,
        middleName: row.middle_name,
        lastName: row.last_name,
        userName: row.user_name,
        gender: row.gender,
        dob: row.date_of_birth,
        profileUrl: row.profile_url,
        email: '',
      }))

    return data
  }
  /**
   * Get request that seller applied to
   **/
  async getAppliedRequest(
    profileId: string,
  ): Promise<z.infer<typeof RequestSchema>[] | undefined> {
    const result = await this.pg.query(
      `
      SELECT
        sr.id,
        sr.status,
        sr.start_time,
        sr.end_time,
        sr.price,
        sr.location,
        sr.description,
        sr.prefered_age,
        sr.mandatory_age,
        sr.prefered_gender,
        sr.mandatory_gender,
        sr.prefered_nationality_id AS prefered_nationality,
        sr.mandatory_nationality,
        ARRAY_AGG(srm.family_member_id) AS family_member_ids
      FROM service_request sr
      LEFT JOIN service_request_application sra ON sr.id = sra.service_request_id
      LEFT JOIN service_request_member srm ON sr.id = srm.service_request_id
      WHERE sra.applicant_profile_id = $1
      GROUP BY sr.id
    `,
      [profileId],
    )

    if (result.rowCount === 0) {
      return undefined
    }

    const data: z.infer<typeof RequestSchema>[] = result.rows.map((row) => ({
      id: row.id,
      status: row.status,
      startTime: row.start_time,
      endTime: row.end_time,
      price: row.price,
      location: row.location,
      description: row.description,
      preferedAge: row.prefered_age,
      mandatoryAge: row.mandatory_age,
      preferedGender: row.prefered_gender,
      mandatoryGender: row.mandatory_gender,
      preferedNationality: row.prefered_nationality,
      mandatoryNationality: row.mandatory_nationality,
      familyMemberIds: Array(row.family_member_ids.length).fill(''),
    }))

    return data
  }
  /**
   * assign request to user
   **/
  async assignRequest(
    sellerProfileId: string,
    requestId: string,
  ): Promise<boolean> {
    try {
      await this.pg.query('BEGIN')

      const result1 = await this.pg.query(
        `UPDATE service_request SET status = 'close' WHERE id = $1`,
        [requestId],
      )

      if (result1.rowCount === 0) {
        return false
      }

      const result2 = await this.pg.query(
        'SELECT id FROM service_request_application WHERE service_request_id = $1 AND applicant_profile_id = $2',
        [requestId, sellerProfileId],
      )

      if (result2.rowCount === 0) {
        return false
      }

      const result3 = await this.pg.query(
        `INSERT INTO service_request_accepted (accepted_profile_id, service_request_id, service_request_application_id)
       VALUES ($1, $2, $3)`,
        [sellerProfileId, requestId, result2.rows[0].id],
      )

      if (result3.rowCount === 0) {
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
   * get accepted request
   **/
  async getAcceptedRequest(
    profileId: string,
  ): Promise<z.infer<typeof RequestWithPaidStatus>[] | undefined> {
    const result = await this.pg.query(
      `
      SELECT
        sr.id,
        sr.status,
        sr.start_time,
        sr.end_time,
        sr.price,
        sr.location,
        sr.description,
        sr.prefered_age,
        sr.mandatory_age,
        sr.prefered_gender,
        sr.mandatory_gender,
        sr.prefered_nationality_id AS prefered_nationality,
        sr.mandatory_nationality,
        ARRAY_AGG(srm.family_member_id) AS family_member_ids,
        CASE WHEN p.service_request_accepted_id IS NOT NULL THEN true ELSE false END AS paid
      FROM service_request sr
      LEFT JOIN service_request_accepted sra ON sr.id = sra.service_request_id
      LEFT JOIN service_request_member srm ON sr.id = srm.service_request_id
      LEFT JOIN payments p ON sra.id = p.service_request_accepted_id
      WHERE sra.accepted_profile_id = $1
      GROUP BY sr.id, p.service_request_accepted_id
      `,
      [profileId],
    )

    if (result.rowCount === 0) {
      return undefined
    }

    const data: z.infer<typeof RequestWithPaidStatus>[] = result.rows.map(
      (row) => ({
        id: row.id,
        status: row.status,
        startTime: row.start_time,
        endTime: row.end_time,
        price: row.price,
        location: row.location,
        description: row.description,
        preferedAge: row.prefered_age,
        mandatoryAge: row.mandatory_age,
        preferedGender: row.prefered_gender,
        mandatoryGender: row.mandatory_gender,
        preferedNationality: row.prefered_nationality,
        mandatoryNationality: row.mandatory_nationality,
        familyMemberIds: Array(row.family_member_ids.length).fill(''),
        paid: row.paid,
      }),
    )
    return data
  }
}
