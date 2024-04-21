"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { setAddressContactInfo } from "@web/src/actions/user"
import { StepperFormActions } from "@web/src/components/stepper-form-action"
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
import { AddressContactFormSchema, CountriesSchema } from "api-contract/types"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

interface AddressContactProps {
  countries: z.infer<typeof CountriesSchema>[]
  addressContactInfo: z.infer<typeof AddressContactFormSchema> | undefined
}

const AddressContact: React.FC<AddressContactProps> = ({
  countries,
  addressContactInfo,
}) => {
  const [loading, setLoading] = useState(false)
  const { nextStep } = useStepper()

  const form = useForm<z.infer<typeof AddressContactFormSchema>>({
    resolver: zodResolver(AddressContactFormSchema),
    defaultValues: {
      street: addressContactInfo?.street ?? "",
      city: addressContactInfo?.city ?? "",
      state: addressContactInfo?.state ?? "",
      postalCode: addressContactInfo?.postalCode ?? "",
      countryId: addressContactInfo?.countryId
        ? addressContactInfo.countryId +
          "-" +
          countries.find(
            (country) => country.id.toString() === addressContactInfo.countryId
          )?.name
        : "",
      phoneCode: addressContactInfo?.phoneCode ?? "",
      phoneNumber: addressContactInfo?.phoneNumber ?? "",
    },
  })

  const onSubmit = async (data: z.infer<typeof AddressContactFormSchema>) => {
    try {
      setLoading(true)
      const response = await setAddressContactInfo(data)

      if (response.status === 409) {
        form.setError("phoneNumber", {
          type: "validate",
          message: response.body.message,
        })
        return
      }

      if (response.status === 422 || response.status === 500) {
        toast.error("Something went wrong!")
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
                            field.value ? field.value.split("-")[5] : undefined
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Country</SelectLabel>
                        {countries.map((country) => (
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

                          {countries
                            .sort((a, b) =>
                              a.country_code.localeCompare(b.country_code)
                            )
                            .map((country) => (
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
        <StepperFormActions loading={loading} />
      </form>
    </Form>
  )
}

export default AddressContact
