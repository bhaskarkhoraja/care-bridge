"ues client"

import { Button } from "@web/src/components/ui/button"
import { useStepper } from "@web/src/components/ui/stepper"

export const StepperFormActions = () => {
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
            {isLastStep ? "Finish" : isOptionalStep ? "Skip" : "Next"}
          </Button>
        </>
      )}
    </div>
  )
}
