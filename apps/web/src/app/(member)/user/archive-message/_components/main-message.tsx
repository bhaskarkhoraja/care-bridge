"use client"

import { useEffect, useRef } from "react"
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
import { ScrollArea } from "@web/src/components/ui/scroll-area"
import { cn, getShortName } from "@web/src/lib/utils"
import { MessageSchema, SenderDetailsSchema } from "api-contract/types"
import { Ellipsis } from "lucide-react"
import NProgress from "nprogress"
import { toast } from "sonner"
import { z } from "zod"

interface MainMessageProps {
  messages: z.infer<typeof MessageSchema>[] | undefined
  senderId: string
  senderDetails: z.infer<typeof SenderDetailsSchema>
}

const MainMessage: React.FC<MainMessageProps> = ({
  messages,
  senderId,
  senderDetails,
}) => {
  const messageEndRef = useRef<HTMLDivElement | null>(null)
  const router = useRouter()

  useEffect(() => {
    setTimeout(() => {
      if (messageEndRef && messageEndRef.current) {
        messageEndRef.current.scrollIntoView({ block: "end" })
      }
    }, 100)
  }, [])

  const updateMessageStaus = (action: "open" | "spam") => {
    toast.promise(pendingActions(action), {
      loading: "Loading...",
      success: (msg) => {
        NProgress.start()
        router.push(
          `/user/${action === "open" ? "message" : "spam-message"}/${senderId}`
        )
        return msg
      },
      error: (msg) => msg,
    })
  }

  const pendingActions = async (action: "open" | "spam") => {
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
              <DropdownMenuItem onClick={() => updateMessageStaus("open")}>
                Unarchive chat
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
                  "mb-1 flex w-fit max-w-[75%] flex-col gap-2 text-wrap rounded-lg px-3 py-2 text-sm",
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
    </main>
  )
}

export default MainMessage
