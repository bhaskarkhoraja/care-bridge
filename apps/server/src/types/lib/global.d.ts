import { AdapterUser } from 'next-auth/adapters'
import '@app-type/lib/next-auth'

declare module 'express' {
  interface Request {
    user?: AdapterUser
  }
}
