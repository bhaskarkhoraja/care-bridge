import { Injectable } from '@nestjs/common'
import { serverEnv } from '@server/src/lib/env.validation'
import { InjectClient } from 'nest-postgres'
import { Client } from 'pg'
import { UserService } from '@server/src/app/user/user.service'
import z from 'zod'
import {
  paypalRefralAndOrderResponseSchema,
  partnerMerchantIntegrationResponseSchema,
  paymentVerificationPartialSchema,
} from '@server/src/types/payment/paypal'
import { AdapterUser } from 'next-auth/adapters'
import { format } from 'date-fns'
import { generatePaypalTokenResponseSchema } from '@server/src/types/payment/paypal'
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class PaypalService {
  constructor(
    @InjectClient() private readonly pg: Client,
    private userService: UserService,
  ) {}

  /**
   * Get access token for paypal service
   **/
  async generatePaypalToken(): Promise<
    z.infer<typeof generatePaypalTokenResponseSchema>
  > {
    try {
      const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization:
          'Basic ' +
          Buffer.from(
            `${serverEnv.PAYPAL_CLIENT_ID}:${serverEnv.PAYPAL_CLIENT_SECRET}`,
          ).toString('base64'),
      }

      const body = new URLSearchParams({
        grant_type: 'client_credentials',
      })

      const response = await fetch(`${serverEnv.PAYPAL_URL}/v1/oauth2/token`, {
        method: 'POST',
        headers,
        body,
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          status: false,
          message: data.error_description,
        }
      }

      return {
        status: true,
        accessToken: data.access_token,
      }
    } catch {
      return {
        status: false,
        message: 'Something went wrong',
      }
    }
  }
  /**
   * Generate partner referal
   **/
  async partnerReferal(
    user: AdapterUser,
    paypalAccessToken: string,
  ): Promise<string | undefined> {
    try {
      const [profileInfo, addressContactInfo] = await Promise.all([
        this.userService.getPersonalInfo(user.profile_id as string),
        this.userService.getAddressContactInfo(user.profile_id as string),
      ])

      if (!profileInfo || !addressContactInfo) {
        throw Error()
      }

      const payload = {
        individual_owners: [
          {
            name: [
              {
                given_name: profileInfo.firstName,
                middle_name: profileInfo.middleName,
                surname: profileInfo.lastName,
                type: 'LEGAL',
              },
            ],
            /* citizenship: 'US', */
            addresses: [
              {
                address_line_1: addressContactInfo.street,
                admin_area_1: addressContactInfo.city,
                postal_code: addressContactInfo.postalCode,
                /* country_code: 'US', */
                type: 'HOME',
              },
            ],
            phones: [
              {
                country_code: addressContactInfo.phoneCode,
                national_number: addressContactInfo.phoneNumber,
                type: 'MOBILE',
              },
            ],
            birth_details: {
              date_of_birth: format(profileInfo.dob, 'yyyy-MM-dd'),
            },
            type: 'PRIMARY',
          },
        ],
        email: user.email,
        tracking_id: user.profile_id,
        partner_config_override: {
          return_url: `${serverEnv.NEXT_PUBLIC_WEB_URL}/user/billing/setting`,
          return_url_description: 'Settings for billings',
          show_add_credit_card: true,
        },
        operations: [
          {
            operation: 'API_INTEGRATION',
            api_integration_preference: {
              rest_api_integration: {
                integration_method: 'PAYPAL',
                integration_type: 'THIRD_PARTY',
                third_party_details: {
                  features: ['PAYMENT', 'REFUND', 'PARTNER_FEE'],
                },
              },
            },
          },
        ],
        products: ['EXPRESS_CHECKOUT'],
        legal_consents: [
          {
            type: 'SHARE_DATA_CONSENT',
            granted: true,
          },
        ],
      }

      const response = await fetch(
        `${serverEnv.PAYPAL_URL}/v2/customer/partner-referrals`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${paypalAccessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        },
      )

      if (!response.ok) {
        throw Error()
      }

      const data: z.infer<typeof paypalRefralAndOrderResponseSchema> =
        await response.json()
      const actionUrl = data.links.find(
        (link) => link.rel === 'action_url',
      )?.href
      return actionUrl as string
    } catch {
      return undefined
    }
  }
  /**
   * Add paypal merchat id to profile
   **/
  async setPaypalMerchantAccount(
    profileId: string,
    merchantIdInPayPal: string,
  ): Promise<boolean | undefined> {
    const result = await this.pg.query(
      `UPDATE profile
           SET paypal_merchant_id = $1
           WHERE id = $2
           RETURNING paypal_merchant_id`,
      [merchantIdInPayPal, profileId],
    )

    if (result.rows.length === 0) {
      return undefined // No profile with the given ID
    }

    if (result.rowCount === 0) {
      return false // Update did not affect any rows
    }

    return true
  }
  /**
   * Add paypal merchat id to profile
   **/
  async checkSellerPaypalAndStatus(
    profileId: string,
    paypalAccessToken: string,
  ): Promise<boolean | undefined> {
    const result = await this.pg.query(
      `
      SELECT paypal_merchant_id
        FROM profile
        WHERE id = $1
      `,
      [profileId],
    )

    if (result.rows.length === 0) {
      return undefined
    }

    const response1 = await fetch(
      `${serverEnv.PAYPAL_URL}/v1/customer/partners/${serverEnv.PAYPAL_PARTNER_ID}/merchant-integrations?tracking_id=${profileId}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${paypalAccessToken}`,
        },
      },
    )

    if (!response1.ok) {
      return undefined
    }

    const data1: z.infer<typeof partnerMerchantIntegrationResponseSchema> =
      await response1.json()

    const response2 = await fetch(
      `${serverEnv.PAYPAL_URL}${data1.links[0].href}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${paypalAccessToken}`,
        },
      },
    )

    const data2 = await response2.json()

    const isActive =
      data2.payments_receivable &&
      data2.primary_email_confirmed &&
      data2.oauth_integrations.length > 0

    if (!isActive) {
      return false
    }

    return true
  }
  /**
   * Get the paymetn url
   **/
  async getPaymentURL(
    serviceRequestId: string,
    paypalAccessToken: string,
    user: AdapterUser,
  ): Promise<string | undefined> {
    try {
      const result = await this.pg.query(
        'SELECT price FROM service_request WHERE id = $1',
        [serviceRequestId],
      )

      if (result.rows.length === 0) {
        return undefined
      }

      const payload = {
        intent: 'CAPTURE',
        purchase_units: [
          {
            reference_id: uuidv4(),
            payee: {
              email_address: user.email,
            },
            amount: {
              currency_code: 'USD',
              value: result.rows[0].price,
            },
            payment_instruction: {
              disbursement_mode: 'INSTANT',
              platform_fees: [
                {
                  amount: {
                    currency_code: 'USD',
                    value: '2.00',
                  },
                },
              ],
            },
          },
        ],
        payment_source: {
          paypal: {
            experience_context: {
              payment_method_preference: 'IMMEDIATE_PAYMENT_REQUIRED',
              user_action: 'PAY_NOW',
              return_url: `${serverEnv.NEXT_PUBLIC_WEB_URL}/payment/success`,
              cancel_url: `${serverEnv.NEXT_PUBLIC_WEB_URL}/payment/failure`,
            },
          },
        },
      }

      const response = await fetch(
        `${serverEnv.PAYPAL_URL}/v2/checkout/orders`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${paypalAccessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        },
      )

      if (!response.ok) {
        throw Error()
      }

      const data: z.infer<typeof paypalRefralAndOrderResponseSchema> =
        await response.json()
      const paymentUrl = data.links.find(
        (link) => link.rel === 'payer-action',
      )?.href
      return paymentUrl as string
    } catch {
      return undefined
    }
  }
  /**
   * verify payment
   **/
  async verifyPayment(
    paymentId: string,
    paypalAccessToken: string,
  ): Promise<boolean> {
    const response = await fetch(
      `${serverEnv.PAYPAL_URL}/v2/checkout/orders/${paymentId}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${paypalAccessToken}`,
        },
      },
    )

    if (!response.ok) {
      return false
    }

    const data: z.infer<typeof paymentVerificationPartialSchema> =
      await response.json()

    if (data.status !== 'APPROVED') {
      return false
    }

    const result1 = await this.pg.query(
      `SELECT sra.id
        FROM service_request_accepted sra
        JOIN service_request sr ON sra.service_request_id = sr.id
        WHERE sr.id = $1`,
      [data.purchase_units[0].reference_id],
    )

    if (result1.rowCount === 0) {
      return false
    }

    const result2 = await this.pg.query(
      `INSERT INTO payments (service_request_accepted_id) VALUES ($1)`,
      [result1.rows[0].id],
    )

    if (result2.rowCount === 0) {
      return false
    }

    return true
  }
}
