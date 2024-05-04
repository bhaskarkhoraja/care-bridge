import { render } from "@react-email/render"
import { siteConfig } from "@web/src/config/site"
import Login from "@web/src/emails/login"
import Signup from "@web/src/emails/signup"
import { webEnv } from "@web/src/lib/env"
import { NestAdapter } from "@web/src/lib/nest-adapter"
import axios from "axios"
import { NextAuthOptions } from "next-auth"
import EmailProvider from "next-auth/providers/email"
import GitHubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import { createTransport } from "nodemailer"

export const authOptions: NextAuthOptions = {
  adapter: NestAdapter(),
  session: {
    strategy: "database",
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
      // For refresh token
      authorization: { params: { access_type: "offline", prompt: "consent" } },
      profile(profile) {
        // Determine if the user is admin or not
        let role = "user"
        if (profile.email === webEnv.NODEMAILER_EMAIL) {
          role = "admin"
        }
        return {
          ...profile,
          id: profile.sub, // profile.sub is the provider id
          image: profile.picture,
          role,
        }
      },
    }),
    EmailProvider({
      sendVerificationRequest: async ({ identifier, url }) => {
        // Check is user already has an account and has verified before
        const response = await axios.get(
          `${webEnv.SERVER_URL}/auth/verified-user`,
          {
            params: { email: identifier },
            headers: {
              "Content-Type": "application/json",
              "x-auth-secret": webEnv.NEXTAUTH_SECRET,
            },
          }
        )

        const user = response.data

        const transporter = createTransport({
          host: "smtp.gmail.com",
          port: 465,
          secure: true,
          auth: {
            user: webEnv.NODEMAILER_EMAIL,
            pass: webEnv.NODEMAILER_PW,
          },
        })

        await transporter.sendMail({
          from: `Care Bridge <${webEnv.NODEMAILER_EMAIL}>`,
          to: identifier,
          subject: user
            ? `Sign-in link for ${siteConfig.name}`
            : "Activate your account",
          html: render(user ? Login({ link: url }) : Signup({ link: url })),
          text: url,
          // Set this to prevent Gmail from threading emails.
          // See https://stackoverflow.com/questions/23434110/force-emails-not-to-be-grouped-into-conversations/25435722.
          headers: { "X-Entity-Ref-ID": new Date().getTime() + "" },
        })
      },
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      session.user.role = user.role
      session.user.completed_profile = user.completed_profile
      session.user.profile_id = user.profile_id
      session.user.type = user.type
      session.user.verified = user.verified
      return session
    },
  },
} satisfies NextAuthOptions
