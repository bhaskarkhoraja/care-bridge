import { Suspense } from "react"
import { Metadata } from "next"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@web/src/components/ui/card"

import SettingContent from "./_components/setting-content"
import SettingContentShimmer from "./_components/setting-content-shimmer"

export const metadata: Metadata = {
  title: "Payment Setting",
  description: "Setup your payment method",
}

export default function PaymentSettingPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined }
}) {
  return (
    <main className="size-full">
      <div className="flex flex-col items-center">
        <h1 className="mb-4 text-2xl font-bold leading-none">
          Payment Settings
        </h1>
        <p className="text-muted-foreground">
          Connect your PayPal account to start receiving payments as a partner.
        </p>
        <Card className="mt-4 max-w-lg">
          <CardHeader>
            <CardTitle className="text-lg">Become a partner</CardTitle>
            <CardDescription>
              By connecting your PayPal account, you&apos;ll be able to receive
              payments from customers on our platform. We&apos;ll handle the
              payment processing and you&apos;ll get paid directly into your
              PayPal account.{" "}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense
              fallback={
                <>
                  <SettingContentShimmer />
                </>
              }
            >
              <SettingContent searchParams={searchParams} />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
