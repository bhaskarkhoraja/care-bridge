"use client"

import { useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Step, StepItem, Stepper } from "@web/src/components/ui/stepper"
import {
  DocumentFormSchema,
  FamilyInfoFormSchema,
  FamilySpecialNeedsSchema,
} from "packages/api-contract/dist/types/index.mjs"
import { useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"

import FamilyDocumentForm from "./_components/family-document-form"
import FamilyFormInfo from "./_components/family-info-form"
import SpecialNeedFormInfo from "./_components/special-need-form"

export default function AddFamilyMember() {
  const steps = [
    { label: "Step 1", description: "Family Member Info" },
    { label: "Step 2", description: "Special needs" },
    { label: "Step 3", description: "Documents" },
  ] satisfies StepItem[]

  const searchParams = useSearchParams()
  const step = parseInt(searchParams.get("step") || "1")

  const familyFormInfo = useForm<z.infer<typeof FamilyInfoFormSchema>>({
    resolver: zodResolver(FamilyInfoFormSchema),
    defaultValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      dob: undefined,
      gender: undefined,
    },
  })

  const familySpecialNeedFormInfo = useForm<
    z.infer<typeof FamilySpecialNeedsSchema>
  >({
    resolver: zodResolver(FamilySpecialNeedsSchema),
    defaultValues: {
      specialNeeds: [],
    },
  })

  const familySpecialNeedFormArrayInfo = useFieldArray({
    control: familySpecialNeedFormInfo.control,
    name: "specialNeeds",
  })

  const familyDocumentForm = useForm<z.infer<typeof DocumentFormSchema>>({
    resolver: zodResolver(DocumentFormSchema),
    defaultValues: {
      profileUrl: "",
      documentUrl: "",
      policeReportUrl: "",
    },
  })

  return (
    <main className="w-full">
      <h1 className="text-foreground mb-8 text-center text-2xl font-extrabold">
        Add Family Members
      </h1>
      <Stepper
        variant="circle-alt"
        initialStep={step > 3 ? 0 : step - 1}
        steps={steps}
      >
        {steps.map((stepProps, index) => {
          if (index === 0) {
            return (
              <Step key={stepProps.label} {...stepProps}>
                <FamilyFormInfo form={familyFormInfo} />
              </Step>
            )
          }
          if (index === 1) {
            return (
              <Step key={stepProps.label} {...stepProps}>
                <SpecialNeedFormInfo
                  form={familySpecialNeedFormInfo}
                  fieldArray={familySpecialNeedFormArrayInfo}
                />
              </Step>
            )
          }
          return (
            <Step key={stepProps.label} {...stepProps}>
              <FamilyDocumentForm form={familyDocumentForm} />
            </Step>
          )
        })}
      </Stepper>
    </main>
  )
}
