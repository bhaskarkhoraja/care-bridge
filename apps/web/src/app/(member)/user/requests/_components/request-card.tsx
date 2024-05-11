import Link from "next/link"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@web/src/components/ui/card"
import { RequestSchema } from "api-contract/types"
import { format } from "date-fns"
import { z } from "zod"

interface RequestCardProps {
  request: z.infer<typeof RequestSchema>
  index: number
}

const RequestCard: React.FC<RequestCardProps> = ({ request, index }) => {
  return (
    <Link href={`/user/requests/request/${request.id}`} className="w-full">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-lg">
            <div># {index + 1}</div>
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
                <dt className="text-sm font-medium text-gray-600">End time:</dt>
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
  )
}

export default RequestCard
