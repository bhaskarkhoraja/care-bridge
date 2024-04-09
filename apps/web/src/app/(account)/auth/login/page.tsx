import { Suspense } from "react"
import { Metadata } from "next"
import Link from "next/link"
import { Icons } from "@web/src/components/icons"
import BackButton from "@web/src/components/layout/back-button"
import ModeToggle from "@web/src/components/theme/mode-toggle"
import { buttonVariants } from "@web/src/components/ui/button"
import { cn } from "@web/src/lib/utils"

import AuthForm from "../../_components/auth-form"

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your account",
}

export default function LoginPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="container absolute top-8 flex w-full items-start justify-between">
        <BackButton />
        <div className="flex items-center gap-5">
          <ModeToggle type="button" />
          <Link
            href="/auth/signup"
            className={cn(buttonVariants({ variant: "default", size: "sm" }))}
          >
            Signup
          </Link>
        </div>
      </div>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <Icons.logofull className="mx-auto h-10 w-fit" />
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome back
          </h1>
          <p className="text-muted-foreground text-sm">
            Enter your email to sign in to your account
          </p>
        </div>
        <Suspense>
          <AuthForm />
        </Suspense>
        <p className="text-muted-foreground px-8 text-center text-sm">
          <Link
            href="/auth/signup"
            className="hover:text-brand underline underline-offset-4"
          >
            Don&apos;t have an account? Sign Up
          </Link>
        </p>
      </div>
    </div>
  )
}
