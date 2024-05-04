import { Controller } from '@nestjs/common'
import { UserService } from './user.service'
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
export class UserController {
  constructor(private readonly userService: UserService) {}

  @TsRestHandler(contract.users)
  async handler(@User() user: AdapterUser) {
    return tsRestHandler(contract.users, {
      /**
       * Get the personal data using profile_id
       **/
      getPersonalInfo: async () => {
        try {
          const personalInfo = await this.userService.getPersonalInfo(
            user.profile_id as string,
          )

          if (personalInfo === undefined) {
            return {
              status: 204,
              body: { status: true, message: 'No personal info found' },
            }
          }

          return { status: 200, body: { status: true, data: personalInfo } }
        } catch {
          return {
            status: 500,
            body: { status: false, message: 'Something went wrong' },
          }
        }
      },
      /**
       * Set the personal info update or insert
       **/
      setPersonalInfo: async ({ body }) => {
        try {
          const success = await this.userService.setPersonalInfo(body, user.id)

          if (success === undefined) {
            return {
              status: 409,
              body: { status: false, message: 'Username already taken' },
            }
          }

          if (!success) {
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
              message: 'Personal info updated successfully',
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
       * Get Address and contact info using profile_id
       **/
      getAddressContactInfo: async () => {
        try {
          const addressContactInfo =
            await this.userService.getAddressContactInfo(
              user.profile_id as string,
            )

          if (addressContactInfo === undefined) {
            return {
              status: 204,
              body: { status: true, message: 'No address contact info found' },
            }
          }

          return {
            status: 200,
            body: { status: true, data: addressContactInfo },
          }
        } catch {
          return {
            status: 500,
            body: { status: false, message: 'Something went wrong' },
          }
        }
      },
      /**
       * Set Address and contact info, update or insert
       **/
      setAddressContactInfo: async ({ body }) => {
        try {
          const success = await this.userService.setAddressContactInfo(
            body,
            user.profile_id as string,
          )

          if (success === undefined) {
            return {
              status: 409,
              body: { status: false, message: 'Phone number already taken' },
            }
          }

          if (!success) {
            return {
              status: 422,
              body: {
                status: false,
                message: 'Failed to update address & contact info',
              },
            }
          }

          return {
            status: 200,
            body: {
              status: true,
              message: 'Address & Contact info updated successfully',
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
      getDocumentInfo: async () => {
        try {
          const documentInfo = await this.userService.getDocumentInfo(
            user.profile_id as string,
          )

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
      setDocumentInfo: async ({ body }) => {
        try {
          const success = await this.userService.setDocumentInfo(
            body,
            user.profile_id as string,
            user.id,
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
        } catch (error) {
          return {
            status: 500,
            body: { status: false, message: 'Something went wrong' },
          }
        }
      },
      /**
       * Set Document info, update or insert
       **/
      setUserType: async ({ body }) => {
        try {
          const success = await this.userService.setUserType(body, user.id)

          if (!success) {
            return {
              status: 422,
              body: {
                status: true,
                message: 'Failed to update user type',
              },
            }
          }

          return {
            status: 200,
            body: {
              status: true,
              message: 'User type updated successfully',
            },
          }
        } catch (error) {
          return {
            status: 500,
            body: { status: false, message: 'Something went wrong' },
          }
        }
      },
    })
  }
}
