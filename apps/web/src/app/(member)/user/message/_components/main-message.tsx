"use client"

import { FormEvent, useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { markMessages } from "@web/src/actions/user/message"
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
  DropdownMenuTrigger,
} from "@web/src/components/ui/dropdown-menu"
import { Input } from "@web/src/components/ui/input"
import { ScrollArea } from "@web/src/components/ui/scroll-area"
import { webEnv } from "@web/src/lib/env"
import { cn, getShortName } from "@web/src/lib/utils"
import { MessageSchema, SenderDetailsSchema } from "api-contract/types"
import { Ellipsis, SendHorizonal } from "lucide-react"
import { Session } from "next-auth"
import NProgress from "nprogress"
import { io } from "socket.io-client"
import { toast } from "sonner"
import { v4 as uuidv4 } from "uuid"
import { z } from "zod"

interface MainMessageProps {
  data: z.infer<typeof MessageSchema>[] | undefined
  senderId: string
  senderDetails: z.infer<typeof SenderDetailsSchema>
  user: Session["user"]
}

const MainMessage: React.FC<MainMessageProps> = ({
  data,
  senderId,
  senderDetails,
  user,
}) => {
  const [messages, setMessages] = useState<
    z.infer<typeof MessageSchema>[] | undefined
  >(data)
  const messageEndRef = useRef<HTMLDivElement | null>(null)
  const [input, setInput] = useState("")
  const socket = useMemo(
    () =>
      io(`${webEnv.NEXT_PUBLIC_SERVER_URL}`, {
        autoConnect: true,
        path: "/user/message/socket.io",
        auth: { username: user.id },
      }),
    [user.id]
  )
  const router = useRouter()

  useEffect(() => {
    socket.on("recieveMessage", (newMessage: z.infer<typeof MessageSchema>) => {
      if (
        newMessage &&
        newMessage.senderProfileId === senderId &&
        newMessage.recieverProfileId === user.profile_id
      ) {
        setMessages((prevMessages) => {
          if (
            prevMessages &&
            !prevMessages.some((msg) => msg.id === newMessage.id)
          ) {
            return [...prevMessages, newMessage]
          } else {
            return prevMessages || [{ ...newMessage }]
          }
        })
      }
    })
    if (messages && messages.length > 0) {
      const allRead = messages.every((message) => message.isRead)

      if (!allRead) {
        socket.emit("sawMessage", messages[0])
      }
    }
    setTimeout(() => {
      if (messageEndRef && messageEndRef.current) {
        messageEndRef.current.scrollIntoView({ block: "end" })
      }
    }, 100)
  }, [senderId, socket, user.profile_id])

  const handleSendMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!input.length) return

    const newMessage: z.infer<typeof MessageSchema> = {
      id: uuidv4(),
      message: input,
      createdAt: new Date(),
      isRead: false,
      senderProfileId: user.profile_id as string,
      recieverProfileId: senderId,
    }

    socket.emit("sendMessage", newMessage)

    setMessages((prevMessages) => {
      if (prevMessages) {
        return [...prevMessages, newMessage]
      } else {
        return [newMessage]
      }
    })
    setInput("")
    setTimeout(() => {
      if (messageEndRef && messageEndRef.current) {
        messageEndRef.current.scrollIntoView({ block: "end" })
      }
    }, 100)
  }

  const updateMessageStaus = (action: "close" | "spam") => {
    toast.promise(pendingActions(action), {
      loading: "Loading...",
      success: (msg) => {
        NProgress.start()
        router.push(
          `/user/${action === "spam" ? "spam-message" : "archive-message"}/${senderId}`
        )
        return msg
      },
      error: (msg) => msg,
    })
  }

  const pendingActions = async (action: "close" | "spam") => {
    const result = await markMessages(senderId, action)

    if (result.status === 200) {
      return result.body.message
    } else {
      throw new Error(result.body.message)
    }
  }

  return (
    <main>
      <div className="mb-4 flex w-full items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="size-10">
            <AvatarImage
              src={senderDetails.profileUrl}
              alt={
                senderDetails.middleName
                  ? `${senderDetails.firstName} ${senderDetails.middleName} ${senderDetails.lastName}`
                  : `${senderDetails.firstName} ${senderDetails.lastName}`
              }
            />
            <AvatarFallback className="text-md">
              {getShortName(
                senderDetails.middleName
                  ? `${senderDetails.firstName} ${senderDetails.middleName} ${senderDetails.lastName}`
                  : `${senderDetails.firstName} ${senderDetails.lastName}`
              )}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">
              {senderDetails.middleName
                ? `${senderDetails.firstName} ${senderDetails.middleName} ${senderDetails.lastName}`
                : `${senderDetails.firstName} ${senderDetails.lastName}`}
            </p>
            <p className="text-muted-foreground text-sm">
              {senderDetails.email}
            </p>
          </div>
        </div>
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button type="button" size="icon">
                <Ellipsis className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => updateMessageStaus("close")}>
                Archive chat
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => updateMessageStaus("spam")}>
                Mark as spam
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="w-full border-t pt-4 md:sticky lg:z-30 lg:-ml-2 lg:mt-0 lg:h-[calc(100vh-14rem)] lg:shrink-0">
        <ScrollArea className="h-full">
          {messages ? (
            messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "mb-1 flex w-fit max-w-[75vw] flex-col gap-2 break-words rounded-lg px-3 py-2 text-sm lg:max-w-[50vw]",
                  message.senderProfileId === senderId
                    ? "bg-muted"
                    : "bg-foreground text-background/95 ml-auto mr-4"
                )}
              >
                <p>{message.message}</p>
              </div>
            ))
          ) : (
            <p></p>
          )}
          <div ref={messageEndRef} />
        </ScrollArea>
      </div>
      <form
        onSubmit={handleSendMessage}
        className="mt-4 flex w-full items-center space-x-2"
      >
        <Input
          label=""
          id="message"
          placeholder="Type your message..."
          className="flex-1 p-2"
          autoComplete="off"
          value={input}
          onChange={(event) => setInput(event.target.value)}
        />
        <Button type="submit" size="icon" disabled={input.length === 0}>
          <SendHorizonal className="size-5" />
          <span className="sr-only">Send</span>
        </Button>
      </form>
    </main>
  )
}

export default MainMessage
