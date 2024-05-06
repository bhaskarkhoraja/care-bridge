import { Metadata } from "next"
import { getAllPendingMembers } from "@web/src/actions/admin"

import { memberApprovalColumn } from "./_components/member-approval-column"
import { MemberApprovalTable } from "./_components/member-approval-table"

export const metadata: Metadata = {
  title: "Verify Members",
  description: "List and verify pending users",
}

export default async function MemberApprovalPage() {
  const pendingMembers = await getAllPendingMembers()

  return (
    <main className="w-full">
      <h1 className="mb-4 text-2xl font-bold leading-none">
        Pending Member Verification
      </h1>
      {pendingMembers.status !== 200 ? (
        <p className="text-muted-foreground text-sm">
          {pendingMembers.body.message ?? "No pending users found"}
        </p>
      ) : (
        <MemberApprovalTable
          columns={memberApprovalColumn}
          data={pendingMembers.body.data}
        />
      )}
    </main>
  )
}
