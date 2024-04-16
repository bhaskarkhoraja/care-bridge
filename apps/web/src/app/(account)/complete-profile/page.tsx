import { notFound } from "next/navigation"
import SiteHeader from "@web/src/components/layout/site-header"
import { StepItem } from "@web/src/components/ui/stepper"
import { getCurrentUser } from "@web/src/lib/session"

import CompleteProfile from "../_components/complete-profile"

export const metadata = {
  title: "Complete Profile",
  description: "Complete profile to start using app",
}

const steps = [
  { label: "Step 1", description: "Personal Info" },
  { label: "Step 2", description: "Address & Contact" },
  { label: "Step 3", description: "Documents" },
] satisfies StepItem[]

export default async function CompleteProfilePage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined }
}) {
  const user = await getCurrentUser()

  if (!user) {
    notFound()
  }

  /* Complete profile page with stepper */
  return (
    <div className="container flex w-full flex-col gap-4 px-2">
      <SiteHeader />
      <main className="container mt-8">
        <h1 className="text-foreground mb-8 text-center text-2xl font-extrabold">
          Complete Profile
        </h1>
        <CompleteProfile
          steps={steps}
          step={parseInt(searchParams.step || "1")}
        />
      </main>
    </div>
  )
}
