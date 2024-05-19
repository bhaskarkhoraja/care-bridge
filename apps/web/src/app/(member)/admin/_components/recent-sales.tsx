import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@web/src/components/ui/avatar"
import { ScrollArea } from "@web/src/components/ui/scroll-area"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@web/src/components/ui/table"
import { getShortName } from "@web/src/lib/utils"
import { AdminDashBoardSchema } from "node_modules/api-contract/dist/types/admin.mjs"
import { z } from "zod"

interface RecentSalesProps {
  data: z.infer<typeof AdminDashBoardSchema>["recentCompletedRequest"]
}

const RecentSales: React.FC<RecentSalesProps> = ({ data }) => {
  return (
    <div className="max-h-full space-y-8">
      <ScrollArea className="h-80">
        <Table>
          <TableCaption>Recent Completed task</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Buyer&apos;s info</TableHead>
              <TableHead>Seller&apos;s info</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((request, requestIndex) => (
              <TableRow key={requestIndex}>
                <TableCell className="font-medium">
                  <div className="flex h-12 items-center">
                    <Avatar className="size-9">
                      <AvatarImage
                        src={request.buyerProfile.profileUrl}
                        alt={
                          request.buyerProfile.middleName
                            ? `${request.buyerProfile.firstName} ${request.buyerProfile.middleName} ${request.buyerProfile.lastName}`
                            : `${request.buyerProfile.firstName} ${request.buyerProfile.lastName}`
                        }
                      />
                      <AvatarFallback>
                        {getShortName(
                          request.buyerProfile.middleName
                            ? `${request.buyerProfile.firstName} ${request.buyerProfile.middleName} ${request.buyerProfile.lastName}`
                            : `${request.buyerProfile.firstName} ${request.buyerProfile.lastName}`
                        )}
                      </AvatarFallback>
                    </Avatar>
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {request.buyerProfile.middleName
                          ? `${request.buyerProfile.firstName} ${request.buyerProfile.middleName} ${request.buyerProfile.lastName}`
                          : `${request.buyerProfile.firstName} ${request.buyerProfile.lastName}`}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        {request.buyerProfile.email}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex h-12 items-center">
                    <Avatar className="size-9">
                      <AvatarImage
                        src={request.sellerProfile.profileUrl}
                        alt={
                          request.sellerProfile.middleName
                            ? `${request.sellerProfile.firstName} ${request.sellerProfile.middleName} ${request.sellerProfile.lastName}`
                            : `${request.sellerProfile.firstName} ${request.sellerProfile.lastName}`
                        }
                      />
                      <AvatarFallback>
                        {getShortName(
                          request.sellerProfile.middleName
                            ? `${request.sellerProfile.firstName} ${request.sellerProfile.middleName} ${request.sellerProfile.lastName}`
                            : `${request.sellerProfile.firstName} ${request.sellerProfile.lastName}`
                        )}
                      </AvatarFallback>
                    </Avatar>
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {request.sellerProfile.middleName
                          ? `${request.sellerProfile.firstName} ${request.sellerProfile.middleName} ${request.sellerProfile.lastName}`
                          : `${request.sellerProfile.firstName} ${request.sellerProfile.lastName}`}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        {request.sellerProfile.email}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right">${request.price}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  )
}
export default RecentSales
