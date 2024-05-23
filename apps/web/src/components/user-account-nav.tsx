"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@web/src/components/ui/tooltip"
import { Check, Clock4, Plus, X } from "lucide-react"
import { Session } from "next-auth"
import { signOut } from "next-auth/react"
import { toast } from "sonner"

import { setUserType } from "../actions/user"
import { getShortName } from "../lib/utils"

interface UserAccountNavProps extends React.HTMLAttributes<HTMLDivElement> {
  user: Session["user"]
}

export const UserAccountNav = ({ user }: UserAccountNavProps) => {
  const router = useRouter()
  /**
   * Switch user type
   **/
  async function switchUserType() {
    try {
      const userType = await setUserType({
        type: user.type === "buyer" ? "seller" : "buyer",
      })

      if (userType) {
        toast.success(
          `Switched to ${user.type === "buyer" ? "seller" : "buyer"}.`
        )
        router.refresh()
      }
    } catch {
      toast.error(`Failed to switch user.`)
    }
  }

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
            <div className="flex items-center gap-2">
              <p className="font-medium">{user.name ?? "New User"}</p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="">
                    <div>
                      {user.verified === null || user.verified === undefined ? (
                        <Clock4 className="size-3" />
                      ) : !user.verified ? (
                        <X className="size-3" />
                      ) : (
                        <Check className="size-3" />
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    {user.verified === null ? (
                      <p>Verification Pending</p>
                    ) : !user.verified ? (
                      <p>Verification Failed</p>
                    ) : (
                      <p>Verified User</p>
                    )}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
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
              <Link href={`/user/profile/${user.profile_id}`}>Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/user/billing/dashboard">Billing</Link>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={switchUserType}>
              Switch to {user.type === "buyer" ? "seller" : "buyer"}
            </DropdownMenuItem>
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
