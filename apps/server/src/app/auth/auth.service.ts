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

@Injectable()
export class AuthService {
  constructor(@InjectClient() private readonly pg: Client) {}

  async createUser(user: Omit<AdapterUser, 'id'>) {
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
    const sql = `SELECT * FROM users WHERE email = $1`
    const result = await this.pg.query(sql, [email])

    if (result.rowCount !== 0) {
      const user = result.rows[0]

      if (user.completed_profile) {
        const profileSql = `SELECT * FROM profile WHERE user_id = $1`
        const profileResult = await this.pg.query(profileSql, [user.id])

        if (profileResult.rowCount !== 0) {
          const profile = profileResult.rows[0]
          const fullName = profile.middle_name
            ? `${profile.first_name} ${profile.middle_name} ${profile.last_name}`
            : `${profile.first_name} ${profile.last_name}`

          return {
            id: user.id,
            name: fullName,
            image: profile.profile_url,
            completed_profile: user.completed_profile,
            email: user.email,
            emailVerified: user.emailVerified,
            role: user.role,
            type: user.type,
            profile_id: profile.id,
          }
        }
      }
      return user
    }

    return null
  }

  async getVerifiedUserByEmail(email: string) {
    const sql = `SELECT * FROM users WHERE email = $1 AND "emailVerified" IS NOT NULL`
    const result = await this.pg.query(sql, [email])

    if (result.rowCount !== 0) {
      const user = result.rows[0]

      if (user.completed_profile) {
        const profileSql = `SELECT * FROM profile WHERE user_id = $1`
        const profileResult = await this.pg.query(profileSql, [user.id])

        if (profileResult.rowCount !== 0) {
          const profile = profileResult.rows[0]
          const fullName = profile.middle_name
            ? `${profile.first_name} ${profile.middle_name} ${profile.last_name}`
            : `${profile.first_name} ${profile.last_name}`

          return {
            id: user.id,
            name: fullName,
            image: profile.profile_url,
            completed_profile: user.completed_profile,
            email: user.email,
            emailVerified: user.emailVerified,
            role: user.role,
            type: user.type,
            profile_id: profile.id,
          }
        }
      }
      return user
    }

    return null
  }

  async getUserByAccount(
    providerAccountId: string,
    provider: string,
  ): Promise<AdapterUser | null> {
    const sql = `
    SELECT
        u.id as user_id, u.name, u.image, u.completed_profile, u.email,u."emailVerified", u.role, u.type,
        p.id as profile_id, p.first_name, p.middle_name, p.last_name, p.profile_url
        FROM users u
        JOIN accounts a ON u.id = a."userId"
        LEFT JOIN profile p ON u.id = p.user_id
        WHERE a.provider = $1
        AND a."providerAccountId" = $2
    `

    const result = await this.pg.query(sql, [provider, providerAccountId])

    if (result.rowCount !== 0) {
      const data = result.rows[0]
      let fullName, image

      if (data.completed_profile && data.profile_id) {
        fullName = data.middle_name
          ? `${data.first_name} ${data.middle_name} ${data.last_name}`
          : `${data.first_name} ${data.last_name}`
      }
      return {
        id: data.user_id,
        name: fullName,
        image: image,
        completed_profile: data.completed_profile,
        email: data.email,
        emailVerified: data.emailVerified,
        role: data.role,
        type: data.type,
        profile_id: data.profile_id,
      }
    }

    return null
  }

  async getUser(id: string) {
    const sql = `select * from users where id = $1`
    try {
      const result = await this.pg.query(sql, [id])

      if (result.rowCount !== 0) {
        const user = result.rows[0]
        const profile = result.rows[0]

        if (user.completed_profile && profile) {
          const fullName = profile.middle_name
            ? `${profile.first_name} ${profile.middle_name} ${profile.last_name}`
            : `${profile.first_name} ${profile.last_name}`

          return {
            id: user.id,
            name: fullName,
            image: profile.profile_url,
            completed_profile: user.completed_profile,
            email: user.email,
            emailVerified: user.emailVerified,
            role: user.role,
            type: user.type,
            profile_id: profile.id,
          }
        }
        return user
      }
      return null
    } catch {
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

    const {
      id,
      name,
      email,
      emailVerified,
      image,
      role,
      completed_profile,
      type,
    } = newUser
    const updateSql = `
        UPDATE users set
        name = $2, email = $3, "emailVerified" = $4, image = $5, role = $6, completed_profile = $7, type = $8
        where id = $1
        RETURNING name, id, email, "emailVerified", image
      `
    const query2 = await this.pg.query(updateSql, [
      id,
      name,
      email,
      emailVerified,
      image,
      role,
      completed_profile,
      type,
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

    const result2 = await this.pg.query(`SELECT * from users WHERE id = $1`, [
      session.userId,
    ])

    let newUser

    if (result2.rowCount !== 0) {
      newUser = result2.rows[0]

      const profileSql = `SELECT * FROM profile WHERE user_id = $1`
      const profileResult = await this.pg.query(profileSql, [newUser.id])

      if (profileResult.rowCount !== 0) {
        const profile = profileResult.rows[0]
        const fullName = profile.middle_name
          ? `${profile.first_name} ${profile.middle_name} ${profile.last_name}`
          : `${profile.first_name} ${profile.last_name}`

        newUser = {
          id: newUser.id,
          name: fullName,
          image: profile.profile_url ? profile.profile_url : newUser.image,
          completed_profile: newUser.completed_profile,
          email: newUser.email,
          emailVerified: newUser.emailVerified,
          role: newUser.role,
          type: newUser.type,
          profile_id: profile.id,
        }
      }

      return {
        session,
        user: newUser,
      }
    }

    return null
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
