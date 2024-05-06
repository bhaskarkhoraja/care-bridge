import { Controller } from '@nestjs/common'
import { AdminService } from './admin.service'
import contract from 'api-contract'
import { TsRest, TsRestHandler, tsRestHandler } from '@ts-rest/nest'
import { User } from '@server/src/lib/decorators/user.decorator'
import { AdapterUser } from 'next-auth/adapters'

@Controller()
@TsRest({
  validateRequestBody: false,
  validateRequestQuery: false,
  validateRequestHeaders: false,
})
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @TsRestHandler(contract.admin)
  async handler(@User() user: AdapterUser) {
    return tsRestHandler(contract.admin, {
      /**
       * Get all of the user that are pending
       **/
      getAllPendingUsers: async () => {
        try {
          if (user.role !== 'admin') {
            return {
              status: 401,
              body: {
                status: false,
                message: 'User not authorized to perform this action',
              },
            }
          }

          const pendingUsers = await this.adminService.getAllPendingUsers()

          if (pendingUsers === undefined) {
            return {
              status: 204,
              body: { status: true, message: 'No pending users found' },
            }
          }

          return { status: 200, body: { status: true, data: pendingUsers } }
        } catch {
          return {
            status: 500,
            body: { status: false, message: 'Something went wrong' },
          }
        }
      },
      /**
       * Pending user actions
       **/
      pendingUserActions: async ({ body }) => {
        try {
          if (user.role !== 'admin') {
            return {
              status: 401,
              body: {
                status: false,
                message: 'User not authorized to perform this action',
              },
            }
          }

          const success = await this.adminService.pendingUserActions(body)

          if (!success) {
            return {
              status: 422,
              body: { status: false, message: 'Failed to verify users' },
            }
          }

          return {
            status: 200,
            body: {
              status: true,
              message:
                body.action === 'accept'
                  ? 'Users has been verified'
                  : 'Users has been rejected',
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
       * Get all of the member that are pending
       **/
      getAllPendingMembers: async () => {
        try {
          if (user.role !== 'admin') {
            return {
              status: 401,
              body: {
                status: false,
                message: 'User not authorized to perform this action',
              },
            }
          }

          const pendingMembers = await this.adminService.getAllPendingMembers()

          if (pendingMembers === undefined) {
            return {
              status: 204,
              body: { status: true, message: 'No pending members found' },
            }
          }

          return { status: 200, body: { status: true, data: pendingMembers } }
        } catch {
          return {
            status: 500,
            body: { status: false, message: 'Something went wrong' },
          }
        }
      },
      /**
       * Pending member actions
       **/
      pendingMemberActions: async ({ body }) => {
        try {
          if (user.role !== 'admin') {
            return {
              status: 401,
              body: {
                status: false,
                message: 'User not authorized to perform this action',
              },
            }
          }

          const success = await this.adminService.pendingMemberActions(body)

          if (!success) {
            return {
              status: 422,
              body: { status: false, message: 'Failed to verify members' },
            }
          }

          return {
            status: 200,
            body: {
              status: true,
              message:
                body.action === 'accept'
                  ? 'Members has been verified'
                  : 'Members has been rejected',
            },
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
