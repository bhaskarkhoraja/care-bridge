import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Messages",
  description: "Your Messages",
}

export default function MessagePage() {
  return (
    <main className="flex size-full items-center justify-center">
      <p className="text-muted-foreground text-sm">Please select a message</p>
    </main>
  )
}
