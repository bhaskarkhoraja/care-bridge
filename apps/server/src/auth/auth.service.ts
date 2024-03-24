import { Injectable } from '@nestjs/common'
import { InjectClient } from 'nest-postgres'
import {
  AdapterAccount,
  AdapterSession,
  AdapterUser,
  VerificationToken,
} from 'next-auth/adapters'
import { Client } from 'pg'

export function mapExpiresAt(account: any): any {
  const expires_at: number = parseInt(account.expires_at)
  return {
    ...account,
    expires_at,
  }
}

interface ExtendedAdapterUser extends Omit<AdapterUser, 'id'> {
  role?: string
}

@Injectable()
export class AuthService {
  constructor(@InjectClient() private readonly pg: Client) {}

  async createUser(user: Omit<ExtendedAdapterUser, 'id'>) {
    const { name, email, emailVerified, image, role } = user
    const sql = `
        INSERT INTO users (name, email, "emailVerified", image, role)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, name, email, "emailVerified", image`
    const result = await this.pg.query(sql, [
      name,
      email,
      emailVerified,
      image,
      role ?? 'user',
    ])
    return result.rows[0]
  }

  async getUserByEmail(email: string) {
    const sql = `select * from users where email = $1`
    const result = await this.pg.query(sql, [email])
    return result.rowCount !== 0 ? result.rows[0] : null
  }

  async getVerifiedUserByEmail(email: string) {
    const sql = `select * from users where email = $1 and "emailVerified" is not null`
    const result = await this.pg.query(sql, [email])
    return result.rowCount !== 0 ? result.rows[0] : null
  }

  async getUserByAccount(
    providerAccountId: string,
    provider: string,
  ): Promise<AdapterUser | null> {
    const sql = `
          select u.* from users u join accounts a on u.id = a."userId"
          where
          a.provider = $1
          and
          a."providerAccountId" = $2`

    const result = await this.pg.query(sql, [provider, providerAccountId])
    return result.rowCount !== 0 ? result.rows[0] : null
  }

  async getUser(id: string) {
    const sql = `select * from users where id = $1`
    try {
      const result = await this.pg.query(sql, [id])
      return result.rowCount === 0 ? null : result.rows[0]
    } catch (e) {
      return null
    }
  }

  async updateUser(
    user: Partial<AdapterUser> & Pick<AdapterUser, 'id'>,
  ): Promise<AdapterUser> {
    const fetchSql = `select * from users where id = $1`
    const query1 = await this.pg.query(fetchSql, [user.id])
    const oldUser = query1.rows[0]

    const newUser = {
      ...oldUser,
      ...user,
    }

    const { id, name, email, emailVerified, image } = newUser
    const updateSql = `
        UPDATE users set
        name = $2, email = $3, "emailVerified" = $4, image = $5
        where id = $1
        RETURNING name, id, email, "emailVerified", image
      `
    const query2 = await this.pg.query(updateSql, [
      id,
      name,
      email,
      emailVerified,
      image,
    ])
    return query2.rows[0]
  }

  async deleteUser(userId: string) {
    await this.pg.query(`delete from users where id = $1`, [userId])
    await this.pg.query(`delete from sessions where "userId" = $1`, [userId])
    await this.pg.query(`delete from accounts where "userId" = $1`, [userId])
  }

  async linkAccount(account: AdapterAccount) {
    const sql = `
      insert into accounts
      (
        "userId",
        provider,
        type,
        "providerAccountId",
        access_token,
        expires_at,
        refresh_token,
        id_token,
        scope,
        session_state,
        token_type
      )
      values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      returning
        id,
        "userId",
        provider,
        type,
        "providerAccountId",
        access_token,
        expires_at,
        refresh_token,
        id_token,
        scope,
        session_state,
        token_type
      `

    const params = [
      account.userId,
      account.provider,
      account.type,
      account.providerAccountId,
      account.access_token,
      account.expires_at,
      account.refresh_token,
      account.id_token,
      account.scope,
      account.session_state,
      account.token_type,
    ]

    const result = await this.pg.query(sql, params)

    const updateVerifiedSql = `
        UPDATE users set
        "emailVerified" = CURRENT_TIMESTAMP
        where id = $1
      `
    await this.pg.query(updateVerifiedSql, [account.userId])

    return mapExpiresAt(result.rows[0])
  }

  async unlinkAccount(providerAccountId: string, provider: string) {
    const sql = `delete from accounts where "providerAccountId" = $1 and provider = $2`
    await this.pg.query(sql, [providerAccountId, provider])
  }

  async createSession(session: {
    sessionToken: string
    userId: string
    expires: Date
  }) {
    const sql = `insert into sessions ("userId", expires, "sessionToken")
      values ($1, $2, $3)
      RETURNING id, "sessionToken", "userId", expires`

    const result = await this.pg.query(sql, [
      session.userId,
      session.expires,
      session.sessionToken,
    ])
    return result.rows[0]
  }

  async getSessionAndUser(sessionToken: string): Promise<{
    session: AdapterSession
    user: AdapterUser
  } | null> {
    if (sessionToken === undefined) {
      return null
    }
    const result1 = await this.pg.query(
      `select * from sessions where "sessionToken" = $1`,
      [sessionToken],
    )
    if (result1.rowCount === 0) {
      return null
    }
    const session: AdapterSession = result1.rows[0]

    const result2 = await this.pg.query('select * from users where id = $1', [
      session.userId,
    ])
    if (result2.rowCount === 0) {
      return null
    }
    const user = result2.rows[0]
    return {
      session,
      user,
    }
  }

  async updateSession(
    session: Partial<AdapterSession> & Pick<AdapterSession, 'sessionToken'>,
  ): Promise<AdapterSession | null | undefined> {
    const { sessionToken } = session
    const result1 = await this.pg.query(
      `select * from sessions where "sessionToken" = $1`,
      [sessionToken],
    )
    if (result1.rowCount === 0) {
      return null
    }
    const originalSession: AdapterSession = result1.rows[0]

    const newSession: AdapterSession = {
      ...originalSession,
      ...session,
    }
    const sql = `
        UPDATE sessions set
        expires = $2
        where "sessionToken" = $1
        `
    const result = await this.pg.query(sql, [
      newSession.sessionToken,
      newSession.expires,
    ])
    return result.rows[0]
  }

  async deleteSession(sessionToken: string) {
    const sql = `delete from sessions where "sessionToken" = $1`
    await this.pg.query(sql, [sessionToken])
  }

  async createVerificationToken(
    verificationToken: VerificationToken,
  ): Promise<VerificationToken> {
    const { identifier, expires, token } = verificationToken
    const sql = `
        INSERT INTO verification_token ( identifier, expires, token )
        VALUES ($1, $2, $3)
        `
    await this.pg.query(sql, [identifier, expires, token])
    return verificationToken
  }

  async useVerificationToken(params: {
    identifier: string
    token: string
  }): Promise<VerificationToken> {
    const sql = `delete from verification_token
      where identifier = $1 and token = $2
      RETURNING identifier, expires, token `
    const result = await this.pg.query(sql, [params.identifier, params.token])
    return result.rowCount !== 0 ? result.rows[0] : null
  }
}
