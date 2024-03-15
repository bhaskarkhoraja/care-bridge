"use client"

import * as React from "react"
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
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

const authSchema = z.object({
  email: z.string().email(),
})

interface AuthLoadingState {
  emailLoading: boolean
  githubLoading: boolean
  googleLoading: boolean
}

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

  function onSubmit(values: z.infer<typeof authSchema>) {
    toast("Check your email", {
      description: "We sent you a login link. Be sure to check your spam too.",
    })
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
          <Button type="submit" className="w-full">
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
