"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { assignRequest } from "@web/src/actions/user/request"
import { Icons } from "@web/src/components/icons"
import { Button } from "@web/src/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@web/src/components/ui/tooltip"
import { UserRoundCheck } from "lucide-react"
import NProgress from "nprogress"
import { toast } from "sonner"

interface AcceptApplicantButtonProps {
  requestId: string
  sellerProfileId: string
}

const AcceptApplicantButton: React.FC<AcceptApplicantButtonProps> = ({
  requestId,
  sellerProfileId,
}) => {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleAccept = async () => {
    setLoading(true)
    try {
      const response = await assignRequest(requestId, sellerProfileId)

      if (response.status !== 200) {
        toast.error(response.body.message || "Failed to assign.")
      }
      toast.success(response.body.message)
      NProgress.start()
      router.push("/user/requests/archive")
    } catch {
      toast.error("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button size="icon" variant="outline" onClick={handleAccept}>
            {loading ? (
              <Icons.spinner className="size-4 animate-spin" />
            ) : (
              <UserRoundCheck className="size-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Accept applicant and close the request</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default AcceptApplicantButton
