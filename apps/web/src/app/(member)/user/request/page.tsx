import Link from "next/link"
import { getMyRequest } from "@web/src/actions/user/request"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@web/src/components/ui/card"
import { format } from "date-fns"

export default async function AllRequest() {
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
      <h1 className="mb-4 text-2xl font-bold leading-none">
        All of your requests
      </h1>
      <div className="gird-cols-1 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {myRequest.body.data
          .filter((request) => request.status === "open")
          .map((request, requestIndex) => (
            <Link
              href={`/user/request/${request.id}`}
              className="w-full"
              key={request.id}
            >
              <Card className="w-full">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-lg">
                    <div># {requestIndex + 1}</div>
                    <div>NRs {request.price}</div>
                  </CardTitle>
                  <div>
                    <dl className="space-y-2">
                      <div className="flex items-center justify-between">
                        <dt className="text-sm font-medium text-gray-600">
                          Start time:
                        </dt>
                        <dd className="text-sm font-normal text-gray-800">
                          {format(request.startTime, "PPP p")}
                        </dd>
                      </div>
                      <div className="flex items-center justify-between">
                        <dt className="text-sm font-medium text-gray-600">
                          End time:
                        </dt>
                        <dd className="text-sm font-normal text-gray-800">
                          {format(request.endTime, "PPP p")}
                        </dd>
                      </div>
                      <div className="flex items-center justify-between">
                        <dt className="text-sm font-medium text-gray-600">
                          No. of Members:
                        </dt>
                        <dd className="text-sm font-normal text-gray-800">
                          {request.familyMemberIds.length}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-md line-clamp-3">{request.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
      </div>
    </main>
  )
}
