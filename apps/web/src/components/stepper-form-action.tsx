"ues client"

import { Button } from "@web/src/components/ui/button"
import { useStepper } from "@web/src/components/ui/stepper"

import { Icons } from "./icons"

interface stepperFormActionProps {
  loading: boolean
}

export const StepperFormActions: React.FC<stepperFormActionProps> = ({
  loading,
}) => {
  const {
    prevStep,
    resetSteps,
    isDisabledStep,
    hasCompletedAllSteps,
    isLastStep,
    isOptionalStep,
  } = useStepper()

  return (
    <div className="mt-4 flex w-full justify-end gap-2 px-1 sm:px-0">
      {hasCompletedAllSteps ? (
        <Button size="sm" onClick={resetSteps} type="button">
          Reset
        </Button>
      ) : (
        <>
          <Button
            disabled={isDisabledStep}
            onClick={prevStep}
            size="sm"
            variant="ghost"
            type="button"
          >
            Prev
          </Button>
          <Button size="sm">
            {loading ? (
              <Icons.spinner className="mr-2 size-4 animate-spin text-white" />
            ) : null}
            {isLastStep ? "Finish" : isOptionalStep ? "Skip" : "Next"}
          </Button>
        </>
      )}
    </div>
  )
}
