import { Controller } from '@nestjs/common'
import { TsRest, TsRestHandler, tsRestHandler } from '@ts-rest/nest'
import { GeneralService } from './general.service'
import contract from 'api-contract'

@Controller()
@TsRest({
  validateRequestBody: false,
  validateRequestQuery: false,
  validateRequestHeaders: false,
})
export class GeneralController {
  constructor(private readonly generalService: GeneralService) {}

  @TsRestHandler(contract.general)
  async handler() {
    return tsRestHandler(contract.general, {
      /**
       * Get list of countries
       **/
      getCountries: async () => {
        const countries = await this.generalService.getCountries()

        if (countries === undefined) {
          return {
            status: 204,
            body: { status: true, message: 'No countries found' },
          }
        }

        return { status: 200, body: { status: true, data: countries } }
      },
    })
  }
}
