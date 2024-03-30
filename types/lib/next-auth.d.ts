// Ref: https://next-auth.js.org/getting-started/typescript#module-augmentation
import { DefaultSession, DefaultUser } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: "admin" | "user"
      completed_profile: boolean
    } & DefaultSession
  }

  interface User extends DefaultUser {
    role: "admin" | "user"
    completed_profile: boolean
  }
}
