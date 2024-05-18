import React from "react"
import Link from "next/link"
import { redirect } from "next/navigation"
import {
  checkSellerPaypalAndStatus,
  getActionURl,
  setPaypalMerchantAccount,
} from "@web/src/actions/payment/paypal"
import { Icons } from "@web/src/components/icons"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@web/src/components/ui/alert"
import { Button, buttonVariants } from "@web/src/components/ui/button"

interface SettingContentProps {
  searchParams: { [key: string]: string | undefined }
}

const SettingContent: React.FC<SettingContentProps> = async ({
  searchParams,
}) => {
  if (!!Object.keys(searchParams).length) {
    if (searchParams.merchantIdInPayPal) {
      await setPaypalMerchantAccount(searchParams.merchantIdInPayPal)
    }
    redirect("/user/billing/setting")
  }

  const checkPaypalAccount = await checkSellerPaypalAndStatus()

  if (checkPaypalAccount.status === 200) {
    return (
      <div className="flex items-center justify-start gap-4">
        <p>Paypal Status:</p>
        <Button type="button">
          {checkPaypalAccount.body.data.paypalStatus}
        </Button>
      </div>
    )
  }

  const actionUrl = await getActionURl()

  if (actionUrl.status !== 200) {
    return (
      <Alert>
        <Icons.paypal className="size-4" />
        <AlertTitle>Something went wrong!</AlertTitle>
        <AlertDescription>
          Couldn&apos;t get your paypal status
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Link
      href={`${actionUrl.body.data.actionUrl}&displayMode=minibrowser`}
      className={buttonVariants({ variant: "default" })}
    >
      <Icons.paypal className="mr-4 size-4" />
      Connect PayPal
    </Link>
  )
}

export default SettingContent
