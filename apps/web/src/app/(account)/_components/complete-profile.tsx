"use client"

import { Step, StepItem, Stepper } from "@web/src/components/ui/stepper"

import AddressContactForm from "./address-form"
import DocumentForm from "./document-form"
import PersonalFormInfo from "./personal-info-form"

interface CompleteProfileProps {
  steps: StepItem[]
  step: number
}

const CompleteProfile: React.FC<CompleteProfileProps> = ({ steps, step }) => {
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
              <PersonalFormInfo />
            </Step>
          )
        }
        if (index === 1) {
          return (
            <Step key={stepProps.label} {...stepProps}>
              <AddressContactForm />
            </Step>
          )
        }
        return (
          <Step key={stepProps.label} {...stepProps}>
            <DocumentForm />
          </Step>
        )
      })}
    </Stepper>
  )
}

export default CompleteProfile
