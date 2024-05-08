import Image from "next/image"
import Link from "next/link"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@web/src/components/ui/avatar"
import { buttonVariants } from "@web/src/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@web/src/components/ui/card"
import { Input } from "@web/src/components/ui/input"
import { ScrollArea } from "@web/src/components/ui/scroll-area"
import { cn, getShortName } from "@web/src/lib/utils"
import {
  AddressContactFormSchema,
  CountriesSchema,
  DocumentFormSchema,
  PersonalInfoFormSchema,
} from "api-contract/types"
import { format } from "date-fns"
import { ExternalLink, PencilLine } from "lucide-react"
import { z } from "zod"

interface UserProfileProps {
  countries: z.infer<typeof CountriesSchema>[]
  personalInfo: z.infer<typeof PersonalInfoFormSchema>
  addressContactInfo: z.infer<typeof AddressContactFormSchema>
  documentInfo: z.infer<typeof DocumentFormSchema>
  editable: boolean
  profileId: string
  isAdmin: boolean
}

const UserProfile: React.FC<UserProfileProps> = ({
  countries,
  personalInfo,
  addressContactInfo,
  documentInfo,
  editable,
  profileId,
  isAdmin,
}) => {
  const countryName = countries.find(
    (country) => country.id === addressContactInfo.countryId
  )?.name

  return (
    <div className="flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
      <div className="flex h-full flex-col gap-2 border-b pb-4 md:border-b-0 md:border-r md:pb-0">
        <Link href={documentInfo.profileUrl} target="_blank" className="w-fit">
          <Avatar className={"mb-2 size-20"}>
            <AvatarImage
              src={documentInfo.profileUrl}
              alt={
                personalInfo.middleName
                  ? `${personalInfo.firstName} ${personalInfo.middleName} ${personalInfo.lastName}`
                  : `${personalInfo.firstName} ${personalInfo.lastName}`
              }
            />
            <AvatarFallback className="pb-2 text-4xl">
              {getShortName(
                personalInfo.middleName
                  ? `${personalInfo.firstName} ${personalInfo.middleName} ${personalInfo.lastName}`
                  : `${personalInfo.firstName} ${personalInfo.lastName}` ??
                      "New User"
              )}
            </AvatarFallback>
          </Avatar>
        </Link>
        <div className="flex gap-2">
          <p className="text-foreground/60">Name:</p>
          <p>
            {personalInfo.middleName
              ? `${personalInfo.firstName} ${personalInfo.middleName} ${personalInfo.lastName}`
              : `${personalInfo.firstName} ${personalInfo.lastName}`}
          </p>
        </div>
        <div className="flex gap-2">
          <p className="text-foreground/60">DOB:</p>
          <p>{format(personalInfo.dob, "PPP") as string}</p>
        </div>
        <div className="flex gap-2">
          <p className="text-foreground/60">Gender:</p>
          <p>
            {personalInfo.gender[0].toUpperCase() +
              personalInfo.gender.slice(1)}
          </p>
        </div>
        <div className="flex gap-2">
          <p className="text-foreground/60">Verified:</p>
          <p>
            {documentInfo.verified === null
              ? "Pending"
              : documentInfo.verified
                ? "Yes"
                : "No"}
          </p>
        </div>
        {documentInfo.verified === false && editable && (
          <Link
            href={`/user/profile/update/${profileId}?from=${encodeURIComponent(`/user/profile/${profileId}`)}`}
            className={cn(
              buttonVariants({ variant: "default" }),
              "mr-0 md:mr-6"
            )}
          >
            <PencilLine className="mr-2 size-4" />
            Update profile
          </Link>
        )}
      </div>
      <div className="mt-4 w-full md:sticky md:z-30 md:-ml-2 md:mt-0 md:h-[calc(100vh-5.5rem)] md:shrink-0">
        <ScrollArea className="h-full">
          <div>
            <h1 className="mb-4 text-2xl font-extrabold leading-none">
              Address and Contacts
            </h1>
            <div className="flex flex-wrap justify-start gap-4">
              <Card className="w-full">
                <CardContent className="grid gap-4 pt-6 sm:grid-cols-2">
                  <Input
                    label="Street Name"
                    value={addressContactInfo.street}
                    readOnly
                    aria-readonly
                  />
                  <Input
                    label="City Name"
                    value={addressContactInfo.city}
                    readOnly
                    aria-readonly
                  />
                  <Input
                    label="State Name"
                    value={addressContactInfo.state}
                    readOnly
                    aria-readonly
                  />
                  <Input
                    label="Postal Code"
                    value={addressContactInfo.postalCode}
                    readOnly
                    aria-readonly
                  />
                  <Input
                    label="Country Name"
                    value={countryName}
                    readOnly
                    aria-readonly
                  />
                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-1">
                      <Input
                        label="Code"
                        value={addressContactInfo.phoneCode}
                        readOnly
                        aria-readonly
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        label="Phone Number"
                        value={addressContactInfo.phoneNumber}
                        readOnly
                        aria-readonly
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          {(editable || isAdmin) && (
            <div className="my-4">
              <h1 className="mb-4 text-2xl font-extrabold leading-none">
                Documents
              </h1>
              <div className="flex flex-wrap justify-start gap-4">
                <Link
                  href={documentInfo.documentUrl}
                  target="_blank"
                  className="w-full md:w-fit"
                >
                  <Card className="w-full md:w-[350px]">
                    <CardHeader>
                      <CardTitle className="text-muted-foreground flex items-center justify-between text-base font-semibold">
                        <span>Passport / Citizenship / License</span>
                        <ExternalLink className="size-4" />
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center justify-center">
                      <Image
                        src={documentInfo.documentUrl}
                        width={300}
                        height={250}
                        alt="Passport / Citizenship / License"
                        className="bg-foreground h-52 w-full rounded-lg object-cover"
                      />
                    </CardContent>
                  </Card>
                </Link>
                <Link
                  href={documentInfo.policeReportUrl}
                  target="_blank"
                  className="w-full md:w-fit"
                >
                  <Card className="w-full md:w-[350px]">
                    <CardHeader>
                      <CardTitle className="text-muted-foreground flex items-center justify-between text-base font-semibold">
                        <span>Police Report Document</span>
                        <ExternalLink className="size-4" />
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center justify-center">
                      <Image
                        src={documentInfo.policeReportUrl}
                        width={300}
                        height={250}
                        alt="Police Report Document"
                        className="bg-foreground h-52 w-full rounded-lg object-cover"
                      />
                    </CardContent>
                  </Card>
                </Link>
              </div>
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  )
}

export default UserProfile
