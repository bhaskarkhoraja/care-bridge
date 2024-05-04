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
  CardDescription,
  CardHeader,
  CardTitle,
} from "@web/src/components/ui/card"
import { Input } from "@web/src/components/ui/input"
import { ScrollArea } from "@web/src/components/ui/scroll-area"
import { Textarea } from "@web/src/components/ui/textarea"
import { cn, getShortName } from "@web/src/lib/utils"
import { format } from "date-fns"
import { ExternalLink, PencilLine } from "lucide-react"
import {
  FamilyInfoFormSchema,
  FamilySpecialNeedsSchema,
} from "node_modules/api-contract/dist/types/family-member.mjs"
import { DocumentFormSchema } from "node_modules/api-contract/dist/types/user.mjs"
import { z } from "zod"

interface FamilyMemberProfileProps {
  familyMemberInfo: z.infer<typeof FamilyInfoFormSchema>
  familySpecialNeedInfo: z.infer<typeof FamilySpecialNeedsSchema>
  familyDocumentInfo: z.infer<typeof DocumentFormSchema>
  familyMemberId: string
}

const FamilyMemberProfile: React.FC<FamilyMemberProfileProps> = ({
  familyMemberInfo,
  familySpecialNeedInfo,
  familyDocumentInfo,
  familyMemberId,
}) => {
  return (
    <div className="flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
      <div className="flex h-full flex-col gap-2 border-b pb-4 md:border-b-0 md:border-r md:pb-0">
        <Link
          href={familyDocumentInfo.profileUrl}
          target="_blank"
          className="w-fit"
        >
          <Avatar className={"mb-2 size-20"}>
            <AvatarImage
              src={familyDocumentInfo.profileUrl}
              alt={
                familyMemberInfo.middleName
                  ? `${familyMemberInfo.firstName} ${familyMemberInfo.middleName} ${familyMemberInfo.lastName}`
                  : `${familyMemberInfo.firstName} ${familyMemberInfo.lastName}`
              }
            />
            <AvatarFallback className="text-2xl">
              {getShortName(
                familyMemberInfo.middleName
                  ? `${familyMemberInfo.firstName} ${familyMemberInfo.middleName} ${familyMemberInfo.lastName}`
                  : `${familyMemberInfo.firstName} ${familyMemberInfo.lastName}` ??
                      "New User"
              )}
            </AvatarFallback>
          </Avatar>
        </Link>
        <div className="flex gap-2">
          <p className="text-foreground/60">Name:</p>
          <p>
            {familyMemberInfo.middleName
              ? `${familyMemberInfo.firstName} ${familyMemberInfo.middleName} ${familyMemberInfo.lastName}`
              : `${familyMemberInfo.firstName} ${familyMemberInfo.lastName}`}
          </p>
        </div>
        <div className="flex gap-2">
          <p className="text-foreground/60">DOB:</p>
          <p>{format(familyMemberInfo.dob, "PPP") as string}</p>
        </div>
        <div className="flex gap-2">
          <p className="text-foreground/60">Gender:</p>
          <p>
            {familyMemberInfo.gender[0].toUpperCase() +
              familyMemberInfo.gender.slice(1)}
          </p>
        </div>
        <div className="flex gap-2">
          <p className="text-foreground/60">Verified:</p>
          <p>
            {familyDocumentInfo.verified === null
              ? "Pending"
              : familyDocumentInfo.verified
                ? "Yes"
                : "Failed"}
          </p>
        </div>
        {familyDocumentInfo.verified === false && (
          <Link
            href={`/user/family-member/update/${familyMemberId}`}
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

      <div className="mt-4 w-full md:sticky md:z-30 md:-ml-2 md:mt-0 md:h-[calc(100vh-3.5rem)] md:shrink-0">
        <ScrollArea className="h-full">
          <div>
            <h1 className="mb-4 text-2xl font-extrabold leading-none">
              Special Needs
            </h1>
            <div className="flex flex-wrap justify-start gap-4">
              {familySpecialNeedInfo.specialNeeds.map((needs, index) => (
                <Card className="w-full md:w-[350px]" key={needs.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Special Needs #{index + 1}
                    </CardTitle>
                    <CardDescription>
                      Short sumary of any special needs
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Input
                      label="Title"
                      value={needs.title}
                      readOnly
                      aria-readonly
                    />
                    <Textarea
                      label="Description"
                      value={needs.description}
                      readOnly
                      aria-readonly
                    />
                    <Input
                      label="Url"
                      type="url"
                      value={needs.url}
                      readOnly
                      aria-readonly
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          <div className="my-4">
            <h1 className="mb-4 text-2xl font-extrabold leading-none">
              Documents
            </h1>
            <div className="flex flex-wrap justify-start gap-4">
              <Link
                href={familyDocumentInfo.documentUrl}
                target="_blank"
                className="w-full md:w-fit"
              >
                <Card className="w-full md:w-[350px]">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between text-lg">
                      <span> Passport / Birth Certificate</span>
                      <ExternalLink className="size-4" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex items-center justify-center">
                    <Image
                      src={familyDocumentInfo.documentUrl}
                      width={300}
                      height={250}
                      alt="Passport / Birth Certificate"
                      className="rounded-lg"
                    />
                  </CardContent>
                </Card>
              </Link>
              <Link
                href={familyDocumentInfo.policeReportUrl}
                target="_blank"
                className="w-full md:w-fit"
              >
                <Card className="w-full md:w-[350px]">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between text-lg">
                      <span>Police Report Document</span>
                      <ExternalLink className="size-4" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex items-center justify-center">
                    <Image
                      src={familyDocumentInfo.policeReportUrl}
                      width={300}
                      height={250}
                      alt="Police Report Document"
                      className="rounded-lg"
                    />
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}

export default FamilyMemberProfile
