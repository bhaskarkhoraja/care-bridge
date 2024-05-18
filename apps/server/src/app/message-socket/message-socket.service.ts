import { Injectable } from '@nestjs/common'
import { InjectClient } from 'nest-postgres'
import { MessageSchema } from 'api-contract/types'
import { Client } from 'pg'
import z from 'zod'

@Injectable()
export class MessageSocketService {
  constructor(@InjectClient() private readonly pg: Client) {}

  async createMessage(
    message: z.infer<typeof MessageSchema>,
  ): Promise<boolean> {
    const result = await this.pg.query(
      `
        INSERT INTO message
          (id, sender_profile_id, receiver_profile_id, message, is_read)
          VALUES ($1, $2, $3, $4, $5)
      `,
      [
        message.id,
        message.senderProfileId,
        message.recieverProfileId,
        message.message,
        message.isRead,
      ],
    )

    if (result.rowCount === 0) {
      return false
    }

    return true
  }

  async seenMessage(message: z.infer<typeof MessageSchema>): Promise<boolean> {
    const result = await this.pg.query(
      `
      UPDATE message
      SET is_read = true
      WHERE
        (sender_profile_id = $1 AND receiver_profile_id = $2) OR
        (sender_profile_id = $2 AND receiver_profile_id = $1)
      `,
      [message.senderProfileId, message.recieverProfileId],
    )

    if (result.rowCount === 0) {
      return false
    }

    return true
  }
}
