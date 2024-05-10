import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import getCountries from "@web/src/actions/general"
import { getAllFamilyMemberInfo } from "@web/src/actions/user/family-member"
import { getRequest } from "@web/src/actions/user/request"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@web/src/components/ui/alert"
import { getCurrentUser } from "@web/src/lib/session"
import { MailWarning } from "lucide-react"
import { v4 as uuidv4 } from "uuid"

import RequestForm from "./_components/request-form"
import ViewRequest from "./_components/view-request"

export default async function UpdateRequestPage({
  params,
}: {
  params: { slug: string[] }
}) {
  const action = params.slug.length === 2 ? params.slug[0] : undefined
  if (action !== undefined && action !== "add" && action !== "update") {
    redirect("/user/family-member")
  }

  const user = await getCurrentUser()
  if (!user) {
    notFound()
  }

  const requestId = params.slug.length === 2 ? params.slug[1] : params.slug[0]

  const [countries, familyMemberInfo, request] = await Promise.all([
    getCountries(),
    getAllFamilyMemberInfo(),
    getRequest(requestId),
  ])

  if (countries.status === 204) {
    notFound()
  }

  if (action === undefined) {
    if (request.status !== 200) {
      redirect("/user/family-member")
    }
    return (
      <main className="w-full">
        <h1 className="text-foreground mb-8 text-center text-2xl font-extrabold">
          View Request
        </h1>
        <ViewRequest
          requestDetails={request.body.data}
          countries={countries.body.data}
        />
      </main>
    )
  }

  if (familyMemberInfo.status !== 200) {
    return (
      <main>
        <Link href={`/user/family-member/add/${uuidv4()}`}>
          <Alert className="mb-4" variant={"destructive"}>
            <MailWarning className="size-4" />
            <AlertTitle>No Family Member Found.</AlertTitle>
            <AlertDescription>Please add family member first.</AlertDescription>
          </Alert>
        </Link>
        <h1 className="text-foreground mb-8 text-center text-2xl font-extrabold">
          {action[0].toUpperCase() + action.slice(1)} Request
        </h1>
        <p className="text-muted-foreground text-sm">
          You cannot {action} request
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
            <AlertTitle>Your account has&aposnt been verified yet.</AlertTitle>
            <AlertDescription>
              It takes 2-3 business days to verify your account.
            </AlertDescription>
          </Alert>
        )}
        <h1 className="text-foreground mb-8 text-center text-2xl font-extrabold">
          {action[0].toUpperCase() + action.slice(1)} Request
        </h1>
        <p className="text-muted-foreground text-sm">No requests found</p>
      </main>
    )
  }

  return (
    <main className="w-full">
      <h1 className="text-foreground mb-8 text-center text-2xl font-extrabold">
        {action[0].toUpperCase() + action.slice(1)} Request
      </h1>
      <RequestForm
        id={requestId}
        countries={countries.body.data}
        familyMemberInfo={familyMemberInfo.body.data.sort(
          (a, b) =>
            (a.verified === true ? -1 : 1) - (b.verified === true ? -1 : 1)
        )}
        requestDetails={request.status === 200 ? request.body.data : undefined}
        action={action}
      />
    </main>
  )
}
