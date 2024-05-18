import { Controller } from '@nestjs/common'
import { PaypalService } from './paypal.service'
import { TsRest, TsRestHandler, tsRestHandler } from '@ts-rest/nest'
import contract from 'api-contract'
import { AdapterUser } from 'next-auth/adapters'
import { User } from '@server/src/lib/decorators/user.decorator'

@Controller()
@TsRest({
  validateRequestBody: false,
  validateRequestQuery: false,
  validateRequestHeaders: false,
})
export class PaypalController {
  constructor(private readonly paypalService: PaypalService) {}

  @TsRestHandler(contract.payment.paypal)
  async handler(@User() user: AdapterUser) {
    return tsRestHandler(contract.payment.paypal, {
      /**
       * Get action url
       **/
      getActionUrl: async () => {
        try {
          const getPaypalToken = await this.paypalService.generatePaypalToken()
          if (!getPaypalToken.status) {
            return {
              status: 500,
              body: { status: false, message: 'Something went wrong' },
            }
          }

          const actionUrl = await this.paypalService.partnerReferal(
            user,
            getPaypalToken.accessToken,
          )

          if (!actionUrl) {
            return {
              status: 422,
              body: {
                status: false,
                message: "Couldn't process partner referal",
              },
            }
          }

          return {
            status: 200,
            body: { status: true, data: { actionUrl: actionUrl } },
          }
        } catch {
          return {
            status: 500,
            body: { status: false, message: 'Something went wrong' },
          }
        }
      },
      /**
       * Add paypal merchat id to profile
       **/
      setPaypalMerchantAccount: async ({ body }) => {
        try {
          const success = await this.paypalService.setPaypalMerchantAccount(
            user.profile_id as string,
            body.merchantIdInPaypal,
          )

          if (success === undefined) {
            return {
              status: 422,
              body: {
                status: false,
                message: 'Failed to update seller account',
              },
            }
          }

          if (!success) {
            return {
              status: 204,
              body: {
                status: false,
                message: 'User not found',
              },
            }
          }

          return {
            status: 200,
            body: {
              status: true,
              message: 'Successfully updated seller account',
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
       * check seller account status
       **/
      checkSellerPaypalAndStatus: async () => {
        try {
          const getPaypalToken = await this.paypalService.generatePaypalToken()
          if (!getPaypalToken.status) {
            return {
              status: 500,
              body: { status: false, message: 'Something went wrong' },
            }
          }

          const success = await this.paypalService.checkSellerPaypalAndStatus(
            user.profile_id as string,
            getPaypalToken.accessToken,
          )

          if (success === undefined) {
            return {
              status: 204,
              body: {
                status: false,
                message: 'No paypal account found',
              },
            }
          }

          return {
            status: 200,
            body: {
              status: true,
              data: {
                paypalStatus: success ? 'Active' : 'Pending',
              },
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
       * Get payment url
       **/
      getPaymentURL: async ({ params }) => {
        try {
          const getPaypalToken = await this.paypalService.generatePaypalToken()
          if (!getPaypalToken.status) {
            return {
              status: 500,
              body: { status: false, message: 'Something went wrong' },
            }
          }

          const paymentUrl = await this.paypalService.getPaymentURL(
            params.id,
            getPaypalToken.accessToken,
            user,
          )

          if (!paymentUrl) {
            return {
              status: 422,
              body: {
                status: false,
                message: "Couldn't find payment url",
              },
            }
          }

          return {
            status: 200,
            body: { status: true, data: { paymentUrl: paymentUrl } },
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
