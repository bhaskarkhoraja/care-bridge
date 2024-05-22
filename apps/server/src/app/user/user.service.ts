import { Injectable } from '@nestjs/common'
import { InjectClient } from 'nest-postgres'
import { Client } from 'pg'
import {
  AddressContactFormSchema,
  PersonalInfoFormSchema,
  DocumentFormSchema,
  UserTypeSchema,
} from 'api-contract/types'
import z from 'zod'

@Injectable()
export class UserService {
  constructor(@InjectClient() private readonly pg: Client) {}
  /**
   * Get the personal data using profile_id
   **/
  async getPersonalInfo(
    profileId: string,
  ): Promise<z.infer<typeof PersonalInfoFormSchema> | undefined> {
    const result = await this.pg.query(
      'SELECT first_name, middle_name, last_name, date_of_birth, gender, user_name, profile_url FROM public.profile where id = $1',
      [profileId],
    )
    if (result.rowCount === 0) {
      return undefined
    }

    return {
      firstName: result.rows[0].first_name,
      middleName: result.rows[0].middle_name,
      lastName: result.rows[0].last_name,
      dob: result.rows[0].date_of_birth,
      gender: result.rows[0].gender,
      userName: result.rows[0].user_name,
      profileUrl: result.rows[0].profile_url,
    }
  }
  /**
   * Set the personal info update or insert
   **/
  async setPersonalInfo(
    personalInfo: z.infer<typeof PersonalInfoFormSchema>,
    profileId: string,
    userId: string,
  ): Promise<boolean | undefined> {
    const result1 = await this.pg.query(
      'SELECT * FROM profile WHERE user_name = $1 AND user_id != $2',
      [personalInfo.userName, userId],
    )

    if (result1.rowCount !== null && result1.rowCount > 0) {
      return undefined
    }

    const result2 = await this.pg.query(
      'INSERT INTO profile (id, first_name, middle_name, last_name, user_name, date_of_birth, gender, active_status, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) ON CONFLICT (user_id) DO UPDATE SET first_name = EXCLUDED.first_name, middle_name = EXCLUDED.middle_name, last_name = EXCLUDED.last_name, user_name = EXCLUDED.user_name, date_of_birth = EXCLUDED.date_of_birth, gender = EXCLUDED.gender, active_status = EXCLUDED.active_status',
      [
        profileId,
        personalInfo.firstName,
        personalInfo.middleName,
        personalInfo.lastName,
        personalInfo.userName,
        personalInfo.dob,
        personalInfo.gender,
        false,
        userId,
      ],
    )

    if (result2.rowCount === 0) {
      return false
    }

    return true
  }
  /**
   * Get Address and contact info using profile_id
   **/
  async getAddressContactInfo(
    profileId: string,
  ): Promise<z.infer<typeof AddressContactFormSchema> | undefined> {
    const result = await this.pg.query(
      'SELECT a.street, a.city, a.state, a.postal_code, a.country_id, c.number, c.prefix FROM public.address a LEFT JOIN public.contact c ON a.profile_id = c.profile_id WHERE a.profile_id = $1',
      [profileId],
    )
    if (result.rowCount === 0) {
      return undefined
    }

    return {
      street: result.rows[0].street,
      city: result.rows[0].city,
      state: result.rows[0].state,
      postalCode: result.rows[0].postal_code,
      countryId: result.rows[0].country_id,
      phoneNumber: result.rows[0].number,
      phoneCode: result.rows[0].prefix,
    }
  }

  /**
   * Set Address and contact info, update or insert
   **/
  async setAddressContactInfo(
    addressContactInfo: z.infer<typeof AddressContactFormSchema>,
    profileId: string,
  ): Promise<boolean | undefined> {
    const result1 = await this.pg.query(
      'SELECT * FROM contact WHERE number = $1 AND profile_id != $2',
      [addressContactInfo.phoneNumber, profileId],
    )

    if (result1.rowCount !== null && result1.rowCount > 0) {
      return undefined
    }

    const result2 = await this.pg.query(
      'INSERT INTO address (street, city, state, postal_code, country_id, profile_id) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (profile_id) DO UPDATE SET street = EXCLUDED.street, city = EXCLUDED.city, state = EXCLUDED.state, postal_code = EXCLUDED.postal_code, country_id = EXCLUDED.country_id',
      [
        addressContactInfo.street,
        addressContactInfo.city,
        addressContactInfo.state,
        addressContactInfo.postalCode,
        addressContactInfo.countryId.replace(/-[^-]*$/, ''), // Replace last string with empty string as it contain country name
        profileId,
      ],
    )

    const result3 = await this.pg.query(
      'INSERT INTO contact (number, prefix, profile_id) VALUES ($1, $2, $3) ON CONFLICT (profile_id) DO UPDATE SET number = EXCLUDED.number, prefix = EXCLUDED.prefix',
      [addressContactInfo.phoneNumber, addressContactInfo.phoneCode, profileId],
    )

    if (result2.rowCount === 0 || result3.rowCount === 0) {
      return false
    }

    return true
  }
  /**
   * Get the document info of user using profile-id
   **/
  async getDocumentInfo(
    searchedProfileId: string,
    userProfileId: string,
    isAdmin: boolean,
  ): Promise<z.infer<typeof DocumentFormSchema> | undefined> {
    const result = await this.pg.query(
      'SELECT d.document_url, d.police_report_url, d.verified, p.profile_url FROM public.document d JOIN public.profile p ON d.profile_id = p.id WHERE p.id = $1',
      [searchedProfileId],
    )
    if (result.rowCount === 0) {
      return undefined
    }

    const personalDocument = searchedProfileId === userProfileId || isAdmin

    return {
      verified: result.rows[0].verified,
      profileUrl: personalDocument ? result.rows[0].profile_url : '',
      documentUrl: personalDocument ? result.rows[0].document_url : '',
      policeReportUrl: personalDocument ? result.rows[0].police_report_url : '',
    }
  }
  /**
   * Set Document info, update or insert
   **/
  async setDocumentInfo(
    documentInfo: z.infer<typeof DocumentFormSchema>,
    profileId: string,
    userId: string,
    isAdmin: boolean,
  ): Promise<boolean> {
    const result1 = await this.pg.query(
      'UPDATE public.profile SET profile_url = $1 WHERE id = $2',
      [documentInfo.profileUrl, profileId],
    )

    const result2 = await this.pg.query(
      'INSERT INTO document (document_url, police_report_url, profile_id, verified) VALUES ($1, $2, $3, $4) ON CONFLICT (profile_id) DO UPDATE SET document_url = EXCLUDED.document_url, police_report_url = EXCLUDED.police_report_url, verified = EXCLUDED.verified',
      [
        documentInfo.documentUrl,
        documentInfo.policeReportUrl,
        profileId,
        isAdmin ? true : null,
      ],
    )

    if (result1.rowCount === 0 || result2.rowCount === 0) {
      return false
    }

    const result3 = await this.pg.query(
      'UPDATE public.users SET completed_profile = $1 WHERE id = $2',
      [true, userId],
    )

    if (result3.rowCount === 0) {
      return false
    }

    return true
  }
  /**
   * Set User Type
   **/
  async setUserType(
    userType: z.infer<typeof UserTypeSchema>,
    userId: string,
  ): Promise<boolean> {
    const result = await this.pg.query(
      'UPDATE public.users SET type = $1 WHERE id = $2',
      [userType.type, userId],
    )

    if (result.rowCount === 0) {
      return false
    }

    return true
  }
  /**
   * Set User Type
   **/
  async getDashBoard(userId: string) {
    const query = `
    WITH user_payments AS (
      SELECT
        p.id,
        p.created_at,
        p.service_request_accepted_id,
        sra.service_request_id,
        sr.profile_id,
        sr.price
      FROM payments p
      JOIN service_request_accepted sra ON p.service_request_accepted_id = sra.id
      JOIN service_request sr ON sra.service_request_id = sr.id
    )
    SELECT
      SUM(CASE WHEN sra.applicant_profile_id = $1 THEN sr.price ELSE 0 END) AS total_received,
      SUM(CASE WHEN up.profile_id = $1 THEN sr.price ELSE 0 END) AS total_paid,
      COUNT(CASE WHEN sra.applicant_profile_id = $1 THEN 1 END) AS total_bought,
      COUNT(CASE WHEN up.profile_id = $1 THEN 1 END) AS total_sales,
      EXTRACT(MONTH FROM up.created_at) AS month,
      SUM(CASE WHEN sra.applicant_profile_id = $1 THEN sr.price ELSE 0 END) AS received_per_month,
      SUM(CASE WHEN up.profile_id = $1 THEN sr.price ELSE 0 END) AS paid_per_month
    FROM service_request_application sra
    JOIN service_request sr ON sra.service_request_id = sr.id
    JOIN service_request_accepted srac ON sra.id = srac.service_request_application_id
    JOIN payments py ON srac.id = py.service_request_accepted_id
    LEFT JOIN user_payments up ON sra.service_request_id = up.service_request_id
    GROUP BY EXTRACT(MONTH FROM up.created_at)
  `

    const result = await this.pg.query(query, [userId])

    if (result.rowCount === 0) {
      // No transactions, return empty overview
      return {
        totalPaid: '0',
        totalRecieved: '0',
        totalSales: '0',
        totalBought: '0',
        overView: [],
      }
    }

    const { total_received, total_paid } = result.rows[0]

    const result1 = await this.pg.query(
      `
    SELECT
      (SELECT COUNT(*)
       FROM payments p
       JOIN service_request_accepted sra ON p.service_request_accepted_id = sra.id
       WHERE sra.accepted_profile_id = $1) AS total_bought,
      (SELECT COUNT(*)
       FROM payments p
       JOIN service_request_accepted sra ON p.service_request_accepted_id = sra.id
       JOIN service_request sr ON sra.service_request_id = sr.id
       WHERE sr.profile_id = $1) AS total_sales
    `,
      [userId],
    )

    const monthlyData = result.rows.map((row) => ({
      month: new Date(2023, row.month - 1, 1).toLocaleString('en-US', {
        month: 'short',
      }),
      recieved: Number(row.received_per_month),
      paid: Number(row.paid_per_month),
    }))

    const completeMonthlyData = Array.from({ length: 12 }, (_, i) => {
      const monthName = new Date(2023, i, 1).toLocaleString('en-US', {
        month: 'short',
      })
      const existingData = monthlyData.find((data) => data.month === monthName)
      return {
        month: monthName,
        recieved: existingData ? existingData.recieved : 0,
        paid: existingData ? existingData.paid : 0,
      }
    })

    return {
      totalPaid: Number(total_paid).toLocaleString(),
      totalRecieved: Number(total_received).toLocaleString(),
      totalSales: Number(result1.rows[0].total_sales).toLocaleString(),
      totalBought: Number(result1.rows[0].total_bought).toLocaleString(),
      overView: completeMonthlyData,
    }
  }
}
