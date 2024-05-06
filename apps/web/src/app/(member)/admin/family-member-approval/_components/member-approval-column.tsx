"use client"

import Link from "next/link"
import { Column, ColumnDef, Table } from "@tanstack/react-table"
import { Button } from "@web/src/components/ui/button"
import { Checkbox } from "@web/src/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@web/src/components/ui/dropdown-menu"
import { format } from "date-fns"
import {
  ArrowDownAZ,
  ArrowUpAZ,
  ArrowUpDown,
  ClipboardList,
  ExternalLink,
  MoreHorizontal,
} from "lucide-react"
import { PendingMembersSchema } from "packages/api-contract/dist/types/index.mjs"
import { toast } from "sonner"
import { z } from "zod"

interface HeaderCellButtonProps {
  title: string
  column: Column<any, unknown>
  table: Table<any>
}

const HeaderCellButton: React.FC<HeaderCellButtonProps> = ({
  title,
  column,
  table,
}) => {
  return (
    <Button
      variant="ghost"
      onClick={() => {
        if (!column.getIsSorted()) {
          table.resetSorting()
        }
        column.toggleSorting(undefined, true)
      }}
      className="w-full justify-start"
    >
      {title}
      {column.getIsSorted() === "asc" ? (
        <ArrowDownAZ className="ml-2 size-4" />
      ) : column.getIsSorted() === "desc" ? (
        <ArrowUpAZ className="ml-2 size-4" />
      ) : (
        <ArrowUpDown className="ml-2 size-4" />
      )}
    </Button>
  )
}

export const memberApprovalColumn: ColumnDef<
  z.infer<typeof PendingMembersSchema.element>
>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
    enableGlobalFilter: false,
  },
  {
    id: "name",
    accessorFn: (data) =>
      data.familyMemberInfo.middleName
        ? `${data.familyMemberInfo.firstName} ${data.familyMemberInfo.middleName} ${data.familyMemberInfo.lastName}`
        : `${data.familyMemberInfo.firstName} ${data.familyMemberInfo.lastName}`,
    header: ({ column, table }) => {
      return <HeaderCellButton title="Name" column={column} table={table} />
    },
    enableGlobalFilter: true,
  },
  {
    id: "dob",
    accessorFn: (data) => `${format(data.familyMemberInfo.dob, "PPP")}`,
    header: ({ column, table }) => {
      return (
        <HeaderCellButton title="Date of Birth" column={column} table={table} />
      )
    },
    enableGlobalFilter: true,
  },
  {
    id: "gender",
    accessorFn: (data) =>
      `${data.familyMemberInfo.gender[0].toUpperCase() + data.familyMemberInfo.gender.slice(1)}`,
    header: ({ column, table }) => {
      return <HeaderCellButton title="Gender" column={column} table={table} />
    },
    enableGlobalFilter: false,
  },
  {
    id: "nead-name",
    accessorFn: (data) =>
      data.userPersonalInfo.middleName
        ? `${data.userPersonalInfo.firstName} ${data.userPersonalInfo.middleName} ${data.userPersonalInfo.lastName}`
        : `${data.userPersonalInfo.firstName} ${data.userPersonalInfo.lastName}`,
    header: ({ column, table }) => {
      return (
        <HeaderCellButton title="Head name" column={column} table={table} />
      )
    },
    enableGlobalFilter: true,
  },
  {
    id: "head-username",
    accessorKey: "userPersonalInfo.userName",
    header: ({ column, table }) => {
      return (
        <HeaderCellButton title="Head username" column={column} table={table} />
      )
    },
    enableGlobalFilter: true,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const data = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="size-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                navigator.clipboard.writeText(data.familyMemberInfo.id)
                toast("Copied family member id to clipboard", {
                  icon: <ClipboardList className="size-4" />,
                })
              }}
            >
              Copy family member id
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href={`/user/family-member/${data.familyMemberInfo.id}`}
                className="flex gap-4"
                target="_blank"
              >
                <p>View Family member id</p>
                <ExternalLink className="size-4" />
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                navigator.clipboard.writeText(data.userPersonalInfo.id)
                toast("Copied head member id to clipboard", {
                  icon: <ClipboardList className="size-4" />,
                })
              }}
            >
              Copy head member id
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href={`/user/profile/${data.userPersonalInfo.id}`}
                className="flex gap-4"
                target="_blank"
              >
                <p>View head member profile</p>
                <ExternalLink className="size-4" />
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
    enableGlobalFilter: false,
  },
]
