"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { createRequest } from "@web/src/actions/user/request"
import { Icons } from "@web/src/components/icons"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@web/src/components/ui/avatar"
import { Button } from "@web/src/components/ui/button"
import { ButtonInput } from "@web/src/components/ui/button-input"
import { Calendar } from "@web/src/components/ui/calendar"
import { Card, CardContent } from "@web/src/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@web/src/components/ui/form"
import { Input } from "@web/src/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@web/src/components/ui/popover"
import { ScrollArea } from "@web/src/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from "@web/src/components/ui/select"
import { Switch } from "@web/src/components/ui/switch"
import { Textarea } from "@web/src/components/ui/textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@web/src/components/ui/tooltip"
import { cn, getShortName } from "@web/src/lib/utils"
import {
  CountriesSchema,
  ExtendedFamilyInfoFormSchema,
  ExtendedRequestSchema,
  RequestSchema,
} from "api-contract/types"
import { addYears, format, isBefore } from "date-fns"
import { Check, Clock4, X } from "lucide-react"
import NProgress from "nprogress"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

interface RequestFormProps {
  id: string
  countries: z.infer<typeof CountriesSchema>[]
  familyMemberInfo: z.infer<typeof ExtendedFamilyInfoFormSchema>[]
  requestDetails: z.infer<typeof ExtendedRequestSchema> | undefined
  action: "add" | "update"
}

const RequestForm: React.FC<RequestFormProps> = ({
  id,
  countries,
  familyMemberInfo,
  requestDetails,
  action,
}) => {
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  const form = useForm<z.infer<typeof RequestSchema>>({
    resolver: zodResolver(RequestSchema),
    defaultValues: {
      id: id,
      description: requestDetails?.description ?? "",
      startTime: requestDetails?.startTime
        ? new Date(requestDetails?.startTime)
        : undefined,
      endTime: requestDetails?.endTime
        ? new Date(requestDetails?.endTime)
        : undefined,
      price: requestDetails?.price ?? undefined,
      location: requestDetails?.location ?? "",
      preferedAge: requestDetails?.preferedAge ?? undefined,
      mandatoryAge: requestDetails?.mandatoryAge ?? false,
      preferedGender: requestDetails?.preferedGender ?? undefined,
      mandatoryGender: requestDetails?.mandatoryGender ?? false,
      preferedNationality: requestDetails?.preferedNationality
        ? `${requestDetails.preferedNationality}-${
            countries.find(
              (item) => item.id === requestDetails.preferedNationality
            )?.name
          }`
        : "",
      mandatoryNationality: requestDetails?.mandatoryNationality ?? false,
      status: requestDetails?.status ?? "draft",
      familyMemberIds: requestDetails?.familyMemberIds ?? [],
    },
  })

  const onSubmit = async (data: z.infer<typeof RequestSchema>) => {
    try {
      setLoading(true)
      const response = await createRequest(data)

      if (response.status !== 200) {
        throw new Error("Something went wrong")
      }

      toast.success("Successfully created request")
      NProgress.start()
      router.push(data.status === "open" ? "/user/request" : "/user/draft")
    } catch {
      toast.error("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex-1 items-start lg:grid lg:grid-cols-[minmax(0,1fr)_410px] lg:gap-10">
            <div className="flex flex-col gap-4 px-1 sm:grid sm:grid-cols-2 sm:px-0">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        label="Location"
                        aria-invalid={
                          form.formState.errors.location ? "true" : "false"
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
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="ps-0">
                          <Input
                            label="Status"
                            className="border-x-0"
                            tabIndex={-1}
                            aria-invalid={
                              form.formState.errors.status ? "true" : "false"
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
                          <SelectItem value="open">Open</SelectItem>
                          <SelectItem value="draft">Draft</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <Popover>
                      <FormControl>
                        <PopoverTrigger className="group" asChild>
                          <ButtonInput
                            label="Start Time"
                            aria-invalid={
                              form.formState.errors.startTime ? "true" : "false"
                            }
                            {...field}
                            value={
                              field.value
                                ? (format(field.value, "PPP p") as string)
                                : undefined
                            }
                          />
                        </PopoverTrigger>
                      </FormControl>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => {
                            field.onChange(date)

                            const endTime = form.getValues("endTime")

                            if (!endTime || !date) return

                            if (isBefore(form.getValues("endTime"), date)) {
                              //@ts-ignore
                              form.setValue("endTime", undefined)
                            }
                          }}
                          captionLayout="dropdown-buttons"
                          disabled={(date) =>
                            date < new Date() || date > addYears(new Date(), 1)
                          }
                          fromYear={new Date().getFullYear()}
                          toYear={new Date().getFullYear() + 1}
                          initialFocus
                        />
                        <div className="px-4 pb-4">
                          <Input
                            label="Time"
                            type="time"
                            disabled={field.value === undefined}
                            // take locale date time string in format that the input expects (24hr time)
                            value={
                              field.value
                                ? field.value.toLocaleTimeString([], {
                                    hourCycle: "h23",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })
                                : undefined
                            }
                            // take hours and minutes and update our Date object then change date object to our new value
                            onChange={(selectedTime) => {
                              const currentTime = field.value
                              currentTime.setHours(
                                parseInt(
                                  selectedTime.target.value.split(":")[0]
                                ),
                                parseInt(
                                  selectedTime.target.value.split(":")[1]
                                ),
                                0
                              )
                              field.onChange(currentTime)
                            }}
                          />
                        </div>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <Popover>
                      <FormControl>
                        <PopoverTrigger className="group" asChild>
                          <ButtonInput
                            label="End Time"
                            aria-invalid={
                              form.formState.errors.endTime ? "true" : "false"
                            }
                            {...field}
                            value={
                              field.value
                                ? (format(field.value, "PPP p") as string)
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
                            date <
                              (form.getValues("startTime") ?? new Date()) ||
                            date > addYears(new Date(), 1)
                          }
                          fromYear={new Date().getFullYear()}
                          toYear={new Date().getFullYear() + 1}
                          initialFocus
                        />
                        <div className="px-4 pb-4">
                          <Input
                            label="Time"
                            type="time"
                            disabled={field.value === undefined}
                            // take locale date time string in format that the input expects (24hr time)
                            value={
                              field.value
                                ? field.value.toLocaleTimeString([], {
                                    hourCycle: "h23",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })
                                : undefined
                            }
                            // take hours and minutes and update our Date object then change date object to our new value
                            onChange={(selectedTime) => {
                              const currentTime = field.value
                              currentTime.setHours(
                                parseInt(
                                  selectedTime.target.value.split(":")[0]
                                ),
                                parseInt(
                                  selectedTime.target.value.split(":")[1]
                                ),
                                0
                              )
                              field.onChange(currentTime)
                            }}
                          />
                        </div>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="preferedAge"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        label="Prefered Age"
                        type="number"
                        aria-invalid={
                          form.formState.errors.preferedAge ? "true" : "false"
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
                name="mandatoryAge"
                render={({ field }) => (
                  <FormItem className="bg-background border-input flex h-10 flex-row items-center justify-between space-y-0 rounded-md border px-2">
                    <div>
                      <FormLabel className="text-muted-foreground">
                        Mandatory age
                      </FormLabel>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="preferedGender"
                render={({ field }) => (
                  <FormItem>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="ps-0">
                          <Input
                            label="Prefered Gender"
                            className="border-x-0"
                            tabIndex={-1}
                            aria-invalid={
                              form.formState.errors.preferedGender
                                ? "true"
                                : "false"
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
                name="mandatoryGender"
                render={({ field }) => (
                  <FormItem className="bg-background border-input flex h-10 flex-row items-center justify-between space-y-0 rounded-md border px-2">
                    <div>
                      <FormLabel className="text-muted-foreground">
                        Mandatory gender
                      </FormLabel>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="preferedNationality"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger className="ps-0">
                            <Input
                              label="Prefered nationality"
                              className="border-x-0"
                              tabIndex={-1}
                              aria-invalid={
                                form.formState.errors.preferedNationality
                                  ? "true"
                                  : "false"
                              }
                              {...field}
                              value={
                                field.value
                                  ? field.value.split("-")[5]
                                  : undefined
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Nationality</SelectLabel>
                            {countries.map((country) => (
                              <SelectItem
                                value={`${country.id}-${country.nationality}`}
                                content={`${country.name}`}
                                key={country.id}
                              >
                                {country.nationality}
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
                name="mandatoryNationality"
                render={({ field }) => (
                  <FormItem className="bg-background border-input flex h-10 flex-row items-center justify-between space-y-0 rounded-md border px-2">
                    <div>
                      <FormLabel className="text-muted-foreground">
                        Mandatory nationality
                      </FormLabel>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Input label="Currency" value="NRs" readOnly aria-readonly />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        label="Price"
                        type="number"
                        aria-invalid={
                          form.formState.errors.price ? "true" : "false"
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
                name="description"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormControl>
                      <Textarea
                        label="Description"
                        aria-invalid={
                          form.formState.errors.description ? "true" : "false"
                        }
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="col-span-2 hidden w-full items-center justify-end lg:flex">
                <Button disabled={loading}>
                  {loading ? (
                    <Icons.spinner className="mr-2 size-4 animate-spin text-white" />
                  ) : null}
                  {action[0].toUpperCase() + action.slice(1)} Request
                </Button>
              </div>
            </div>
            <div className="mt-4 w-full md:sticky lg:z-30 lg:-ml-2 lg:mt-0 lg:h-[calc(100vh-10.75rem)] lg:shrink-0 lg:border-l">
              <ScrollArea className="h-full">
                <FormField
                  control={form.control}
                  name="familyMemberIds"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          label="Family Members Id"
                          aria-invalid={
                            form.formState.errors.familyMemberIds
                              ? "true"
                              : "false"
                          }
                          hidden
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="lg:text-center" />
                    </FormItem>
                  )}
                />
                <div className="space-y-4 p-4">
                  {familyMemberInfo.map((member) => (
                    <Card
                      className={cn(
                        "w-full cursor-pointer",
                        form.getValues("familyMemberIds").includes(member.id)
                          ? "ring-ring ring-2 ring-offset-2"
                          : "",
                        member.verified !== true &&
                          "cursor-not-allowed opacity-50"
                      )}
                      key={member.id}
                      onClick={() => {
                        if (member.verified !== true) return

                        const oldFamilyMemberIds =
                          form.getValues().familyMemberIds

                        let updatedFamilyMemberIds

                        if (oldFamilyMemberIds.includes(member.id)) {
                          updatedFamilyMemberIds = oldFamilyMemberIds.filter(
                            (id) => id !== member.id
                          )
                        } else {
                          updatedFamilyMemberIds = [
                            ...form.getValues().familyMemberIds,
                            member.id,
                          ]
                        }

                        form.setValue(
                          "familyMemberIds",
                          updatedFamilyMemberIds,
                          { shouldValidate: true }
                        )
                      }}
                    >
                      <CardContent className="flex items-center gap-4 pt-6">
                        <Avatar className={"size-14"}>
                          <AvatarImage
                            src={member.profileUrl}
                            alt={
                              member.middleName
                                ? `${member.firstName} ${member.middleName} ${member.lastName}`
                                : `${member.firstName} ${member.lastName}`
                            }
                          />
                          <AvatarFallback className="text-2xl">
                            {getShortName(
                              member.middleName
                                ? `${member.firstName} ${member.middleName} ${member.lastName}`
                                : `${member.firstName} ${member.lastName}` ??
                                    "New User"
                            )}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold">
                              {member.middleName
                                ? `${member.firstName} ${member.middleName} ${member.lastName}`
                                : `${member.firstName} ${member.lastName}`}
                            </p>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger type="button">
                                  <div>
                                    {member.verified === null ? (
                                      <Clock4 className="size-3" />
                                    ) : !member.verified ? (
                                      <X className="size-3" />
                                    ) : (
                                      <Check className="size-3" />
                                    )}
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  {member.verified === null ? (
                                    <p>Verification Pending</p>
                                  ) : !member.verified ? (
                                    <p>Verification Failed</p>
                                  ) : (
                                    <p>Verified Member</p>
                                  )}
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                          <p className="text-muted-foreground text-sm">
                            {format(member.dob, "PPP") as string}
                          </p>
                          <p className="text-muted-foreground text-sm">
                            {member.gender[0].toUpperCase() +
                              member.gender.slice(1)}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
              <div className="col-span-2 flex w-full items-center justify-end lg:hidden">
                <Button disabled={loading}>
                  {loading ? (
                    <Icons.spinner className="mr-2 size-4 animate-spin text-white" />
                  ) : null}
                  {action[0].toUpperCase() + action.slice(1)} Request
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default RequestForm
