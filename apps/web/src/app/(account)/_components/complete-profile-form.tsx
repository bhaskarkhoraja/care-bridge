"use client"

import { Step, StepItem, Stepper } from "@web/src/components/ui/stepper"
import {
  AddressContactFormSchema,
  CountriesSchema,
  DocumentFormSchema,
  PersonalInfoFormSchema,
} from "api-contract/types"
import { z } from "zod"

import AddressContactForm from "./address-contact-form"
import DocumentForm from "./document-form"
import PersonalFormInfo from "./personal-info-form"

interface CompleteProfileFormProps {
  steps: StepItem[]
  step: number
  countries: z.infer<typeof CountriesSchema>[]
  personalInfo: z.infer<typeof PersonalInfoFormSchema> | undefined
  addressContactInfo: z.infer<typeof AddressContactFormSchema> | undefined
  documentInfo: z.infer<typeof DocumentFormSchema> | undefined
}

const CompleteProfileForm: React.FC<CompleteProfileFormProps> = ({
  steps,
  step,
  countries,
  personalInfo,
  addressContactInfo,
  documentInfo,
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
              <PersonalFormInfo personalInfo={personalInfo} />
            </Step>
          )
        }
        if (index === 1) {
          return (
            <Step key={stepProps.label} {...stepProps}>
              <AddressContactForm
                countries={countries}
                addressContactInfo={addressContactInfo}
              />
            </Step>
          )
        }
        return (
          <Step key={stepProps.label} {...stepProps}>
            <DocumentForm documentInfo={documentInfo} />
          </Step>
        )
      })}
    </Stepper>
  )
}

export default CompleteProfileForm
