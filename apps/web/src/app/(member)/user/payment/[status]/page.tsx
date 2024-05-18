import { Metadata, ResolvingMetadata } from "next"
import Link from "next/link"
import { verifyPayment } from "@web/src/actions/payment/paypal"
import { buttonVariants } from "@web/src/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@web/src/components/ui/card"
import { cn } from "@web/src/lib/utils"

export async function generateMetadata(
  {
    params,
  }: {
    params: { status: "success" | "failure" }
  },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const previousImages = (await parent).openGraph?.images || []

  return {
    title: `${params.status[0].toUpperCase() + params.status.slice(1)} Payment,`,
    openGraph: {
      images: [...previousImages],
    },
  }
}

export default async function UpdateProfilePage({
  params,
  searchParams,
}: {
  params: { status: "success" | "failure" }
  searchParams: { [key: string]: string | undefined }
}) {
  if (params.status === "failure" || !searchParams.token) {
    return (
      <main className="flex size-full items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Payment failed!</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Payment failed! please try again</p>
          </CardContent>
          <CardFooter>
            <Link
              href="/user/requests/archive"
              className={cn("w-full", buttonVariants({ variant: "default" }))}
            >
              Go to archive request
            </Link>
          </CardFooter>
        </Card>
      </main>
    )
  }

  const verification = await verifyPayment(searchParams.token)
  let status = false

  if (verification.status === 200) {
    if (verification.body.data.verifiedStatus) {
      status = true
    }
  }

  return (
    <main className="flex size-full items-center justify-center">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">
            {status ? "Payment success!" : "Payment failed!"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            {status
              ? "Payment was successfull"
              : "Payment failed! please try again"}
          </p>
        </CardContent>
        <CardFooter>
          <Link
            href="/user/requests/archive"
            className={cn("w-full", buttonVariants({ variant: "default" }))}
          >
            Go to archive request
          </Link>
        </CardFooter>
      </Card>
    </main>
  )
}
