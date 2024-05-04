import { Metadata, ResolvingMetadata } from "next"
import { notFound, redirect } from "next/navigation"
import getCountries from "@web/src/actions/general"
import {
  getAddressContactInfo,
  getDocumentInfo,
  getPersonalInfo,
} from "@web/src/actions/user"
import { StepItem } from "@web/src/components/ui/stepper"
import { getCurrentUser } from "@web/src/lib/session"

import CompleteProfileForm from "./_components/complete-profile-form"
import UserProfile from "./_components/user-profile"

export async function generateMetadata(
  {
    params,
  }: {
    params: { slug: string[] }
  },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const profileId = params.slug.length === 2 ? params.slug[1] : params.slug[0]

  const personalInfo = await getPersonalInfo(profileId)

  const previousImages = (await parent).openGraph?.images || []

  if (personalInfo.status === 200) {
    return {
      title: personalInfo.body.data.middleName
        ? `${personalInfo.body.data.firstName} ${personalInfo.body.data.middleName} ${personalInfo.body.data.lastName}`
        : `${personalInfo.body.data.firstName} ${personalInfo.body.data.lastName}`,
      openGraph: {
        images: [
          personalInfo.body.data.profileUrl as string,
          ...previousImages,
        ],
      },
    }
  }

  return {
    title: "Profile",
  }
}

export default async function UpdateProfilePage({
  params,
  searchParams,
}: {
  params: { slug: string[] }
  searchParams: { [key: string]: string | undefined }
}) {
  const action = params.slug.length === 2 ? params.slug[0] : undefined

  if (action !== undefined && action !== "complete" && action !== "update") {
    redirect("/")
  }

  const user = await getCurrentUser()
  if (!user) {
    notFound()
  }

  const profileId = params.slug.length === 2 ? params.slug[1] : params.slug[0]

  if (
    user.profile_id &&
    user.profile_id !== profileId &&
    action !== undefined &&
    user.verified !== false
  ) {
    redirect("/user/family-member")
  }

  const [countries, personalInfo, addressContactInfo, documentInfo] =
    await Promise.all([
      getCountries(),
      getPersonalInfo(profileId),
      getAddressContactInfo(profileId),
      getDocumentInfo(profileId),
    ])

  if (countries.status === 204) {
    notFound()
  }

  if (action === undefined) {
    if (
      personalInfo.status === 204 ||
      personalInfo.status === 500 ||
      addressContactInfo.status === 204 ||
      addressContactInfo.status === 500 ||
      documentInfo.status === 204 ||
      documentInfo.status === 500
    ) {
      redirect("/user/family-member")
    }
    return (
      <main className="w-full">
        <UserProfile
          countries={countries.body.data}
          personalInfo={personalInfo.body.data}
          addressContactInfo={addressContactInfo.body.data}
          documentInfo={documentInfo.body.data}
          editable={user.profile_id === profileId}
          profileId={profileId}
        />
      </main>
    )
  }

  const steps = [
    { label: "Step 1", description: "Personal Info" },
    { label: "Step 2", description: "Address & Contact" },
    { label: "Step 3", description: "Documents" },
  ] satisfies StepItem[]

  /* Complete profile page with stepper */
  return (
    <main className="w-full">
      <h1 className="text-foreground mb-8 text-center text-2xl font-extrabold">
        {action[0].toUpperCase() + action.slice(1)} Profile
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
        profileId={profileId}
        addressContactInfo={
          addressContactInfo.status === 204 || addressContactInfo.status === 500
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
  )
}
