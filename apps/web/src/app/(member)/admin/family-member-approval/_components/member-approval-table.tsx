"use client"

import * as React from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  GlobalFilterTableState,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"
import { pendingMemberActions } from "@web/src/actions/admin"
import { Button } from "@web/src/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@web/src/components/ui/dropdown-menu"
import { Input } from "@web/src/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@web/src/components/ui/table"
import { PendingMembersSchema } from "api-contract/types"
import { Settings2, UserRoundCog } from "lucide-react"
import { toast } from "sonner"
import { z } from "zod"

interface DataTableProps {
  columns: ColumnDef<z.infer<typeof PendingMembersSchema.element>>[]
  data: z.infer<typeof PendingMembersSchema>
}

export const MemberApprovalTable = ({ columns, data }: DataTableProps) => {
  const [tableData, setTableData] = React.useState(data)
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [globalFilter, setGlobalFilter] =
    React.useState<GlobalFilterTableState>()
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const table = useReactTable({
    data: tableData,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    enableGlobalFilter: true,
    globalFilterFn: "auto",
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
  })

  const pendingActions = async (action: "accept" | "reject") => {
    const result = await pendingMemberActions({
      action: action,
      ids: table
        .getFilteredSelectedRowModel()
        // @ts-ignore
        .rows.map((row) => row.original.familyMemberInfo.id) as string[],
    })

    if (result.status === 200) {
      return result.body.message
    } else {
      throw new Error(result.body.message)
    }
  }

  const deleteSelectedRow = () => {
    const selectedIds = table
      .getFilteredSelectedRowModel()
      .rows.map((row) => row.original.familyMemberInfo.id) as string[]
    const newTableData = tableData.filter(
      (item) => !selectedIds.includes(item.familyMemberInfo.id)
    )
    setRowSelection({})
    setTableData(newTableData)
  }

  const verifyUser = (action: "accept" | "reject") => {
    toast.promise(pendingActions(action), {
      loading: "Loading...",
      success: (msg) => {
        deleteSelectedRow()
        return msg
      },
      error: (msg) => msg,
    })
  }

  return (
    <div>
      <div className="flex items-center py-4">
        <Input
          label="Search"
          value={globalFilter?.globalFilter}
          onChange={(event) => table.setGlobalFilter(event.target.value)}
          className="max-w-sm"
        />
        {table.getFilteredSelectedRowModel().rows.length > 0 && (
          <div className="mx-4 flex gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  <UserRoundCog className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => verifyUser("accept")}>
                  Validate {table.getFilteredSelectedRowModel().rows.length}{" "}
                  user
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => verifyUser("reject")}>
                  Invalidate {table.getFilteredSelectedRowModel().rows.length}{" "}
                  user
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              <Settings2 className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className={header.id === "select" ? "" : "px-0"}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No Pending Verification
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
