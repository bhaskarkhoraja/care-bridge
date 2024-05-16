import { AdapterUser } from 'next-auth/adapters'
import '@app-type/lib/next-auth'
import '@app-type/lib/socket-io'

declare module 'express' {
  interface Request {
    user?: AdapterUser
  }
}
