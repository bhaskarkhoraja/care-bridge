import { Metadata, ResolvingMetadata } from "next"
import { notFound, redirect } from "next/navigation"
import {
  checkFamilyMemberEditable,
  getFamilyDocumentInfo,
  getFamilyMemberInfo,
  getFamilySpecialNeed,
} from "@web/src/actions/user/family-member"
import { StepItem } from "@web/src/components/ui/stepper"
import { getCurrentUser } from "@web/src/lib/session"

import FamilyMemberForm from "./_components/family-member-form"
import FamilyMemberProfile from "./_components/family-member-profile"

export async function generateMetadata(
  {
    params,
  }: {
    params: { slug: string[] }
  },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const familyMemberId =
    params.slug.length === 2 ? params.slug[1] : params.slug[0]

  const familyMemberInfo = await getFamilyMemberInfo(familyMemberId)

  const previousImages = (await parent).openGraph?.images || []

  if (familyMemberInfo.status === 200) {
    return {
      title: familyMemberInfo.body.data.middleName
        ? `${familyMemberInfo.body.data.firstName} ${familyMemberInfo.body.data.middleName} ${familyMemberInfo.body.data.lastName}`
        : `${familyMemberInfo.body.data.firstName} ${familyMemberInfo.body.data.lastName}`,
      openGraph: {
        images: [
          familyMemberInfo.body.data.profileUrl as string,
          ...previousImages,
        ],
      },
    }
  }

  return {
    title: "Profile",
  }
}

export default async function FamilyMemberPage({
  params,
  searchParams,
}: {
  params: { slug: string[] }
  searchParams: { [key: string]: string | undefined }
}) {
  const action = params.slug.length === 2 ? params.slug[0] : undefined

  if (action !== undefined && action !== "add" && action !== "update") {
    redirect("/user/family-member")
  }

  const user = await getCurrentUser()
  if (!user) {
    notFound()
  }

  const familyMemberId =
    params.slug.length === 2 ? params.slug[1] : params.slug[0]

  const editable = await checkFamilyMemberEditable(familyMemberId)

  if (editable.status !== 200 && action === "update") {
    redirect("/user/family-member")
  }

  const [familyMemberInfo, familySpecialNeedInfo, familyDocumentInfo] =
    await Promise.all([
      getFamilyMemberInfo(familyMemberId),
      getFamilySpecialNeed(familyMemberId),
      getFamilyDocumentInfo(familyMemberId),
    ])

  if (action === undefined) {
    if (
      familyMemberInfo.status === 204 ||
      familyMemberInfo.status === 500 ||
      familySpecialNeedInfo.status === 500 ||
      familyDocumentInfo.status === 204 ||
      familyDocumentInfo.status === 500
    ) {
      redirect("/user/family-member")
    }
    return (
      <main className="w-full">
        <FamilyMemberProfile
          familyMemberInfo={familyMemberInfo.body.data}
          familySpecialNeedInfo={
            familySpecialNeedInfo.status === 200
              ? familySpecialNeedInfo.body.data
              : undefined
          }
          familyDocumentInfo={familyDocumentInfo.body.data}
          familyMemberId={familyMemberId}
          editable={editable.body.status}
          isAdmin={user.role === "admin"}
        />
      </main>
    )
  }

  const steps = [
    { label: "Step 1", description: "Family Member Info" },
    { label: "Step 2", description: "Special needs" },
    { label: "Step 3", description: "Documents" },
  ] satisfies StepItem[]

  return (
    <main className="w-full">
      <h1 className="text-foreground mb-8 text-center text-2xl font-extrabold">
        {action[0].toUpperCase() + action.slice(1)} Family Members
      </h1>
      <FamilyMemberForm
        steps={steps}
        step={parseInt(searchParams.step || "1")}
        familyMemberId={familyMemberId}
        familyMemberInfo={
          familyMemberInfo.status === 204 || familyMemberInfo.status === 500
            ? undefined
            : familyMemberInfo.body.data
        }
        familySpecialNeedInfo={
          familySpecialNeedInfo.status === 204 ||
          familySpecialNeedInfo.status === 500
            ? undefined
            : familySpecialNeedInfo.body.data
        }
        familyDocumentInfo={
          familyDocumentInfo.status === 204 || familyDocumentInfo.status === 500
            ? undefined
            : familyDocumentInfo.body.data
        }
        action={action}
      />
    </main>
  )
}
