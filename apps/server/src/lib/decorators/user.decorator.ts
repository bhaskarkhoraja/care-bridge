import { ExecutionContext, createParamDecorator } from '@nestjs/common'
import { AdapterUser } from 'next-auth/adapters'

/**
 * Create decorator for getting user information from request
 **/
export const User = createParamDecorator(
  (data: keyof AdapterUser, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest()
    return data ? request.user?.[data] : request.user
  },
)
