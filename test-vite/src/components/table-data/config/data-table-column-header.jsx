"use client"

import * as React from "react"
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"


export function DataTableColumnHeader({
  column,
  title,
  className,
}) {
  const sorted = column.getIsSorted() // false | "asc" | "desc"

  return (
    <Button
      type="button"
      variant="ghost"
      className={className}
      onClick={() => column.toggleSorting(sorted === "asc")}
    >
      {title}
      {sorted === "asc" ? (
        <ArrowUp className="ml-2 h-4 w-4" />
      ) : sorted === "desc" ? (
        <ArrowDown className="ml-2 h-4 w-4" />
      ) : (
        <ArrowUpDown className="ml-2 h-4 w-4 opacity-60" />
      )}
    </Button>
  )
}

