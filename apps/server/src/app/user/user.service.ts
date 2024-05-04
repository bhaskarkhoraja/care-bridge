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
      'SELECT first_name, middle_name, last_name, date_of_birth, gender, user_name  FROM public.profile where id = $1',
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
    profileId: string,
  ): Promise<z.infer<typeof DocumentFormSchema> | undefined> {
    const result = await this.pg.query(
      'SELECT d.document_url, d.police_report_url, d.verified, p.profile_url FROM public.document d JOIN public.profile p ON d.profile_id = p.id WHERE p.id = $1',
      [profileId],
    )
    if (result.rowCount === 0) {
      return undefined
    }

    return {
      verified: result.rows[0].verified,
      profileUrl: result.rows[0].profile_url,
      documentUrl: result.rows[0].document_url,
      policeReportUrl: result.rows[0].police_report_url,
    }
  }
  /**
   * Set Document info, update or insert
   **/
  async setDocumentInfo(
    documentInfo: z.infer<typeof DocumentFormSchema>,
    profileId: string,
    userId: string,
  ): Promise<boolean> {
    const result1 = await this.pg.query(
      'UPDATE public.profile SET profile_url = $1 WHERE id = $2',
      [documentInfo.profileUrl, profileId],
    )

    const result2 = await this.pg.query(
      'INSERT INTO document (document_url, police_report_url, profile_id, verified) VALUES ($1, $2, $3, $4) ON CONFLICT (profile_id) DO UPDATE SET document_url = EXCLUDED.document_url, police_report_url = EXCLUDED.police_report_url, verified = EXCLUDED.verified',
      [documentInfo.documentUrl, documentInfo.policeReportUrl, profileId, null],
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
}
