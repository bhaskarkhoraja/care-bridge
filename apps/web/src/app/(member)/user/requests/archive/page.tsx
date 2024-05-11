import { getMyRequest } from "@web/src/actions/user/request"
import { RequestSchema } from "api-contract/types"
import { z } from "zod"

import RequestCard from "../_components/request-card"

export default async function DraftRequest() {
  const myRequest = await getMyRequest()

  let filteredRequest: z.infer<typeof RequestSchema>[]

  if (myRequest.status === 200) {
    filteredRequest = myRequest.body.data.filter(
      (request) => request.status === "close"
    )
  } else {
    filteredRequest = []
  }

  if (myRequest.status !== 200 || filteredRequest.length === 0) {
    return (
      <main className="w-full">
        <h1 className="mb-4 text-2xl font-bold leading-none">
          Archive requests
        </h1>

        <p className="text-muted-foreground text-sm">
          {myRequest.status !== 200
            ? myRequest.body.message || "No requests found"
            : "No requests found"}
        </p>
      </main>
    )
  }
  return (
    <main className="w-full">
      <h1 className="mb-4 text-2xl font-bold leading-none">Archive requests</h1>
      <div className="gird-cols-1 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredRequest.map((request, requestIndex) => (
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
