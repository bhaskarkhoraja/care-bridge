"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { applyForRequest } from "@web/src/actions/user/request"
import { Icons } from "@web/src/components/icons"
import { Button } from "@web/src/components/ui/button"
import { toast } from "sonner"

interface ApplyRequestProps {
  requestId: string
}

const ApplyRequest: React.FC<ApplyRequestProps> = ({ requestId }) => {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleApply = async () => {
    try {
      setLoading(true)

      const response = await applyForRequest(requestId)

      if (response.status !== 200) {
        toast.error(response.body.message || "No such requests found")
        return
      }

      toast.success("Successfully applied")
      router.push("/user/requests/seller/applied")
    } catch {
      toast.error("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button type="button" onClick={handleApply} disabled={loading}>
      {loading && <Icons.spinner className="mr-2 size-4 animate-spin" />}
      Apply
    </Button>
  )
}

export default ApplyRequest
