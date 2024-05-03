import { Injectable } from '@nestjs/common'
import { InjectClient } from 'nest-postgres'
import {
  DocumentFormSchema,
  FamilyInfoFormSchema,
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
      'SELECT first_name, middle_name, last_name, date_of_birth, gender FROM public.family_member where id = $1',
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
  }

  /**
   * Get the document info of family member
   **/
  async getFamilyDocumentInfo(
    familyMemberId: string,
  ): Promise<z.infer<typeof DocumentFormSchema> | undefined> {
    const result = await this.pg.query(
      'SELECT d.document_url, d.police_report_url, p.profile_url FROM public.family_document d JOIN public.family_member p ON d.family_member_id = p.id WHERE p.id = $1',
      [familyMemberId],
    )
    if (result.rowCount === 0) {
      return undefined
    }

    return {
      profileUrl: result.rows[0].profile_url,
      documentUrl: result.rows[0].document_url,
      policeReportUrl: result.rows[0].police_report_url,
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
      'INSERT INTO family_document (document_url, police_report_url, family_member_id) VALUES ($1, $2, $3) ON CONFLICT (family_member_id) DO UPDATE SET document_url = EXCLUDED.document_url, police_report_url = EXCLUDED.police_report_url',
      [documentInfo.documentUrl, documentInfo.policeReportUrl, familyMemberId],
    )

    if (result1.rowCount === 0 || result2.rowCount === 0) {
      return false
    }

    return true
  }
}
