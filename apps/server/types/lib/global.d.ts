import { AdapterUser } from 'next-auth/adapters'

declare module 'express' {
  interface Request {
    user?: AdapterUser
  }
}
