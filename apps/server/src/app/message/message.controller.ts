import { Controller } from '@nestjs/common'
import contract from 'api-contract'
import { TsRest, TsRestHandler, tsRestHandler } from '@ts-rest/nest'
import { User } from '@server/src/lib/decorators/user.decorator'
import { AdapterUser } from 'next-auth/adapters'
import { MessageService } from './message.service'

@Controller()
@TsRest({
  validateRequestBody: false,
  validateRequestQuery: false,
  validateRequestHeaders: false,
})
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @TsRestHandler(contract.message)
  async handler(@User() user: AdapterUser) {
    return tsRestHandler(contract.message, {
      /**
       * Get All messages for side bar
       **/
      getAllMessages: async ({ query: { status } }) => {
        try {
          const messages = await this.messageService.getAllMessages(
            status,
            user.profile_id as string,
          )

          if (messages === undefined) {
            return {
              status: 204,
              body: { status: true, message: 'No messages found' },
            }
          }

          return { status: 200, body: { status: true, data: messages } }
        } catch {
          return {
            status: 500,
            body: { status: false, message: 'Something went wrong' },
          }
        }
      },
      /**
       * Get specific user's message
       **/
      getMessage: async ({ params }) => {
        try {
          const messages = await this.messageService.getMessage(
            params.id,
            user.profile_id as string,
          )

          if (messages === undefined) {
            return {
              status: 204,
              body: { status: true, message: 'No messages found' },
            }
          }

          return { status: 200, body: { status: true, data: messages } }
        } catch {
          return {
            status: 500,
            body: { status: false, message: 'Something went wrong' },
          }
        }
      },
      /**
       * Get specific user's message
       **/
      getSenderDetails: async ({ params }) => {
        try {
          const user = await this.messageService.getSenderDetails(params.id)

          if (user === undefined) {
            return {
              status: 204,
              body: { status: true, message: 'No user found' },
            }
          }

          return { status: 200, body: { status: true, data: user } }
        } catch {
          return {
            status: 500,
            body: { status: false, message: 'Something went wrong' },
          }
        }
      },
      /**
       * Get specific user's message
       **/
      markMessages: async ({ body }) => {
        try {
          const result = this.messageService.markMessages(
            body.senderId,
            user.profile_id as string,
            body.status,
          )

          if (!result) {
            return {
              status: 422,
              body: { status: false, message: 'Failed to mark message' },
            }
          }

          return {
            status: 200,
            body: { status: true, message: 'Successfully marked message' },
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
