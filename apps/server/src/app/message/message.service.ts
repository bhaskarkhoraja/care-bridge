import { Injectable } from '@nestjs/common'
import { InjectClient } from 'nest-postgres'
import {
  MessageSchema,
  SenderDetailsSchema,
  SideMessageSchema,
} from 'api-contract/types'
import { Client } from 'pg'
import z from 'zod'

@Injectable()
export class MessageService {
  constructor(@InjectClient() private readonly pg: Client) {}
  /**
   * Get all of the user that are pending
   **/
  async getAllMessages(
    status: 'open' | 'close' | 'spam',
    userId: string,
  ): Promise<z.infer<typeof SideMessageSchema>[] | undefined> {
    const result = await this.pg.query(
      `
      SELECT
        m.id,
        s.id AS sender_id,
        s.first_name AS sender_first_name,
        s.middle_name AS sender_middle_name,
        s.last_name AS sender_last_name,
        s.user_name AS sender_user_name,
        s.gender AS sender_gender,
        s.date_of_birth AS sender_date_of_birth,
        s.profile_url AS sender_profile_url,
        r.id AS reciever_id,
        r.first_name AS receiver_first_name,
        r.middle_name AS receiver_middle_name,
        r.last_name AS receiver_last_name,
        r.user_name AS receiver_user_name,
        r.gender AS receiver_gender,
        r.date_of_birth AS receiver_date_of_birth,
        r.profile_url AS receiver_profile_url,
        m.message,
        m.is_read,
        m.created_at,
        us.email AS sender_email,
        ur.email AS receiver_email
      FROM
        (
          SELECT
            id,
            sender_profile_id,
            receiver_profile_id,
            message,
            is_read,
            created_at,
            ROW_NUMBER() OVER (
              PARTITION BY CASE WHEN sender_profile_id = $1 THEN receiver_profile_id ELSE sender_profile_id END
              ORDER BY created_at DESC
            ) AS rn
          FROM
            message
          WHERE
            (sender_profile_id = $1 OR receiver_profile_id = $1)
            AND message_status = $2
        ) m
        JOIN profile s ON m.sender_profile_id = s.id
        JOIN profile r ON m.receiver_profile_id = r.id
        JOIN users us ON s.user_id = us.id
        JOIN users ur ON r.user_id = ur.id
      WHERE
        m.rn = 1
      ORDER BY
        m.created_at DESC;
      `,
      [userId, status],
    )

    if (result.rowCount === 0) {
      return undefined
    }

    const messages: z.infer<typeof SideMessageSchema>[] = result.rows.map(
      (row) => ({
        id: row.id,
        senderProfile: {
          id: row.sender_id,
          firstName: row.sender_first_name,
          middleName: row.sender_middle_name,
          lastName: row.sender_last_name,
          userName: row.sender_user_name,
          email: row.sender_email,
          dob: new Date(row.sender_date_of_birth),
          gender: row.sender_gender,
          profileUrl: row.sender_profile_url,
        },
        recieverProfile: {
          id: row.reciever_id,
          firstName: row.receiver_first_name,
          middleName: row.receiver_middle_name,
          lastName: row.receiver_last_name,
          userName: row.receiver_user_name,
          email: row.reciever_email,
          dob: new Date(row.receiver_date_of_birth),
          gender: row.receiver_gender,
          profileUrl: row.receiver_profile_url,
        },
        message: row.message,
        isRead: row.is_read,
        createdAt: new Date(row.created_at),
      }),
    )

    return messages
  }

  async getMessage(
    senderId: string,
    receiverId: string,
  ): Promise<z.infer<typeof MessageSchema>[] | undefined> {
    const result = await this.pg.query(
      `
    SELECT
      m.id,
      s.id AS sender_id,
      r.id AS reciever_id,
      m.message,
      m.is_read,
      m.created_at,
      us.email AS sender_email,
      ur.email AS receiver_email
    FROM
      message m
      JOIN profile s ON m.sender_profile_id = s.id
      JOIN profile r ON m.receiver_profile_id = r.id
      JOIN users us ON s.user_id = us.id
      JOIN users ur ON r.user_id = ur.id
    WHERE
      (m.sender_profile_id = $1 AND m.receiver_profile_id = $2) OR
      (m.sender_profile_id = $2 AND m.receiver_profile_id = $1)
    ORDER BY
      m.created_at ASC;
    `,
      [senderId, receiverId],
    )

    if (result.rowCount === 0) {
      return []
    }

    const messages: z.infer<typeof MessageSchema>[] = result.rows.map(
      (row) => ({
        id: row.id,
        senderProfileId: row.sender_id,
        recieverProfileId: row.reciever_id,
        message: row.message,
        isRead: row.is_read,
        createdAt: new Date(row.created_at),
      }),
    )

    return messages
  }

  async getSenderDetails(
    senderId: string,
  ): Promise<z.infer<typeof SenderDetailsSchema> | undefined> {
    const result = await this.pg.query(
      'SELECT p.first_name, p.middle_name, p.last_name, p.profile_url, u.email FROM profile p JOIN users u ON p.user_id = u.id WHERE p.id = $1',
      [senderId],
    )

    if (result.rowCount === 0) {
      return undefined
    }

    return {
      firstName: result.rows[0].first_name,
      middleName: result.rows[0].middle_name,
      lastName: result.rows[0].last_name,
      profileUrl: result.rows[0].profile_url,
      email: result.rows[0].email,
    }
  }

  async markMessages(
    senderId: string,
    userId: string,
    status: 'open' | 'close' | 'spam',
  ): Promise<boolean> {
    const result = await this.pg.query(
      `UPDATE message
        SET message_status = $3, updated_at = NOW()
        WHERE
          (sender_profile_id = $1 AND receiver_profile_id = $2)
          OR
          (sender_profile_id = $2 AND receiver_profile_id = $1);
      `,
      [senderId, userId, status],
    )

    if (result.rowCount === 0) {
      return false
    }

    return true
  }
}
