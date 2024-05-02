"use client"

import { memo, useState } from "react"
import { StepperFormActions } from "@web/src/components/stepper-form-action"
import { Button } from "@web/src/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@web/src/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@web/src/components/ui/form"
import { Input } from "@web/src/components/ui/input"
import { useStepper } from "@web/src/components/ui/stepper"
import { FamilySpecialNeedsSchema } from "api-contract/types"
import { Plus } from "lucide-react"
import { UseFieldArrayReturn, UseFormReturn } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

interface SpecialNeedInfoFormProps {
  form: UseFormReturn<z.infer<typeof FamilySpecialNeedsSchema>, any, undefined>
  fieldArray: UseFieldArrayReturn<
    z.infer<typeof FamilySpecialNeedsSchema>,
    "specialNeeds",
    "id"
  >
}

const SpecialNeedFormInfo: React.FC<SpecialNeedInfoFormProps> = ({
  form,
  fieldArray,
}) => {
  const [loading, setLoading] = useState(false)
  const { nextStep } = useStepper()

  const onSubmit = async (data: z.infer<typeof FamilySpecialNeedsSchema>) => {
    if (data.specialNeeds.length === 0) {
      nextStep()
      return
    }
    nextStep()
    /* try { */
    /*   setLoading(true) */
    /*   const response = await setFamilyInfo(data) */

    /*   if (response.status === 409) { */
    /*     form.setError("userName", { */
    /*       type: "validate", */
    /*       message: response.body.message, */
    /*     }) */
    /*     return */
    /*   } */

    /*   if (response.status === 422 || response.status === 500) { */
    /*     toast.error(response.body.message) */
    /*     return */
    /*   } */

    /*   nextStep() */
    /* } catch { */
    /*   toast.error("Something went wrong!") */
    /* } finally { */
    /*   setLoading(false) */
    /* } */
  }

  if (fieldArray.fields.length === 0) {
    return (
      <div className="my-14 flex flex-col items-center justify-center gap-2">
        <h2 className="text-foreground text-center text-lg font-extrabold">
          Add Special Needs (If Any)
        </h2>
        <Button
          type="button"
          onClick={() => {
            fieldArray.append({
              title: "",
              description: "",
              url: "",
            })
          }}
        >
          <Plus className="mr-2 size-4" /> Add
        </Button>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
            <StepperFormActions loading={loading} />
          </form>
        </Form>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4">
        <div className="mb-4 hidden justify-end md:flex">
          <Button
            type="button"
            onClick={() => {
              if (fieldArray.fields.length >= 3) {
                toast.warning("Maximum 3 special needs")
                return
              }
              fieldArray.append({
                title: "",
                description: "",
                url: "",
              })
            }}
          >
            <Plus className="mr-2 size-4" /> Add
          </Button>
        </div>
        <div className="flex flex-wrap justify-evenly gap-4">
          {fieldArray.fields.map((field, index) => (
            <Card className="w-[350px]" key={field.id}>
              <CardHeader>
                <CardTitle className="text-lg">
                  Special Needs #{index + 1}
                </CardTitle>
                <CardDescription>
                  Short sumary of any special needs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name={`specialNeeds.${index}.title`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input label="Title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`specialNeeds.${index}.description`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input label="Description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`specialNeeds.${index}.url`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input label="Url" type="url" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => {
                    fieldArray.update(index, {
                      title: "",
                      description: "",
                      url: "",
                    })
                  }}
                >
                  Clear
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    fieldArray.remove(index)
                  }}
                >
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        <Button
          type="button"
          className="mt-4 w-full md:hidden"
          onClick={() => {
            if (fieldArray.fields.length >= 3) {
              toast.warning("Maximum 3 special needs")
              return
            }
            fieldArray.append({
              title: "",
              description: "",
              url: "",
            })
          }}
        >
          <Plus className="mr-2 size-4" /> Add
        </Button>
        <StepperFormActions loading={loading} />
      </form>
    </Form>
  )
}

export default memo(SpecialNeedFormInfo)
