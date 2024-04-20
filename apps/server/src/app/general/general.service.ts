import { Injectable } from '@nestjs/common'
import { InjectClient } from 'nest-postgres'
import { Client } from 'pg'
import { CountriesSchema } from 'api-contract/types'
import { z } from 'zod'

@Injectable()
export class GeneralService {
  constructor(@InjectClient() private readonly pg: Client) {}
  /**
   * Get list of countries
   **/
  async getCountries(): Promise<z.infer<typeof CountriesSchema>[] | undefined> {
    const result = await this.pg.query(
      'SELECT id, name, country_code, short_name, nationality FROM public.country',
    )
    if (result.rowCount === 0) {
      return undefined
    }

    return result.rows
  }
}
