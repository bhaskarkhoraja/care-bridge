"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { setPersonalInfo } from "@web/src/actions/user"
import { StepperFormActions } from "@web/src/components/stepper-form-action"
import { ButtonInput } from "@web/src/components/ui/button-input"
import { Calendar } from "@web/src/components/ui/calendar"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@web/src/components/ui/form"
import { Input } from "@web/src/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@web/src/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from "@web/src/components/ui/select"
import { useStepper } from "@web/src/components/ui/stepper"
import { PersonalInfoFormSchema } from "api-contract/types"
import { format, subYears } from "date-fns"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

interface PersonalInfoFormProps {
  personalInfo: z.infer<typeof PersonalInfoFormSchema> | undefined
}

const PersonalFormInfo: React.FC<PersonalInfoFormProps> = ({
  personalInfo,
}) => {
  const [loading, setLoading] = useState(false)
  const { nextStep } = useStepper()

  const form = useForm<z.infer<typeof PersonalInfoFormSchema>>({
    resolver: zodResolver(PersonalInfoFormSchema),
    defaultValues: {
      firstName: personalInfo?.firstName ?? "",
      middleName: personalInfo?.middleName ?? "",
      lastName: personalInfo?.lastName ?? "",
      userName: personalInfo?.userName ?? "",
      dob: personalInfo?.dob ? new Date(personalInfo.dob) : undefined,
      gender: personalInfo?.gender ?? undefined,
    },
  })

  const onSubmit = async (data: z.infer<typeof PersonalInfoFormSchema>) => {
    try {
      setLoading(true)
      const response = await setPersonalInfo(data)

      if (response.status === 409) {
        form.setError("userName", {
          type: "validate",
          message: response.body.message,
        })
        return
      }

      if (response.status === 422 || response.status === 500) {
        toast.error(response.body.message)
        return
      }

      nextStep()
    } catch {
      toast.error("Something went wrong!")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8">
        <div className="grid gap-4 px-1 sm:grid-cols-2 sm:px-0">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    label="First Name"
                    aria-invalid={
                      form.formState.errors.firstName ? "true" : "false"
                    }
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="middleName"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    label="Middle Name"
                    aria-invalid={
                      form.formState.errors.middleName ? "true" : "false"
                    }
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    label="Last Name"
                    aria-invalid={
                      form.formState.errors.lastName ? "true" : "false"
                    }
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="userName"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    label="Username"
                    aria-invalid={
                      form.formState.errors.userName ? "true" : "false"
                    }
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="ps-0">
                      <Input
                        label="Gender"
                        className="border-x-0"
                        tabIndex={-1}
                        aria-invalid={
                          form.formState.errors.gender ? "true" : "false"
                        }
                        {...field}
                        value={
                          field.value
                            ? field.value[0].toUpperCase() +
                              field.value.slice(1)
                            : undefined
                        }
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Gender</SelectLabel>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="others">Others</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dob"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <Popover>
                  <FormControl>
                    <PopoverTrigger className="group" asChild>
                      <ButtonInput
                        label="Date of birth"
                        aria-invalid={
                          form.formState.errors.dob ? "true" : "false"
                        }
                        {...field}
                        value={
                          field.value
                            ? (format(field.value, "PPP") as string)
                            : undefined
                        }
                      />
                    </PopoverTrigger>
                  </FormControl>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      captionLayout="dropdown-buttons"
                      disabled={(date) =>
                        date > new Date() || date < subYears(new Date(), 35)
                      }
                      fromYear={new Date().getFullYear() - 35}
                      toYear={new Date().getFullYear()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <StepperFormActions loading={loading} />
      </form>
    </Form>
  )
}

export default PersonalFormInfo
