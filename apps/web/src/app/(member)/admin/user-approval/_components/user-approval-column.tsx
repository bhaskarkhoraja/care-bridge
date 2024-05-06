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
import { PendingUsersSchema } from "packages/api-contract/dist/types/index.mjs"
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

export const userApprovalColumn: ColumnDef<
  z.infer<typeof PendingUsersSchema.element>
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
  },
  {
    id: "name",
    accessorFn: (user) =>
      user.personalInfo.middleName
        ? `${user.personalInfo.firstName} ${user.personalInfo.middleName} ${user.personalInfo.lastName}`
        : `${user.personalInfo.firstName} ${user.personalInfo.lastName}`,
    header: ({ column, table }) => {
      return <HeaderCellButton title="Name" column={column} table={table} />
    },
  },
  {
    id: "email",
    accessorKey: "personalInfo.email",
    header: ({ column, table }) => {
      return <HeaderCellButton title="Email" column={column} table={table} />
    },
  },
  {
    id: "username",
    accessorKey: "personalInfo.userName",
    header: ({ column, table }) => {
      return <HeaderCellButton title="Username" column={column} table={table} />
    },
  },
  {
    id: "dob",
    accessorKey: "personalInfo.dob",
    header: ({ column, table }) => {
      return (
        <HeaderCellButton title="Date of Birth" column={column} table={table} />
      )
    },
    cell: ({ row }) => {
      return `${format(row.getValue("dob"), "PPP")}`
    },
  },
  {
    id: "gender",
    accessorFn: (user) =>
      `${user.personalInfo.gender[0].toUpperCase() + user.personalInfo.gender.slice(1)}`,
    header: ({ column, table }) => {
      return <HeaderCellButton title="Gender" column={column} table={table} />
    },
  },
  {
    id: "address",
    accessorFn: (user) =>
      `${user.addressInfo.state}, ${user.addressInfo.city}, ${user.addressInfo.street}`,
    header: ({ column, table }) => {
      return <HeaderCellButton title="Address" column={column} table={table} />
    },
  },
  {
    id: "contact",
    accessorFn: (user) =>
      `${user.addressInfo.phoneCode} ${user.addressInfo.phoneNumber}`,
    header: ({ column, table }) => {
      return <HeaderCellButton title="Contact" column={column} table={table} />
    },
    cell: ({ row }) => {
      return `+${row.getValue("contact")}`
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const userInfo = row.original

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
                navigator.clipboard.writeText(userInfo.personalInfo.id)
                toast("Copied profile id to clipboard", {
                  icon: <ClipboardList className="size-4" />,
                })
              }}
            >
              Copy profile id
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href={`/user/profile/${userInfo.personalInfo.id}`}
                className="flex gap-4"
                target="_blank"
              >
                <p>View Profile</p>
                <ExternalLink className="size-4" />
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
