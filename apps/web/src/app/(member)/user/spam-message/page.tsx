import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Spam Messages",
  description: "Your Spam Messages",
}

export default function ArchiveMessagePage() {
  return (
    <main className="flex size-full items-center justify-center">
      <p className="text-muted-foreground text-sm">Please select a message</p>
    </main>
  )
}
