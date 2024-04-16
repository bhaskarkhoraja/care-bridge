"use client"

import { zodResolver } from "@hookform/resolvers/zod"
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
import { format, subYears } from "date-fns"
import { useForm } from "react-hook-form"
import { z } from "zod"

interface PersonalInfoFormProps {
  // Props
}

// Get Pernosal Information
const PersonalInfoFormSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  middleName: z.union([
    z.string().min(2, {
      message: "Middle name must be at least 2 characters.",
    }),
    z.string().length(0),
  ]),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  userName: z
    .string()
    .min(2, {
      message: "Username must be at least 2 characters.",
    })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "Username can only contain letters, numbers, and underscores.",
    }),
  dob: z.date(),
  gender: z.enum(["male", "female", "others"]),
})

const PersonalFormInfo: React.FC<PersonalInfoFormProps> = () => {
  const { nextStep } = useStepper()

  const form = useForm<z.infer<typeof PersonalInfoFormSchema>>({
    resolver: zodResolver(PersonalInfoFormSchema),
    defaultValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      userName: "",
    },
  })

  const onSubmit = (data: z.infer<typeof PersonalInfoFormSchema>) => {
    nextStep()
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
                  <Input label="First Name" {...field} />
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
                  <Input label="Middle Name" {...field} />
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
                  <Input label="Last Name" {...field} />
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
                  <Input label="Username" {...field} />
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
        <StepperFormActions />
      </form>
    </Form>
  )
}

export default PersonalFormInfo
