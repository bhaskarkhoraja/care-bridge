import { Metadata } from "next"
import { getArchivedRequest } from "@web/src/actions/user/request"

import RequestCard from "../_components/request-card"

export const metadata: Metadata = {
  title: "Archived request",
  description: "View all of your archived request",
}

export default async function DraftRequest() {
  const myArchivedRequest = await getArchivedRequest()

  if (myArchivedRequest.status !== 200) {
    return (
      <main className="w-full">
        <h1 className="mb-4 text-2xl font-bold leading-none">
          Archive requests
        </h1>

        <p className="text-muted-foreground text-sm">
          {myArchivedRequest.body.message || "No requests found"}
        </p>
      </main>
    )
  }
  return (
    <main className="w-full">
      <h1 className="mb-4 text-2xl font-bold leading-none">Archive requests</h1>
      <div className="gird-cols-1 mb-4 grid gap-x-4 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
        {myArchivedRequest.body.data.map((request, requestIndex) => (
          <RequestCard
            key={request.id}
            request={request}
            index={requestIndex}
            paid={request.paid}
            showPayButton={true}
          />
        ))}
      </div>
    </main>
  )
}
