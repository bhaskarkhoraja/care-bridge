import Link from "next/link"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@web/src/components/ui/avatar"
import { buttonVariants } from "@web/src/components/ui/button"
import { Card, CardContent } from "@web/src/components/ui/card"
import { Input } from "@web/src/components/ui/input"
import { Label } from "@web/src/components/ui/label"
import { ScrollArea } from "@web/src/components/ui/scroll-area"
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
  ExtendedPersonalInfoFormSchema,
  ExtendedRequestSchema,
} from "api-contract/types"
import { format } from "date-fns"
import { Check, MailPlus } from "lucide-react"
import { z } from "zod"

import AcceptApplicantButton from "./accept-applicant-button"
import ApplyRequest from "./apply-request"

interface ViewRequestProps {
  requestDetails: z.infer<typeof ExtendedRequestSchema>
  countries: z.infer<typeof CountriesSchema>[]
  showFamilyMembers: boolean
  applied: boolean
  applicants: z.infer<typeof ExtendedPersonalInfoFormSchema>[] | undefined
}

const ViewRequest: React.FC<ViewRequestProps> = ({
  requestDetails,
  countries,
  showFamilyMembers,
  applied,
  applicants,
}) => {
  return (
    <div>
      <div className="flex-1 items-start lg:grid lg:grid-cols-[minmax(0,1fr)_410px]">
        <div className="mt-4 w-full md:sticky lg:z-30 lg:-ml-2 lg:mt-0 lg:h-[calc(100vh-10.75rem)] lg:shrink-0">
          <ScrollArea className="h-full">
            <div className="flex flex-col gap-4 px-1 sm:grid sm:grid-cols-2 sm:px-0 lg:pr-5">
              <Input
                label="Location"
                readOnly
                aria-readonly
                value={requestDetails.location}
              />
              <Input
                label="Status"
                readOnly
                aria-readonly
                value={
                  requestDetails.status[0].toUpperCase() +
                  requestDetails.status.slice(1)
                }
              />
              <Input
                label="Start Time"
                readOnly
                aria-readonly
                value={format(requestDetails.startTime, "PPP p") as string}
              />
              <Input
                label="End Time"
                readOnly
                aria-readonly
                value={format(requestDetails.endTime, "PPP p") as string}
              />
              <Input
                label="Prefered age"
                readOnly
                aria-readonly
                value={requestDetails.preferedAge || "None"}
              />
              <div className="bg-background border-input flex h-10 flex-row items-center justify-between space-y-0 rounded-md border px-2">
                <div>
                  <Label className="text-muted-foreground">Mandatory age</Label>
                </div>
                <Switch checked={requestDetails.mandatoryAge} />
              </div>
              <Input
                label="Prefered gender"
                readOnly
                aria-readonly
                value={
                  requestDetails.preferedGender
                    ? requestDetails.preferedGender[0].toUpperCase() +
                      requestDetails.preferedGender.slice(1)
                    : "None"
                }
              />
              <div className="bg-background border-input flex h-10 flex-row items-center justify-between space-y-0 rounded-md border px-2">
                <div>
                  <Label className="text-muted-foreground">
                    Mandatory gender
                  </Label>
                </div>
                <Switch checked={requestDetails.mandatoryGender} />
              </div>
              <Input
                label="Prefered nationality"
                readOnly
                aria-readonly
                value={
                  countries.find(
                    (item) => item.id === requestDetails.preferedNationality
                  )?.name || "None"
                }
              />
              <div className="bg-background border-input flex h-10 flex-row items-center justify-between space-y-0 rounded-md border px-2">
                <div>
                  <Label className="text-muted-foreground">
                    Mandatory nationality
                  </Label>
                </div>
                <Switch checked={requestDetails.mandatoryNationality} />
              </div>
              <Input label="Currency" readOnly aria-readonly value={"NRs"} />
              <Input
                label="Price"
                readOnly
                aria-readonly
                value={requestDetails.price}
              />
              <div className="col-span-2">
                <Textarea
                  label="Description"
                  readOnly
                  aria-readonly
                  value={requestDetails.description}
                />
              </div>
              <div className="col-span-2 hidden w-full items-center justify-end lg:flex">
                {showFamilyMembers ? (
                  <Link
                    href={
                      requestDetails.status === "close"
                        ? "/user/requests/archive"
                        : `/user/requests/request/update/${requestDetails.id}`
                    }
                    className={buttonVariants({ variant: "default" })}
                  >
                    {requestDetails.status === "close"
                      ? "View Archive"
                      : "Update Request"}
                  </Link>
                ) : (
                  <ApplyRequest
                    requestId={requestDetails.id}
                    applied={applied}
                  />
                )}
              </div>
            </div>
            {showFamilyMembers && (
              <div className="mt-4 border-t pb-2 pt-4 lg:pr-5">
                <h2 className="mb-4 text-lg font-semibold">Applicants</h2>
                <div className="space-y-4">
                  {applicants ? (
                    applicants.map((applicant) => (
                      <Card className={cn("w-full")} key={applicant.id}>
                        <CardContent className="relative flex items-center gap-4 pt-6">
                          <div className="absolute right-4 top-0 flex h-full w-fit items-center justify-center gap-4">
                            <AcceptApplicantButton
                              requestId={requestDetails.id}
                              sellerProfileId={applicant.id}
                            />
                            <Link
                              href={`/user/message/${applicant.id}`}
                              className={buttonVariants({
                                variant: "default",
                                size: "icon",
                              })}
                            >
                              <MailPlus className="size-4" />
                            </Link>
                          </div>
                          <Avatar className={"size-14"}>
                            <AvatarImage
                              src={applicant.profileUrl}
                              alt={
                                applicant.middleName
                                  ? `${applicant.firstName} ${applicant.middleName} ${applicant.lastName}`
                                  : `${applicant.firstName} ${applicant.lastName}`
                              }
                            />
                            <AvatarFallback className="text-2xl">
                              {getShortName(
                                applicant.middleName
                                  ? `${applicant.firstName} ${applicant.middleName} ${applicant.lastName}`
                                  : `${applicant.firstName} ${applicant.lastName}` ??
                                      "New User"
                              )}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-semibold">
                                {applicant.middleName
                                  ? `${applicant.firstName} ${applicant.middleName} ${applicant.lastName}`
                                  : `${applicant.firstName} ${applicant.lastName}`}
                              </p>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger type="button">
                                    <Check className="size-3" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Verified applicant</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                            <p className="text-muted-foreground text-sm">
                              {format(applicant.dob, "PPP") as string}
                            </p>
                            <p className="text-muted-foreground text-sm">
                              {applicant.gender[0].toUpperCase() +
                                applicant.gender.slice(1)}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-sm">
                      No applicants found
                    </p>
                  )}
                </div>
              </div>
            )}
          </ScrollArea>
        </div>
        <div className="mt-4 w-full md:sticky lg:z-30 lg:-ml-2 lg:mt-0 lg:h-[calc(100vh-10.75rem)] lg:shrink-0 lg:border-l lg:pl-5">
          <ScrollArea className="h-full">
            <div className="space-y-4 py-4">
              <h2 className="mb-4 text-lg font-semibold lg:hidden">
                Family Members
              </h2>
              {showFamilyMembers ? (
                requestDetails.familyMembers.map((member) => (
                  <Card className={cn("w-full")} key={member.id}>
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
                                  <Check className="size-3" />
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
                ))
              ) : (
                <p className="text-muted-foreground text-sm">
                  No. of family members: {requestDetails.familyMemberIds.length}
                </p>
              )}
            </div>
          </ScrollArea>
          <div className="col-span-2 flex w-full items-center justify-end lg:hidden">
            {showFamilyMembers ? (
              <Link
                href={
                  requestDetails.status === "close"
                    ? "/user/requests/archive"
                    : `/user/requests/request/update/${requestDetails.id}`
                }
                className={buttonVariants({ variant: "default" })}
              >
                {requestDetails.status === "close"
                  ? "View Archive"
                  : "Update Request"}
              </Link>
            ) : (
              <ApplyRequest requestId={requestDetails.id} applied={applied} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewRequest
