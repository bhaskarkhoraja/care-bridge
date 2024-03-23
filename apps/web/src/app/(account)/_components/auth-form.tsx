"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Icons } from "@web/src/components/icons"
import { Button } from "@web/src/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@web/src/components/ui/form"
import { Input } from "@web/src/components/ui/input"
import {
  AuthLoadingState,
  authSchema,
  signinErrors,
  SignInPageErrorParam,
} from "@web/src/types/auth"
import { signIn } from "next-auth/react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

const AuthForm = () => {
  const [authLoading, setAuthLoading] = React.useState<AuthLoadingState>({
    emailLoading: false,
    githubLoading: false,
    googleLoading: false,
  })

  const form = useForm<z.infer<typeof authSchema>>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
    },
  })

  async function onSubmit(data: z.infer<typeof authSchema>) {
    setAuthLoading({ ...authLoading, emailLoading: true })

    try {
      const signInResult = await signIn("email", {
        email: data.email.toLowerCase(),
        callbackUrl: "/",
        redirect: false,
      })

      if (!signInResult?.ok) {
        return toast.success("check your email", {
          description:
            "we sent you a login link. be sure to check your spam too.",
        })
      }
      throw new Error()
    } catch {
      return toast.error("Something went wrong", {
        description: "Your sign in request failed. Please try again.",
      })
    } finally {
      setAuthLoading({ ...authLoading, emailLoading: false })
    }
  }

  return (
    <div className="space-y-6 font-sans">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input label="Email" associationTag="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full"
            disabled={authLoading.emailLoading}
          >
            {authLoading.emailLoading && (
              <Icons.spinner className="mr-2 size-4 animate-spin" />
            )}
            Sign In with Email
          </Button>
        </form>
      </Form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background text-muted-foreground px-2">
            Or continue with
          </span>
        </div>
      </div>
      <div className="space-y-2">
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => {
            setAuthLoading({ ...authLoading, githubLoading: true })
            signIn("github", {
              callbackUrl: "/",
            })
          }}
          disabled={
            authLoading.emailLoading ||
            authLoading.googleLoading ||
            authLoading.githubLoading
          }
        >
          {authLoading.githubLoading ? (
            <Icons.spinner className="mr-2 size-4 animate-spin" />
          ) : (
            <Icons.gitHub className="mr-2 size-4" />
          )}
          Github
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => {
            setAuthLoading({ ...authLoading, googleLoading: true })
            signIn("google", {
              callbackUrl: "/",
            })
          }}
          disabled={
            authLoading.emailLoading ||
            authLoading.googleLoading ||
            authLoading.githubLoading
          }
        >
          {authLoading.googleLoading ? (
            <Icons.spinner className="mr-2 size-4 animate-spin" />
          ) : (
            <Icons.google className="mr-2 size-4 stroke-2" />
          )}
          Google
        </Button>
      </div>
    </div>
  )
}

export default AuthForm
