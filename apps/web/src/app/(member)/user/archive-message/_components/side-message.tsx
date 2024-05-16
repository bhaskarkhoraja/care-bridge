"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useSelectedLayoutSegment } from "next/navigation"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@web/src/components/ui/avatar"
import { cn, formatDistance, getShortName } from "@web/src/lib/utils"
import { SideMessageSchema } from "api-contract/types"
import { formatDistanceToNowStrict } from "date-fns"
import locale from "date-fns/locale/en-US"
import { Dot } from "lucide-react"
import { Session } from "next-auth"
import { z } from "zod"

interface SideMessageProps {
  messages: z.infer<typeof SideMessageSchema>[]
  user: Session["user"]
}

const SideMessage: React.FC<SideMessageProps> = ({ messages, user }) => {
  const segment = useSelectedLayoutSegment()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div>
      {messages.map((message) => (
        <Link
          href={`/user/archive-message/${message.senderProfile.id === user.profile_id ? message.recieverProfile.id : message.senderProfile.id}`}
          key={message.id}
          className={cn(
            "hover:bg-foreground/5 relative flex cursor-pointer gap-4 rounded-md p-4",
            segment ===
              (message.senderProfile.id === user.profile_id
                ? message.recieverProfile.id
                : message.senderProfile.id) &&
              "bg-foreground/90 text-background hover:bg-foreground/90"
          )}
        >
          {!message.isRead &&
            user.profile_id !== message.senderProfile.id &&
            segment !==
              (message.senderProfile.id === user.profile_id
                ? message.recieverProfile.id
                : message.senderProfile.id) && (
              <div className="absolute right-3 top-0 flex h-full items-center justify-center">
                <div className="bg-foreground size-3 rounded-full" />
              </div>
            )}
          <Avatar className="size-10">
            <AvatarImage
              src={
                message.senderProfile.id === user.profile_id
                  ? message.recieverProfile.profileUrl
                  : message.senderProfile.profileUrl
              }
              alt={
                message.senderProfile.id === user.profile_id
                  ? message.recieverProfile.middleName
                    ? `${message.recieverProfile.firstName} ${message.recieverProfile.middleName} ${message.recieverProfile.lastName}`
                    : `${message.recieverProfile.firstName} ${message.recieverProfile.lastName}`
                  : message.senderProfile.middleName
                    ? `${message.senderProfile.firstName} ${message.senderProfile.middleName} ${message.senderProfile.lastName}`
                    : `${message.senderProfile.firstName} ${message.senderProfile.lastName}`
              }
            />
            <AvatarFallback
              className={cn(
                "text-md",
                segment ===
                  (user.profile_id === message.senderProfile.id
                    ? message.recieverProfile.id
                    : message.senderProfile.id) &&
                  "bg-background text-foreground"
              )}
            >
              {getShortName(
                message.senderProfile.id === user.profile_id
                  ? message.recieverProfile.middleName
                    ? `${message.recieverProfile.firstName} ${message.recieverProfile.middleName} ${message.recieverProfile.lastName}`
                    : `${message.recieverProfile.firstName} ${message.recieverProfile.lastName}`
                  : message.senderProfile.middleName
                    ? `${message.senderProfile.firstName} ${message.senderProfile.middleName} ${message.senderProfile.lastName}`
                    : `${message.senderProfile.firstName} ${message.senderProfile.lastName}`
              )}
            </AvatarFallback>
          </Avatar>
          <div>
            <p
              className={cn(
                "min-w-48 overflow-hidden truncate text-wrap font-semibold",
                !message.isRead && "font-bold"
              )}
            >
              {message.senderProfile.id === user.profile_id
                ? message.recieverProfile.middleName
                  ? `${message.recieverProfile.firstName} ${message.recieverProfile.middleName} ${message.recieverProfile.lastName}`
                  : `${message.recieverProfile.firstName} ${message.recieverProfile.lastName}`
                : message.senderProfile.middleName
                  ? `${message.senderProfile.firstName} ${message.senderProfile.middleName} ${message.senderProfile.lastName}`
                  : `${message.senderProfile.firstName} ${message.senderProfile.lastName}`}
            </p>
            <div
              className={cn(
                "text-muted-foreground flex items-center text-sm",
                segment ===
                  (message.senderProfile.id === user.profile_id
                    ? message.recieverProfile.id
                    : message.senderProfile.id) && "text-background/80",
                !message.isRead &&
                  user.profile_id !== message.senderProfile.id &&
                  segment !==
                    (message.senderProfile.id === user.profile_id
                      ? message.recieverProfile.id
                      : message.senderProfile.id) &&
                  "text-foreground font-semibold"
              )}
            >
              <p className="max-w-48 truncate">
                {message.senderProfile.id === user.profile_id ? "You: " : ""}
                {message.message}
              </p>
              {mounted ? (
                <p className="flex items-center justify-center">
                  <Dot />{" "}
                  {formatDistanceToNowStrict(new Date(message.createdAt), {
                    addSuffix: false,
                    locale: {
                      ...locale,
                      formatDistance,
                    },
                  })}
                </p>
              ) : null}
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}

export default SideMessage
