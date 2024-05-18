import { Injectable } from '@nestjs/common'
import { serverEnv } from '@server/src/lib/env.validation'
import { InjectClient } from 'nest-postgres'
import { Client } from 'pg'
import { UserService } from '@server/src/app/user/user.service'
import z from 'zod'
import {
  partnerReferalByPaypalResponseSchema,
  partnerMerchantIntegrationResponseSchema,
} from '@server/src/types/payment/paypal'
import { AdapterUser } from 'next-auth/adapters'
import { format } from 'date-fns'
import { generatePaypalTokenResponseSchema } from '@server/src/types/payment/paypal'

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

      const data: z.infer<typeof partnerReferalByPaypalResponseSchema> =
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
      `${serverEnv.PAYPAL_URL}/v1/customer/partners/${result.rows[0].paypal_merchant_id}/merchant-integrations?tracking_id=${profileId}`,
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
}
