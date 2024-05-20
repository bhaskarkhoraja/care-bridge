import { Suspense } from "react"
import Link from "next/link"
import { Icons } from "@web/src/components/icons"
import { Button } from "@web/src/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@web/src/components/ui/card"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@web/src/components/ui/tooltip"
import { RequestSchema } from "api-contract/types"
import { format } from "date-fns"
import { CircleCheck, CircleDot } from "lucide-react"
import { z } from "zod"

import PayPalButton from "./paypal-pay-button"

interface RequestCardProps {
  request: z.infer<typeof RequestSchema>
  index: number
  paid?: boolean
  showPayButton?: boolean
}

const RequestCard: React.FC<RequestCardProps> = ({
  request,
  index,
  paid,
  showPayButton,
}) => {
  return (
    <Link href={`/user/requests/request/${request.id}`} className="w-full">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-lg">
            <div># {index + 1}</div>
            <div className="flex items-center justify-center gap-4">
              {paid !== undefined && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger type="button">
                      {paid ? (
                        <CircleCheck className="size-5" />
                      ) : (
                        <CircleDot className="size-5" />
                      )}
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{paid ? "Paid" : "Pending Payment"}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              <div>USD {request.price}</div>
            </div>
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
        <CardContent className="relative">
          <p className="text-md line-clamp-3">{request.description}</p>
          {showPayButton && paid === false && (
            <div className="absolute -bottom-5 right-6">
              <Suspense
                fallback={
                  <>
                    <Button size="icon">
                      <Icons.spinner className="size-4 animate-spin" />
                    </Button>
                  </>
                }
              >
                <PayPalButton requestId={request.id} />
              </Suspense>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}

export default RequestCard
