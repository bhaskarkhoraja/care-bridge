import { z } from "zod"

/**
 * Loading state for auth form
 **/
export type AuthLoadingState = {
  emailLoading: boolean
  githubLoading: boolean
  googleLoading: boolean
}

/**
 * Sign in errors params in url
 * [https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/types.ts#L412]
 **/
export type SignInPageErrorParam =
  | "Signin"
  | "OAuthSignin"
  | "OAuthCallbackError"
  | "OAuthCreateAccount"
  | "EmailCreateAccount"
  | "Callback"
  | "OAuthAccountNotLinked"
  | "EmailSignin"
  | "CredentialsSignin"
  | "SessionRequired"

/**
 * Mapping SignInPageErrorParam with errors messages for toasts
 * [https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/lib/pages/signin.tsx#L8]
 **/
export const signinErrors: Record<SignInPageErrorParam | "default", string> = {
  default: "Unable to sign in.",
  Signin: "Try signing in with a different account.",
  OAuthSignin: "Try signing in with a different account.",
  OAuthCallbackError: "Try signing in with a different account.",
  OAuthCreateAccount: "Try signing in with a different account.",
  EmailCreateAccount: "Try signing in with a different account.",
  Callback: "Try signing in with a different account.",
  OAuthAccountNotLinked:
    "To confirm your identity, sign in with the same account you used originally.",
  EmailSignin: "The e-mail could not be sent.",
  CredentialsSignin:
    "Sign in failed. Check the details you provided are correct.",
  SessionRequired: "Please sign in to access this page.",
}

/**
 * Schema for auth form
 **/
export const authSchema = z.object({
  email: z.string().email(),
})
