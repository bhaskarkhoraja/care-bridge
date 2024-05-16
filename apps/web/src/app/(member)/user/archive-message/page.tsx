import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Archive Message",
  description: "Your Archived Messages",
}

export default function ArchiveMessagePage() {
  return (
    <main className="flex size-full items-center justify-center">
      <p className="text-muted-foreground text-sm">Please select a message</p>
    </main>
  )
}
