import { Controller } from '@nestjs/common'
import { FamilyMemberService } from './family-member.service'
import { TsRest, TsRestHandler, tsRestHandler } from '@ts-rest/nest'
import contract from 'api-contract'
import { User } from '@server/src/lib/decorators/user.decorator'
import { AdapterUser } from 'next-auth/adapters'

@Controller()
@TsRest({
  validateRequestBody: false,
  validateRequestQuery: false,
  validateRequestHeaders: false,
})
export class FamilyMemberController {
  constructor(private readonly familyMemberService: FamilyMemberService) {}

  @TsRestHandler(contract.family)
  async handler(@User() user: AdapterUser) {
    return tsRestHandler(contract.family, {
      /**
       * Get family member info using family member id
       **/
      getFamilyMemberInfo: async ({ params }) => {
        try {
          const familyMemberInfo =
            await this.familyMemberService.getFamilyMemberInfo(params.id)

          if (familyMemberInfo === undefined) {
            return {
              status: 204,
              body: { status: true, message: 'No family member info found' },
            }
          }

          return { status: 200, body: { status: true, data: familyMemberInfo } }
        } catch {
          return {
            status: 500,
            body: { status: false, message: 'Something went wrong' },
          }
        }
      },
      /**
       * Set Family Member info
       **/
      setFamilyMemberInfo: async ({ body }) => {
        try {
          const personalInfo =
            await this.familyMemberService.setFamilyMemberInfo(
              body.data,
              user.profile_id as string,
              body.familyMemberId,
            )

          if (personalInfo === false) {
            return {
              status: 422,
              body: {
                status: false,
                message: 'Failed to update personal info',
              },
            }
          }

          return {
            status: 200,
            body: {
              status: true,
              message: 'Family member info updated successfully',
            },
          }
        } catch {
          return {
            status: 500,
            body: { status: false, message: 'Something went wrong' },
          }
        }
      },
      /**
       * Get family member info using family member id
       **/
      getFamilySpecialNeed: async ({ params }) => {
        try {
          const specialNeeds =
            await this.familyMemberService.getFamilySpecialNeed(params.id)

          if (specialNeeds === undefined) {
            return {
              status: 204,
              body: { status: true, message: 'No special needs found' },
            }
          }

          return { status: 200, body: { status: true, data: specialNeeds } }
        } catch {
          return {
            status: 500,
            body: { status: false, message: 'Something went wrong' },
          }
        }
      },
      /**
       * Set Family member special needs
       **/
      setFamilySpecialNeed: async ({ body }) => {
        try {
          const personalInfo =
            await this.familyMemberService.setFamilySpecialNeed(
              body.data,
              body.familyMemberId,
            )

          if (personalInfo === false) {
            return {
              status: 422,
              body: {
                status: false,
                message: 'Failed to update special needs',
              },
            }
          }

          return {
            status: 200,
            body: {
              status: true,
              message: 'Special needs updated successfully',
            },
          }
        } catch {
          return {
            status: 500,
            body: { status: false, message: 'Something went wrong' },
          }
        }
      },
      /**
       * Get the document info of user using profile_id
       **/
      getFamilyDocumentInfo: async ({ params }) => {
        try {
          const documentInfo =
            await this.familyMemberService.getFamilyDocumentInfo(params.id)

          if (documentInfo === undefined) {
            return {
              status: 204,
              body: { status: true, message: 'No documents found' },
            }
          }

          return { status: 200, body: { status: true, data: documentInfo } }
        } catch {
          return {
            status: 500,
            body: { status: false, message: 'Something went wrong' },
          }
        }
      },
      /**
       * Set Document info, update or insert
       **/
      setFamilyDocumentInfo: async ({ body }) => {
        try {
          const success = await this.familyMemberService.setFamilytDocumentInfo(
            body.data,
            body.familyMemberId,
          )

          if (!success) {
            return {
              status: 422,
              body: {
                status: true,
                message: 'Failed to update document info',
              },
            }
          }

          return {
            status: 200,
            body: {
              status: true,
              message: 'Document info updated successfully',
            },
          }
        } catch {
          return {
            status: 500,
            body: { status: false, message: 'Something went wrong' },
          }
        }
      },
      /**
       * Get all family member by profile id
       **/
      getAllFamilyMemberInfo: async () => {
        try {
          const familyMemberInfo =
            await this.familyMemberService.getAllFamilyMemberInfo(
              user.profile_id as string,
            )

          if (familyMemberInfo === undefined) {
            return {
              status: 204,
              body: { status: true, message: 'No family member found' },
            }
          }

          return { status: 200, body: { status: true, data: familyMemberInfo } }
        } catch {
          return {
            status: 500,
            body: { status: false, message: 'Something went wrong' },
          }
        }
      },
      /**
       * Check if user can edit or update
       **/
      checkFamilyMemberEditable: async ({ params }) => {
        try {
          const editable =
            await this.familyMemberService.checkFamilyMemberEditable(
              params.id,
              user.profile_id as string,
            )

          if (editable === undefined) {
            return {
              status: 204,
              body: { status: true, message: 'No family member found' },
            }
          }

          if (!editable) {
            return {
              status: 401,
              body: {
                status: false,
                message: 'User not authorized to perform this action',
              },
            }
          }

          return {
            status: 200,
            body: { status: true, message: 'User can be edited' },
          }
        } catch {
          return {
            status: 500,
            body: { status: false, message: 'Something went wrong' },
          }
        }
      },
    })
  }
}
