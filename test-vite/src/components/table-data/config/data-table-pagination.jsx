"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


export function DataTablePagination({
  table,
  pageSizeOptions = [10, 25, 50, 100],
}) {
  const [goTo, setGoTo] = React.useState("")

  const pageIndex = table.getState().pagination.pageIndex
  const pageSize = table.getState().pagination.pageSize
  const pageCount = table.getPageCount()
  const total = table.getFilteredRowModel().rows.length

  const start = total === 0 ? 0 : pageIndex * pageSize + 1
  const end = Math.min((pageIndex + 1) * pageSize, total)

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2">
        <span className="text-sm">Rows per page:</span>
        <Select
          value={String(pageSize)}
          onValueChange={(v) => table.setPageSize(Number(v))}
        >
          <SelectTrigger className="h-8 w-[110px] border-1 rounded-lg shadow-lg">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {pageSizeOptions.map((n) => (
              <SelectItem key={n} value={String(n)}>
                {n}
              </SelectItem>
            ))}
            <SelectItem value={String(total || 1)}>All</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="text-sm text-muted-foreground">
        Showing <b>{start}</b> – <b>{end}</b> of <b>{total}</b>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Prev
        </Button>

        <span className="text-sm">
          Page <b>{pageIndex + 1}</b> of {pageCount}
        </span>

        <Button
          variant="secondary"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            const n = Number(goTo)
            if (!Number.isFinite(n)) return
            const target = Math.min(Math.max(n, 1), pageCount)
            table.setPageIndex(target - 1)
            setGoTo("")
          }}
          className="flex items-center gap-2"
        >
          <input
            className="h-8 w-16 rounded-md border bg-background px-2 text-sm text-center"
            type="number"
            min={1}
            max={pageCount}
            placeholder="Go"
            value={goTo}
            onChange={(e) => setGoTo(e.target.value)}
          />
          <Button size="sm" type="submit">
            Go
          </Button>
        </form>
      </div>
    </div>
  )
}

