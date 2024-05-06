import { Injectable } from '@nestjs/common'
import { InjectClient } from 'nest-postgres'
import {
  DocumentFormSchema,
  FamilyInfoFormSchema,
  ExtendedFamilyInfoFormSchema,
  FamilySpecialNeedsSchema,
} from 'packages/api-contract/dist/types'
import { Client } from 'pg'
import z from 'zod'

@Injectable()
export class FamilyMemberService {
  constructor(@InjectClient() private readonly pg: Client) {}
  /**
   * Get the personal data using profile_id
   **/
  async getFamilyMemberInfo(
    familyMemberId: string,
  ): Promise<z.infer<typeof FamilyInfoFormSchema> | undefined> {
    const result = await this.pg.query(
      'SELECT first_name, middle_name, last_name, date_of_birth, gender, profile_url FROM public.family_member where id = $1',
      [familyMemberId],
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
      profileUrl: result.rows[0].profile_url,
    }
  }
  /**
   * Set the personal info update or insert
   **/
  async setFamilyMemberInfo(
    familyMemberInfo: z.infer<typeof FamilyInfoFormSchema>,
    profileId: string,
    familyMemberId: string,
  ): Promise<boolean> {
    const result = await this.pg.query(
      'INSERT INTO family_member (first_name, middle_name, last_name, date_of_birth, gender, profile_id, id) VALUES ($1, $2, $3, $4, $5, $6, $7)  ON CONFLICT (id) DO UPDATE SET first_name = EXCLUDED.first_name, middle_name = EXCLUDED.middle_name, last_name = EXCLUDED.last_name, date_of_birth = EXCLUDED.date_of_birth, gender = EXCLUDED.gender',
      [
        familyMemberInfo.firstName,
        familyMemberInfo.middleName,
        familyMemberInfo.lastName,
        familyMemberInfo.dob,
        familyMemberInfo.gender,
        profileId,
        familyMemberId,
      ],
    )

    if (result.rowCount === 0) {
      return false
    }

    return true
  }

  /**
   * Get special needs according to family members id
   **/
  async getFamilySpecialNeed(
    familyMemberId: string,
  ): Promise<z.infer<typeof FamilySpecialNeedsSchema> | undefined> {
    const result = await this.pg.query(
      'SELECT id, title, description, url FROM public.special_needs where family_member_id = $1',
      [familyMemberId],
    )
    if (result.rowCount === 0) {
      return undefined
    }

    const data: z.infer<typeof FamilySpecialNeedsSchema> = {
      specialNeeds: [],
    }

    for (const row of result.rows) {
      data.specialNeeds.push({
        id: row.id,
        title: row.title,
        description: row.description,
        url: row.url,
      })
    }

    return data
  }

  /**
   * Set the personal info update or insert
   **/
  async setFamilySpecialNeed(
    familyMemberInfo: z.infer<typeof FamilySpecialNeedsSchema>,
    familyMemberId: string,
  ): Promise<boolean> {
    try {
      await this.pg.query('BEGIN')

      for (const specialNeed of familyMemberInfo.specialNeeds) {
        const result = await this.pg.query(
          'INSERT INTO special_needs (title, description, url, family_member_id, id) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, url = EXCLUDED.url',
          [
            specialNeed.title,
            specialNeed.description,
            specialNeed.url,
            familyMemberId,
            specialNeed.id,
          ],
        )

        if (result.rowCount === 0) {
          await this.pg.query('ROLLBACK')
          return false
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
   * Get the document info of family member
   **/
  async getFamilyDocumentInfo(
    familyMemberId: string,
    profileId: string,
    isAdmin: boolean,
  ): Promise<z.infer<typeof DocumentFormSchema> | undefined> {
    const result = await this.pg.query(
      'SELECT d.document_url, d.police_report_url, d.verified, fm.profile_url, fm.profile_id as profile_id FROM public.family_document d JOIN public.family_member fm ON d.family_member_id = fm.id WHERE fm.id = $1',
      [familyMemberId],
    )
    if (result.rowCount === 0) {
      return undefined
    }

    const familyBelongToProfile =
      profileId === result.rows[0].profile_id || isAdmin

    return {
      verified: result.rows[0].verified,
      profileUrl: familyBelongToProfile ? result.rows[0].profile_url : '',
      documentUrl: familyBelongToProfile ? result.rows[0].document_url : '',
      policeReportUrl: familyBelongToProfile
        ? result.rows[0].police_report_url
        : '',
    }
  }

  /**
   * Set FamilyDocument
   **/
  async setFamilytDocumentInfo(
    documentInfo: z.infer<typeof DocumentFormSchema>,
    familyMemberId: string,
  ): Promise<boolean> {
    const result1 = await this.pg.query(
      'UPDATE public.family_member SET profile_url = $1 WHERE id = $2',
      [documentInfo.profileUrl, familyMemberId],
    )

    const result2 = await this.pg.query(
      'INSERT INTO family_document (document_url, police_report_url, family_member_id, verified) VALUES ($1, $2, $3, $4) ON CONFLICT (family_member_id) DO UPDATE SET document_url = EXCLUDED.document_url, police_report_url = EXCLUDED.police_report_url, verified = EXCLUDED.verified',
      [
        documentInfo.documentUrl,
        documentInfo.policeReportUrl,
        familyMemberId,
        null,
      ],
    )

    if (result1.rowCount === 0 || result2.rowCount === 0) {
      return false
    }

    return true
  }
  /**
   * Get the all family member by profile id
   **/
  async getAllFamilyMemberInfo(
    profileId: string,
  ): Promise<z.infer<typeof ExtendedFamilyInfoFormSchema>[] | undefined> {
    const result = await this.pg.query(
      `SELECT
        fm.id,
        fm.first_name,
        fm.middle_name,
        fm.last_name,
        fm.date_of_birth,
        fm.gender,
        fm.profile_url,
        fd.verified
      FROM
        public.family_member fm
        LEFT JOIN public.family_document fd ON fm.id = fd.family_member_id
      WHERE
      fm.profile_id = $1;`,
      [profileId],
    )
    if (result.rowCount === 0) {
      return undefined
    }

    const data: z.infer<typeof ExtendedFamilyInfoFormSchema>[] = []

    for (const row of result.rows) {
      data.push({
        id: row.id,
        profileUrl: row.profile_url,
        firstName: row.first_name,
        middleName: row.middle_name,
        lastName: row.last_name,
        dob: row.date_of_birth,
        gender: row.gender,
        verified: row.verified,
      })
    }

    return data
  }

  /**
   * Check if user can edit or update
   **/
  async checkFamilyMemberEditable(
    familyMemberId: string,
    profileId: string,
  ): Promise<boolean | undefined> {
    const result = await this.pg.query(
      'SELECT profile_id FROM public.family_member WHERE id = $1',
      [familyMemberId],
    )

    if (result.rowCount === 0) {
      return undefined
    }

    if (profileId !== result.rows[0].profile_id) {
      return false
    }
    return true
  }
}
