import { AdapterUser } from 'next-auth/adapters'
import '@types/lib/next-auth'

declare module 'express' {
  interface Request {
    user?: AdapterUser
  }
}
