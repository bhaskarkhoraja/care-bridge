import { Metadata } from "next"
import { getAppliedRequest } from "@web/src/actions/user/request"

import RequestCard from "../../_components/request-card"

export const metadata: Metadata = {
  title: "Applied Request",
  description: "View all of applied request",
}

export default async function AllRequest() {
  const request = await getAppliedRequest()

  if (request.status !== 200 || request.body.data.length === 0) {
    return (
      <main className="w-full">
        <h1 className="mb-4 text-2xl font-bold leading-none">
          All your applied requests
        </h1>

        <p className="text-muted-foreground text-sm">
          {request.status !== 200
            ? request.body.message || "No requests found"
            : "No requests found"}
        </p>
      </main>
    )
  }

  return (
    <main className="w-full">
      <h1 className="mb-4 text-2xl font-bold leading-none">
        All your applied requests
      </h1>
      <div className="gird-cols-1 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {request.body.data.map((request, requestIndex) => (
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
