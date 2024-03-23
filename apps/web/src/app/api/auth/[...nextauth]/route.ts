import { webEnv } from "@web/src/lib/env.mjs"
import NextAuth from "next-auth"
import EmailProvider from "next-auth/providers/email"
import GitHubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"

import { NestAdapter } from "./nest-adapter"

const handler = NextAuth({
  adapter: NestAdapter(),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/login",
  },
  providers: [
    GitHubProvider({
      clientId: webEnv.GITHUB_CLIENT_ID,
      clientSecret: webEnv.GITHUB_CLIENT_SECRET,
    }),
    GoogleProvider({
      clientId: webEnv.GOOGLE_CLIENT_ID,
      clientSecret: webEnv.GOOGLE_CLIENT_SECRET,
    }),
    EmailProvider({
      sendVerificationRequest: async ({ identifier, url, provider }) => {
        /* TODO: send email  */
      },
    }),
  ],
  callbacks: {
    jwt({ token, trigger, session }) {
      if (trigger === "update") token.name = session.user.name
      return token
    },
  },
})

export { handler as GET, handler as POST }
