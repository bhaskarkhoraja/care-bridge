import Link from "next/link"
import { getMyRequest } from "@web/src/actions/user/request"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@web/src/components/ui/card"
import { format } from "date-fns"

import RequestCard from "../_components/request-card"

export default async function DraftRequest() {
  const myRequest = await getMyRequest()

  if (myRequest.status !== 200) {
    return (
      <main className="w-full">
        <h1 className="mb-4 text-2xl font-bold leading-none">
          All of your requests
        </h1>

        <p className="text-muted-foreground text-sm">
          {myRequest.body.message || "No requests found"}
        </p>
      </main>
    )
  }
  return (
    <main className="w-full">
      <h1 className="mb-4 text-2xl font-bold leading-none">Draft requests</h1>
      <div className="gird-cols-1 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {myRequest.body.data
          .filter((request) => request.status === "draft")
          .map((request, requestIndex) => (
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
