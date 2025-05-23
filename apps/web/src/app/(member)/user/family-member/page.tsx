import { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { getAllFamilyMemberInfo } from "@web/src/actions/user/family-member"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@web/src/components/ui/alert"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@web/src/components/ui/avatar"
import { buttonVariants } from "@web/src/components/ui/button"
import { Card, CardContent } from "@web/src/components/ui/card"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@web/src/components/ui/tooltip"
import { getCurrentUser } from "@web/src/lib/session"
import { cn, getShortName } from "@web/src/lib/utils"
import { format } from "date-fns"
import { Check, Clock4, MailWarning, Plus, X } from "lucide-react"
import { v4 as uuidv4 } from "uuid"

export const metadata: Metadata = {
  title: "Family Members",
  description: "All the family members you've added",
}

export default async function FamilyMembers() {
  const familyMembers = await getAllFamilyMemberInfo()
  const user = await getCurrentUser()

  if (!user) {
    redirect("/")
  }

  return (
    <main className="w-full">
      {user.verified === false && (
        <Link href={`/user/profile/update/${user.id}`}>
          <Alert className="mb-4" variant={"destructive"}>
            <MailWarning className="size-4" />
            <AlertTitle>Account verification failed.</AlertTitle>
            <AlertDescription>
              Please go through your profile and update it.
            </AlertDescription>
          </Alert>
        </Link>
      )}
      <h1 className="mb-4 text-2xl font-bold leading-none">Family Members</h1>
      {familyMembers.status === 204 ? (
        <>
          <p className="text-muted-foreground text-sm">
            No family members found
          </p>
          <Link
            href={`/user/family-member/add/${uuidv4()}`}
            className={cn(buttonVariants({ variant: "default" }), "mt-4")}
          >
            <Plus className="mr-2 size-4" />
            Add family members.
          </Link>
        </>
      ) : familyMembers.status === 500 ? (
        familyMembers.body.message
      ) : (
        <div className="gird-cols-1 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {familyMembers.body.data.map((member) => (
            <Link
              href={`/user/family-member/${member.id}`}
              className="w-full"
              key={member.id}
            >
              <Card className="w-full">
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
                          <TooltipTrigger className="">
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
                      {member.gender[0].toUpperCase() + member.gender.slice(1)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}
