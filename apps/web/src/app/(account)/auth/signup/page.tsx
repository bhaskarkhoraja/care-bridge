import Link from "next/link"
import { Icons } from "@web/src/components/icons"
import ModeToggle from "@web/src/components/theme/mode-toggle"
import { buttonVariants } from "@web/src/components/ui/button"
import { cn } from "@web/src/lib/utils"
import { ChevronLeft } from "lucide-react"

import AuthForm from "../../_components/auth-form"

export const metadata = {
  title: "Create an account",
  description: "Create an account to get started.",
}

export default function RegisterPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="container absolute top-8 flex w-full items-start justify-between">
        <Link
          href="/"
          className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
        >
          <ChevronLeft className="mr-2 size-4" />
          Home
        </Link>
        <div className="flex items-center gap-5">
          <ModeToggle type="button" />
          <Link
            href="/auth/login"
            className={cn(buttonVariants({ variant: "default", size: "sm" }))}
          >
            Login
          </Link>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <Icons.logofull className="mx-auto h-10 w-fit" />
            <h1 className="text-2xl font-semibold tracking-tight">
              Create an account
            </h1>
            <p className="text-muted-foreground text-sm">
              Enter your email below to create your account
            </p>
          </div>
          <AuthForm />
          <p className="text-muted-foreground px-8 text-center text-sm">
            By clicking continue, you agree to our{" "}
            <Link
              href="/terms"
              className="hover:text-brand underline underline-offset-4"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="hover:text-brand underline underline-offset-4"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
