import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getAllPendingUsers } from "@web/src/actions/admin"
import getCountries from "@web/src/actions/general"

import { userApprovalColumn } from "./_components/user-approval-column"
import { UserApprovalTable } from "./_components/user-approval-table"

export const metadata: Metadata = {
  title: "Verify User",
  description: "List and verify pending users",
}

export default async function UserApprovalPage() {
  const [countries, pendingUsers] = await Promise.all([
    getCountries(),
    getAllPendingUsers(),
  ])

  if (countries.status === 204) {
    notFound()
  }

  return (
    <main className="w-full">
      <h1 className="mb-4 text-2xl font-bold leading-none">
        Pending Verification
      </h1>
      {pendingUsers.status !== 200 ? (
        <p className="text-muted-foreground text-sm">
          {pendingUsers.body.message ?? "No pending users found"}
        </p>
      ) : (
        <UserApprovalTable
          columns={userApprovalColumn}
          data={pendingUsers.body.data}
        />
      )}
    </main>
  )
}
