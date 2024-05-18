import Link from "next/link"
import { getPaymentURL } from "@web/src/actions/payment/paypal"
import { Icons } from "@web/src/components/icons"
import { Button, buttonVariants } from "@web/src/components/ui/button"
import { X } from "lucide-react"

interface PayPalButtonProps {
  requestId: string
}

const PayPalButton: React.FC<PayPalButtonProps> = async ({ requestId }) => {
  const paymentUrl = await getPaymentURL(requestId)

  if (paymentUrl.status !== 200) {
    return (
      <Button>
        <X className="mr-4 size-4" />
        Something went wrong
      </Button>
    )
  }

  return (
    <Link
      href={paymentUrl.body.data.paymentUrl}
      className={buttonVariants({ variant: "default" })}
    >
      <Icons.paypal className="mr-4 size-4" />
      Pay with Paypal
    </Link>
  )
}

export default PayPalButton
