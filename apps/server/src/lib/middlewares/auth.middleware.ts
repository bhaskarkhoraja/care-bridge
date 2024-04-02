import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common'
import { serverEnv } from '@server/src/lib/env.validation'
import { NextFunction, Request, Response } from 'express'

/**
 * Only accept the request if headers match x-auth-secret
 **/
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  async use(req: Request, _res: Response, next: NextFunction) {
    if (req.headers['x-auth-secret'] !== serverEnv.NEXTAUTH_SECRET) {
      throw new UnauthorizedException('Auth secret not provided or incorrect')
    }

    next()
  }
}
