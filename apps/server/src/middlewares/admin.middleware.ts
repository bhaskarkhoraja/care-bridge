import {
  ForbiddenException,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common'
import { AuthService } from '@server/auth/auth.service'
import { NextFunction, Request } from 'express'
import { Response } from 'supertest'

/**
 * Only accept the request if the user is an admin
 **/
@Injectable()
export class AdminMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}
  async use(req: Request, _res: Response, next: NextFunction) {
    /* https://github.com/nextauthjs/next-auth/blob/11cfb0a3fbbe53b05609ff2c18937d6bc355c7d8/packages/core/src/jwt.ts#L138 */
    /* using process.env instead of serverEnv as we only need it here */
    const secureCookie =
      process.env.NEXTAUTH_URL?.startsWith('https://') ?? !!process.env.VERCEL
    const cookieName = secureCookie
      ? '__Secure-next-auth.session-token'
      : 'next-auth.session-token'

    if (req.cookies[cookieName]) {
      const result = await this.authService.getSessionAndUser(
        req.cookies[cookieName],
      )
      if (result && result.user.role === 'admin') {
        req.user = result.user
        return next()
      }
      throw new ForbiddenException('Credentials not provided or incorrect')
    }

    throw new UnauthorizedException('Credentials not provided or incorrect')
  }
}
