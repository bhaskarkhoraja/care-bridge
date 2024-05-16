"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useSelectedLayoutSegment } from "next/navigation"
import { getSenderDetails } from "@web/src/actions/user/message"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@web/src/components/ui/avatar"
import { webEnv } from "@web/src/lib/env"
import { cn, formatDistance, getShortName } from "@web/src/lib/utils"
import { MessageSchema, SideMessageSchema } from "api-contract/types"
import { formatDistanceToNowStrict } from "date-fns"
import locale from "date-fns/locale/en-US"
import { Dot } from "lucide-react"
import { Session } from "next-auth"
import { io } from "socket.io-client"
import { z } from "zod"

interface SideMessageProps {
  data: z.infer<typeof SideMessageSchema>[]
  user: Session["user"]
}

const SideMessage: React.FC<SideMessageProps> = ({ data, user }) => {
  const segment = useSelectedLayoutSegment()
  const [messages, setMessages] =
    useState<z.infer<typeof SideMessageSchema>[]>(data)
  const [mounted, setMounted] = useState(false)

  const socket = useMemo(
    () =>
      io(`${webEnv.NEXT_PUBLIC_SERVER_URL}`, {
        autoConnect: true,
        path: "/user/message/socket.io",
        auth: { username: user.id },
      }),
    [user.id]
  )

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    socket.on("recieveMessage", (newMessage: z.infer<typeof MessageSchema>) => {
      updateMessage(newMessage)
    })
    socket.on("seenMessage", (newMessage: z.infer<typeof MessageSchema>) => {
      seenMessage(newMessage)
    })
  }, [messages, socket, user.profile_id])

  const updateMessage = async (newMessage: z.infer<typeof MessageSchema>) => {
    if (
      newMessage.senderProfileId !== user.profile_id &&
      newMessage.recieverProfileId !== user.profile_id
    )
      return
    const existingMessageIndex = messages.findIndex((msg) => {
      if (newMessage.senderProfileId === user.profile_id) {
        return (
          msg.recieverProfile.id === newMessage.recieverProfileId ||
          msg.senderProfile.id === newMessage.recieverProfileId
        )
      } else if (newMessage.recieverProfileId === user.profile_id) {
        return (
          msg.recieverProfile.id === newMessage.senderProfileId ||
          msg.senderProfile.id === newMessage.senderProfileId
        )
      } else {
        return false
      }
    })

    if (existingMessageIndex !== -1) {
      const updatedMessages = [...messages]
      const existingMessage = updatedMessages.splice(existingMessageIndex, 1)[0]

      existingMessage.message = newMessage.message
      existingMessage.createdAt = newMessage.createdAt
      existingMessage.isRead = newMessage.isRead
      existingMessage.id = newMessage.id

      updatedMessages.unshift(existingMessage)
      setMessages(updatedMessages)
    } else {
      const newUserProfile = await getSenderDetails(
        newMessage.senderProfileId === user.profile_id
          ? newMessage.recieverProfileId
          : newMessage.senderProfileId
      )
      if (newUserProfile.status !== 200) return
      const updatedMessages = [...messages]
      const newUserMessage: z.infer<typeof SideMessageSchema> = {
        id: newMessage.id,
        message: newMessage.message,
        isRead: newMessage.isRead,
        createdAt: newMessage.createdAt,
        senderProfile:
          newMessage.senderProfileId === user.profile_id
            ? messages[0].senderProfile.id === user.profile_id
              ? messages[0].senderProfile
              : messages[0].recieverProfile
            : {
                id: newMessage.senderProfileId,
                firstName: newUserProfile.body.data.firstName,
                middleName: newUserProfile.body.data.middleName,
                lastName: newUserProfile.body.data.lastName,
                gender: "others", // kept temporarly to fullfill types
                email: newUserProfile.body.data.email,
                dob: new Date(), // kept temporarly to fullfill types
                userName: "newUser", // kept temporarly to fullfill types
                profileUrl: newUserProfile.body.data.profileUrl,
              },
        recieverProfile:
          newMessage.recieverProfileId === user.profile_id
            ? messages[0].recieverProfile.id === user.profile_id
              ? messages[0].recieverProfile
              : messages[0].senderProfile
            : {
                id: newMessage.senderProfileId,
                firstName: newUserProfile.body.data.firstName,
                middleName: newUserProfile.body.data.middleName,
                lastName: newUserProfile.body.data.lastName,
                gender: "others", // kept temporarly to fullfill types
                email: newUserProfile.body.data.email,
                dob: new Date(), // kept temporarly to fullfill types
                userName: "newUser", // kept temporarly to fullfill types
                profileUrl: newUserProfile.body.data.profileUrl,
              },
      }

      updatedMessages.unshift(newUserMessage)
      setMessages(updatedMessages)
    }
  }

  const seenMessage = (newMessage: z.infer<typeof MessageSchema>) => {
    const matchingMessage = messages.find(
      (message) =>
        (message.senderProfile.id === newMessage.senderProfileId &&
          message.recieverProfile.id === newMessage.recieverProfileId) ||
        (message.senderProfile.id === newMessage.recieverProfileId &&
          message.recieverProfile.id === newMessage.senderProfileId)
    )

    if (!matchingMessage) {
      return
    }

    if (!matchingMessage.isRead) {
      const updatedMessages = messages.map((message) =>
        message === matchingMessage ? { ...message, isRead: true } : message
      )
      setMessages(updatedMessages)
    }
  }

  return (
    <div>
      {messages.map((message) => (
        <Link
          href={`/user/message/${message.senderProfile.id === user.profile_id ? message.recieverProfile.id : message.senderProfile.id}`}
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
            <p className={cn("font-semibold", !message.isRead && "font-bold")}>
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
              <p className="max-w-48 truncate">{message.message}</p>
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
