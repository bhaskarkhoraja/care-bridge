import { redirect } from "next/navigation"
import { getAllMessages } from "@web/src/actions/user/message"
import { ScrollArea } from "@web/src/components/ui/scroll-area"
import { getCurrentUser } from "@web/src/lib/session"

import SideMessage from "./_components/side-message"

export default async function ArchiveMessageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [messages, user] = await Promise.all([
    getAllMessages("close"),
    getCurrentUser(),
  ])

  if (!user) {
    redirect("/")
  }

  return (
    <main className="w-full">
      <div className="flex-1 items-start lg:grid lg:grid-cols-[360px_minmax(0,1fr)]">
        <div className="mt-4 flex w-full flex-col gap-2 border-r pr-4 md:sticky lg:z-30 lg:-ml-2 lg:mt-0 lg:h-[calc(100vh-6rem)] lg:shrink-0">
          <h1 className="mb-4 text-2xl font-bold leading-none">
            Archive Messages
          </h1>
          <ScrollArea className="h-full">
            {messages.status !== 200 ? (
              <p className="text-muted-foreground text-sm">No messages found</p>
            ) : (
              <SideMessage messages={messages.body.data} user={user} />
            )}
          </ScrollArea>
        </div>
        <div className="size-full pl-4">{children}</div>
      </div>
    </main>
  )
}
