import { Controller } from '@nestjs/common'
import { RequestService } from './request.service'
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
@Controller('request')
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  @TsRestHandler(contract.request)
  async handler(@User() user: AdapterUser) {
    return tsRestHandler(contract.request, {
      /**
       * Add request
       **/
      createRequest: async ({ body }) => {
        try {
          const success = await this.requestService.createRequest(
            body,
            user.profile_id as string,
          )

          if (!success) {
            return {
              status: 422,
              body: {
                status: false,
                message: 'Failed to update request.',
              },
            }
          }

          return {
            status: 200,
            body: {
              status: true,
              message: 'Request updated successfully',
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
       * Get all sellers request
       **/
      getMyRequest: async () => {
        try {
          const requests = await this.requestService.getMyRequest(
            user.profile_id as string,
          )

          if (requests === undefined) {
            return {
              status: 204,
              body: { status: true, message: 'No requests found' },
            }
          }

          return { status: 200, body: { status: true, data: requests } }
        } catch {
          return {
            status: 500,
            body: { status: false, message: 'Something went wrong' },
          }
        }
      },
      /**
       * Get specific requset
       **/
      getRequest: async ({ params }) => {
        try {
          const requests = await this.requestService.getRequest(
            params.id,
            user.profile_id as string,
          )

          if (requests === undefined) {
            return {
              status: 204,
              body: { status: true, message: 'No requests found' },
            }
          }

          return { status: 200, body: { status: true, data: requests } }
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
