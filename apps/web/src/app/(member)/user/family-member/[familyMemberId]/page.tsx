import {
  getFamilyDocumentInfo,
  getFamilyMemberInfo,
  getFamilySpecialNeed,
} from "@web/src/actions/user/family-member"
import { StepItem } from "@web/src/components/ui/stepper"

import FamilyMemberForm from "./_components/family-member-form"

export default async function FamilyMemberPage({
  params,
  searchParams,
}: {
  params: { familyMemberId: string }
  searchParams: { [key: string]: string | undefined }
}) {
  const steps = [
    { label: "Step 1", description: "Family Member Info" },
    { label: "Step 2", description: "Special needs" },
    { label: "Step 3", description: "Documents" },
  ] satisfies StepItem[]

  const [familyMemberInfo, familySpecialNeedInfo, familyDocumentInfo] =
    await Promise.all([
      getFamilyMemberInfo(params.familyMemberId),
      getFamilySpecialNeed(params.familyMemberId),
      getFamilyDocumentInfo(params.familyMemberId),
    ])

  return (
    <main className="w-full">
      <h1 className="text-foreground mb-8 text-center text-2xl font-extrabold">
        Add Family Members
      </h1>
      <FamilyMemberForm
        steps={steps}
        step={parseInt(searchParams.step || "1")}
        familyMemberId={params.familyMemberId}
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
      />
    </main>
  )
}
