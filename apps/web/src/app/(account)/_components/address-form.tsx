"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { StepperFormActions } from "@web/src/components/stepper-form-action"
import { ButtonInput } from "@web/src/components/ui/button-input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@web/src/components/ui/form"
import { Input } from "@web/src/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from "@web/src/components/ui/select"
import { useStepper } from "@web/src/components/ui/stepper"
import { useForm } from "react-hook-form"
import { z } from "zod"

interface AddressContactProps {
  // Props
}

// Get Address and Contacts of user
const AddressContactSchema = z.object({
  street: z.string().min(2, {
    message: "Street must be at least 2 characters.",
  }),
  city: z.string().min(2, {
    message: "City must be at least 2 characters.",
  }),
  state: z.string().min(2, {
    message: "State must be at least 2 characters.",
  }),
  postalCode: z
    .string({ required_error: "Postal code is required" })
    .length(5, { message: "Postal code must be 5 digits long." })
    .transform((v) => Number(v) || 0),
  countryId: z.string().min(3, { message: "Country Name is required" }),
  phoneCode: z.string().min(3, { message: "Code is required" }),
  phoneNumber: z
    .string({ required_error: "Phone Number is required" })
    .length(10, { message: "Phone Number must be 10 digits long." })
    .transform((v) => Number(v) || 0),
})

const countryList = [
  {
    id: 1,
    name: "Afghanistan",
    nationality: "Afghan",
    short_name: "AF",
    country_code: "93",
  },
  {
    id: 2,
    name: "Albania",
    nationality: "Albanian",
    short_name: "AL",
    country_code: "355",
  },
  {
    id: 3,
    name: "Algeria",
    nationality: "Algerian",
    short_name: "DZ",
    country_code: "213",
  },
]

const AddressContact: React.FC<AddressContactProps> = ({}) => {
  const { nextStep } = useStepper()

  const onSubmit = (data: z.infer<typeof AddressContactSchema>) => {
    nextStep()
  }

  const form = useForm<z.infer<typeof AddressContactSchema>>({
    resolver: zodResolver(AddressContactSchema),
    defaultValues: {
      street: "",
      city: "",
      state: "",
      postalCode: undefined,
      countryId: "",
      phoneCode: "",
      phoneNumber: undefined,
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8">
        <div className="grid gap-4 px-1 sm:grid-cols-2 sm:px-0">
          <FormField
            control={form.control}
            name="street"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input label="Street Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input label="City Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input label="State Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="postalCode"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input label="Postal Code" type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="countryId"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="ps-0">
                        <Input
                          label="Country Name"
                          className="border-x-0"
                          tabIndex={-1}
                          {...field}
                          value={
                            field.value ? field.value.split("-")[1] : undefined
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Country</SelectLabel>
                        {countryList.map((country) => (
                          <SelectItem
                            value={`${country.id}-${country.name}`}
                            content={`${country.name}`}
                            key={country.id}
                          >
                            {country.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-3 gap-2">
            <FormField
              control={form.control}
              name="phoneCode"
              render={({ field }) => (
                <FormItem className="col-span-1">
                  <FormControl>
                    <Select onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="ps-0">
                          <Input
                            label="Code"
                            className="border-x-0"
                            tabIndex={-1}
                            {...field}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Phone Code</SelectLabel>
                          {countryList.map((country) => (
                            <SelectItem
                              value={country.country_code}
                              key={country.id}
                            >
                              {country.country_code}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormControl>
                    <Input label="Phone Number" type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <StepperFormActions />
      </form>
    </Form>
  )
}

export default AddressContact
