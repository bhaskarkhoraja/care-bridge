import Link from "next/link"
import { redirect } from "next/navigation"
import { getRequestForSeller } from "@web/src/actions/user/request"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@web/src/components/ui/alert"
import { getCurrentUser } from "@web/src/lib/session"
import { MailWarning } from "lucide-react"

import RequestCard from "../_components/request-card"

export default async function AllRequestAvailableForSeller() {
  const requests = await getRequestForSeller()
  const user = await getCurrentUser()

  if (!user) {
    redirect("/")
  }

  if (requests.status !== 200) {
    return (
      <main className="w-full">
        <h1 className="mb-4 text-2xl font-bold leading-none">
          All available request
        </h1>
        <p className="text-muted-foreground text-sm">
          {requests.body.message || "No requests found"}
        </p>
      </main>
    )
  }

  if (!user.verified) {
    return (
      <main>
        {user.verified === false ? (
          <Link href={`/user/profile/update/${user.id}`}>
            <Alert className="mb-4" variant={"destructive"}>
              <MailWarning className="size-4" />
              <AlertTitle>Account verification failed.</AlertTitle>
              <AlertDescription>
                Please go through your profile and update it.
              </AlertDescription>
            </Alert>
          </Link>
        ) : (
          <Alert className="mb-4" variant={"destructive"}>
            <MailWarning className="size-4" />
            <AlertTitle>Your account has&apos;nt been verified yet.</AlertTitle>
            <AlertDescription>
              It takes 2-3 business days to verify your account.
            </AlertDescription>
          </Alert>
        )}
        <h1 className="text-foreground mb-8 text-center text-2xl font-extrabold">
          All available request
        </h1>
        <p className="text-muted-foreground text-sm">No requests found</p>
      </main>
    )
  }

  return (
    <main className="w-full">
      <h1 className="mb-4 text-2xl font-bold leading-none">
        All available request
      </h1>
      <div className="gird-cols-1 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {requests.body.data.map((request, requestIndex) => (
          <RequestCard
            key={request.id}
            request={request}
            index={requestIndex}
          />
        ))}
      </div>
    </main>
  )
}
