"use client"

import { useEffect, useRef, useState } from "react"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@web/src/components/ui/avatar"
import { Button } from "@web/src/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@web/src/components/ui/dropdown-menu"
import { Input } from "@web/src/components/ui/input"
import { ScrollArea, ScrollBar } from "@web/src/components/ui/scroll-area"
import { cn, getShortName } from "@web/src/lib/utils"
import { Dot, Ellipsis, SendHorizonal } from "lucide-react"

/* export const metadata: Metadata = { */
/*   title: "Messages", */
/*   description: "Your Messages" */
/* } */

export default function Messages() {
  const [messages, setMessages] = useState([
    {
      role: "agent",
      content: "Hi, how can I help you today?",
    },
    {
      role: "user",
      content: "Hey, I'm having trouble with my account.",
    },
    {
      role: "agent",
      content: "What seems to be the problem?",
    },
    {
      role: "user",
      content: "I can't log in.",
    },
    {
      role: "user",
      content:
        "Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit enim labore culpa sint ad nisi Lorem pariatur mollit ex esse exercitation amet. Nisi anim cupidatat excepteur officia. Reprehenderit nostrud nostrud.",
    },
    {
      role: "agent",
      content: "Hi, how can I help you today?",
    },
    {
      role: "user",
      content: "Hey, I'm having trouble with my account.",
    },
    {
      role: "agent",
      content: "What seems to be the problem?",
    },
    {
      role: "user",
      content: "I can't log in.",
    },
    {
      role: "user",
      content:
        "Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit enim labore culpa sint ad nisi Lorem pariatur mollit ex esse exercitation amet. Nisi anim cupidatat excepteur officia. Reprehenderit nostrud nostrud.",
    },
    {
      role: "agent",
      content: "Hi, how can I help you today?",
    },
    {
      role: "user",
      content: "Hey, I'm having trouble with my account.",
    },
    {
      role: "agent",
      content: "What seems to be the problem?",
    },
    {
      role: "user",
      content: "I can't log in.",
    },
    {
      role: "user",
      content:
        "Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit enim labore culpa sint ad nisi Lorem pariatur mollit ex esse exercitation amet. Nisi anim cupidatat excepteur officia. Reprehenderit nostrud nostrud.",
    },
  ])

  const [input, setInput] = useState("")
  const inputLength = input.trim().length

  /* return ( */
  /*   <main className="w-full"> */
  /*     <div className="flex-1 items-start lg:grid lg:grid-cols-[400px_minmax(0,1fr)]"> */
  /*       <div>users</div> */
  /*       <div>message</div> */
  /*     </div> */
  /*   </main> */
  /* ) */

  const users = [
    {
      id: 1,
      profileUrl: "https://users.deno.dev/01.jpg",
      firstName: "John",
      middleName: "Doe",
      lastName: "Peter",
      selected: true,
    },
    {
      id: 2,
      profileUrl: "https://users.deno.dev/02.jpg",
      firstName: "Jane",
      middleName: "Doe",
      lastName: "Smith",
      selected: false,
    },
    {
      id: 3,
      profileUrl: "https://users.deno.dev/02.jpg",
      firstName: "Jane",
      middleName: "Doe",
      lastName: "Smith",
      selected: false,
    },
    {
      id: 4,
      profileUrl: "https://users.deno.dev/02.jpg",
      firstName: "Jane",
      middleName: "Doe",
      lastName: "Smith",
      selected: false,
    },
    {
      id: 5,
      profileUrl: "https://users.deno.dev/02.jpg",
      firstName: "Jane",
      middleName: "Doe",
      lastName: "Smith",
      selected: false,
    },
    {
      id: 6,
      profileUrl: "https://users.deno.dev/02.jpg",
      firstName: "Jane",
      middleName: "Doe",
      lastName: "Smith",
      selected: false,
    },
    {
      id: 7,
      profileUrl: "https://users.deno.dev/02.jpg",
      firstName: "Jane",
      middleName: "Doe",
      lastName: "Smith",
      selected: false,
    },
    {
      id: 8,
      profileUrl: "https://users.deno.dev/02.jpg",
      firstName: "Jane",
      middleName: "Doe",
      lastName: "Smith",
      selected: false,
    },
    {
      id: 9,
      profileUrl: "https://users.deno.dev/02.jpg",
      firstName: "Jane",
      middleName: "Doe",
      lastName: "Smith",
      selected: false,
    },
  ]

  const messageEndRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    setTimeout(() => {
      if (messageEndRef && messageEndRef.current) {
        messageEndRef.current.scrollIntoView({ block: "end" })
      }
    }, 100)
  }, [])

  return (
    <main className="w-full">
      <div className="flex-1 items-start lg:grid lg:grid-cols-[360px_minmax(0,1fr)]">
        <div className="mt-4 flex w-full flex-col gap-2 border-r pr-4 md:sticky lg:z-30 lg:-ml-2 lg:mt-0 lg:h-[calc(100vh-6rem)] lg:shrink-0">
          <h1 className="mb-4 text-2xl font-bold leading-none">Messages</h1>
          <ScrollArea className="h-full">
            {users.map((member) => (
              <div
                key={member.id}
                className={cn(
                  "hover:bg-foreground/5 flex cursor-pointer gap-4 rounded-md p-4",
                  member.selected &&
                    "bg-foreground/90 text-background hover:bg-foreground/90"
                )}
              >
                <Avatar className="size-10">
                  <AvatarImage
                    src={member.profileUrl}
                    alt={
                      member.middleName
                        ? `${member.firstName} ${member.middleName} ${member.lastName}`
                        : `${member.firstName} ${member.lastName}`
                    }
                  />
                  <AvatarFallback
                    className={cn(
                      "text-md",
                      member.selected && "bg-background text-foreground"
                    )}
                  >
                    {getShortName(
                      member.middleName
                        ? `${member.firstName} ${member.middleName} ${member.lastName}`
                        : `${member.firstName} ${member.lastName}` ?? "New User"
                    )}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">
                    {member.middleName
                      ? `${member.firstName} ${member.middleName} ${member.lastName}`
                      : `${member.firstName} ${member.lastName}`}
                  </p>
                  <p
                    className={cn(
                      "text-muted-foreground flex items-center text-sm",
                      member.selected && "text-background/80"
                    )}
                  >
                    You: Hello world <Dot /> 3 min
                  </p>
                </div>
              </div>
            ))}
          </ScrollArea>
        </div>
        <div className="pl-4">
          <div className="mb-4 flex w-full items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="size-10">
                <AvatarImage src="/avatars/01.png" alt="Image" />
                <AvatarFallback className="text-md">OM</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">Sofia Davis</p>
                <p className="text-muted-foreground text-sm">m@example.com</p>
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
                  <DropdownMenuItem>Archive chat</DropdownMenuItem>
                  <DropdownMenuItem>Mark as spam</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="w-full border-t md:sticky lg:z-30 lg:-ml-2 lg:mt-0 lg:h-[calc(100vh-14rem)] lg:shrink-0">
            <ScrollArea className="h-full">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    "mb-1 flex w-fit max-w-[75%] flex-col gap-2 text-wrap rounded-lg px-3 py-2 text-sm",
                    message.role === "user"
                      ? "bg-foreground text-background/95 ml-auto mr-4"
                      : "bg-muted"
                  )}
                >
                  <p>{message.content}</p>
                </div>
              ))}
              <div ref={messageEndRef} />
            </ScrollArea>
          </div>
          <form
            onSubmit={(event) => {
              event.preventDefault()
              if (inputLength === 0) return
              setMessages([
                ...messages,
                {
                  role: "user",
                  content: input,
                },
              ])
              setInput("")
              setTimeout(() => {
                if (messageEndRef && messageEndRef.current) {
                  messageEndRef.current.scrollIntoView({ block: "end" })
                }
              }, 100)
            }}
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
            <Button type="submit" size="icon" disabled={inputLength === 0}>
              <SendHorizonal className="size-5" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </div>
      </div>
    </main>
  )
}
