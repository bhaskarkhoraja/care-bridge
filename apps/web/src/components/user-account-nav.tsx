"use client"

import { useEffect } from "react"
import Link from "next/link"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@web/src/components/ui/avatar"
import { Button } from "@web/src/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@web/src/components/ui/dropdown-menu"
import { UserType } from "@web/src/types/user"
import { Session } from "next-auth"
import { signOut } from "next-auth/react"
import { toast } from "sonner"

import { switchBuyerSeller } from "../actions/user"

interface UserAccountNavProps extends React.HTMLAttributes<HTMLDivElement> {
  user: Session["user"]
  userType: UserType | undefined
}

/**
 * Get user initials, Bhaskar Khoraja -> BK
 **/
function getShortName(name: string): string {
  let names = name.split(" ")
  let shortName = ""

  if (names.length === 1) {
    shortName = names[0].charAt(0).toUpperCase()
  } else {
    shortName =
      names[0].charAt(0).toUpperCase() +
      names[names.length - 1].charAt(0).toUpperCase()
  }

  return shortName
}

export const UserAccountNav = ({ user, userType }: UserAccountNavProps) => {
  /**
   * Switch user type
   **/
  async function switchUserType() {
    try {
      const userType = await switchBuyerSeller()

      if (userType) {
        toast.success(
          `Switched To ${userType[0].toUpperCase() + userType.slice(1)}.`
        )
      }
    } catch {
      toast.error(`Failed to switch user.`)
    }
  }

  // Switch user to buyer if its undefined
  useEffect(() => {
    if (!userType) {
      switchUserType()
    }
  }, [userType])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"ghost"} className="h-fit rounded-full p-0">
          <Avatar>
            <AvatarImage
              src={user.image as string}
              alt={user.email as string}
            />
            <AvatarFallback>
              {getShortName(user.name ?? "New User")}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            <p className="font-medium">{user.name ?? "New User"}</p>
            {user.email && (
              <p className="text-muted-foreground w-[200px] truncate text-sm">
                {user.email}
              </p>
            )}
          </div>
        </div>
        {user.completed_profile ? (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/billing">Billing</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={(event) => {
                event.preventDefault()
                switchUserType()
              }}
            >
              Switch to {userType}
            </DropdownMenuItem>
            {user.role === "admin" && (
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings">Admin Panel</Link>
              </DropdownMenuItem>
            )}
          </>
        ) : null}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={(event) => {
            event.preventDefault()
            signOut({
              callbackUrl: `${window.location.origin}/auth/login`,
            })
          }}
        >
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
