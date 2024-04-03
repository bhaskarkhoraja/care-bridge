// Ref: https://next-auth.js.org/getting-started/typescript#module-augmentation
import { DefaultSession, DefaultUser } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: "admin" | "user"
      completed_profile: boolean
      // default types because
      name?: string | null
      email?: string | null
      image?: string | null
    } & DefaultSession
  }

  interface User extends DefaultUser {
    role: "admin" | "user"
    completed_profile: boolean
  }
}
