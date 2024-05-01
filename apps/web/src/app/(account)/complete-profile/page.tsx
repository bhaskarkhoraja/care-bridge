import { notFound } from "next/navigation"
import getCountries from "@web/src/actions/general"
import {
  getAddressContactInfo,
  getDocumentInfo,
  getPersonalInfo,
} from "@web/src/actions/user"
import SiteHeader from "@web/src/components/layout/site-header"
import { StepItem } from "@web/src/components/ui/stepper"
import { getCurrentUser } from "@web/src/lib/session"

import CompleteProfileForm from "../_components/complete-profile-form"

export const metadata = {
  title: "Complete Profile",
  description: "Complete profile to start using app",
}

export default async function CompleteProfilePage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined }
}) {
  const user = await getCurrentUser()

  const steps = [
    { label: "Step 1", description: "Personal Info" },
    { label: "Step 2", description: "Address & Contact" },
    { label: "Step 3", description: "Documents" },
  ] satisfies StepItem[]

  if (!user) {
    notFound()
  }

  const countries = await getCountries()
  const personalInfo = await getPersonalInfo()
  const addressContactInfo = await getAddressContactInfo()
  const documentInfo = await getDocumentInfo()

  if (countries.status === 204) {
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
        <CompleteProfileForm
          steps={steps}
          step={parseInt(searchParams.step || "1")}
          countries={countries.body.data}
          personalInfo={
            personalInfo.status === 204 || personalInfo.status === 500
              ? undefined
              : personalInfo.body.data
          }
          addressContactInfo={
            addressContactInfo.status === 204 ||
            addressContactInfo.status === 500
              ? undefined
              : addressContactInfo.body.data
          }
          documentInfo={
            documentInfo.status === 204 || documentInfo.status === 500
              ? undefined
              : documentInfo.body.data
          }
        />
      </main>
    </div>
  )
}
