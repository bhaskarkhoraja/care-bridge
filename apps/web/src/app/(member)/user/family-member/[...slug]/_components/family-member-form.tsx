"use client"

import { Step, StepItem, Stepper } from "@web/src/components/ui/stepper"
import {
  FamilyInfoFormSchema,
  FamilySpecialNeedsSchema,
} from "node_modules/api-contract/dist/types/family-member.mjs"
import { DocumentFormSchema } from "node_modules/api-contract/dist/types/user.mjs"
import { z } from "zod"

import FamilyDocumentForm from "./family-document-form"
import FamilyFormInfo from "./family-info-form"
import SpecialNeedFormInfo from "./special-need-form"

interface FamilyMemberFormProps {
  steps: StepItem[]
  step: number
  familyMemberId: string
  familyMemberInfo: z.infer<typeof FamilyInfoFormSchema> | undefined
  familySpecialNeedInfo: z.infer<typeof FamilySpecialNeedsSchema> | undefined
  familyDocumentInfo: z.infer<typeof DocumentFormSchema> | undefined
  action: "add" | "update"
}

const FamilyMemberForm: React.FC<FamilyMemberFormProps> = ({
  steps,
  step,
  familyMemberId,
  familyMemberInfo,
  familySpecialNeedInfo,
  familyDocumentInfo,
  action,
}) => {
  return (
    <Stepper
      variant="circle-alt"
      initialStep={step > 3 ? 0 : step - 1}
      steps={steps}
    >
      {steps.map((stepProps, index) => {
        if (index === 0) {
          return (
            <Step key={stepProps.label} {...stepProps}>
              <FamilyFormInfo
                familyMemberInfo={familyMemberInfo}
                familyMemberId={familyMemberId}
              />
            </Step>
          )
        }
        if (index === 1) {
          return (
            <Step key={stepProps.label} {...stepProps}>
              <SpecialNeedFormInfo
                familySpecialNeedInfo={familySpecialNeedInfo}
                familyMemberId={familyMemberId}
              />
            </Step>
          )
        }
        return (
          <Step key={stepProps.label} {...stepProps}>
            <FamilyDocumentForm
              familyDocumentInfo={familyDocumentInfo}
              familyMemberId={familyMemberId}
              action={action}
            />
          </Step>
        )
      })}
    </Stepper>
  )
}

export default FamilyMemberForm
