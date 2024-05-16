import { Metadata, ResolvingMetadata } from "next"
import { redirect } from "next/navigation"
import { getMessage, getSenderDetails } from "@web/src/actions/user/message"
import { getCurrentUser } from "@web/src/lib/session"

import MainMessage from "../_components/main-message"

export async function generateMetadata(
  {
    params,
  }: {
    params: { userId: string }
  },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const userDetails = await getSenderDetails(params.userId)

  const previousImages = (await parent).openGraph?.images || []

  if (userDetails.status === 200) {
    return {
      title: userDetails.body.data.middleName
        ? `${userDetails.body.data.firstName} ${userDetails.body.data.middleName} ${userDetails.body.data.lastName}`
        : `${userDetails.body.data.firstName} ${userDetails.body.data.lastName}`,
      openGraph: {
        images: [userDetails.body.data.profileUrl as string, ...previousImages],
      },
    }
  }

  return {
    title: "Message",
  }
}

export default async function ArchiveUserMessage({
  params,
}: {
  params: { userId: string }
}) {
  const [messages, senderDetails, user] = await Promise.all([
    getMessage(params.userId),
    getSenderDetails(params.userId),
    getCurrentUser(),
  ])

  if (senderDetails.status !== 200) {
    redirect("/user/message")
  }

  if (!user) {
    redirect("/")
  }

  return (
    <MainMessage
      messages={messages.status !== 200 ? undefined : messages.body.data}
      senderId={params.userId}
      senderDetails={senderDetails.body.data}
    />
  )
}
