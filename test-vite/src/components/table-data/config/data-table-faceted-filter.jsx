"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

function uniqSorted(values) {
  return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b))
}


export function DataTableFacetedFilter({
  column,
  title,
  getLabel,
  disabled,
}) {
  const current = (column.getFilterValue() ) ?? ""

  // TanStack can compute unique values for you:
  const faceted = column.getFacetedUniqueValues()
  const options = React.useMemo(() => {
    const raw = Array.from(faceted.keys()).map((v) => {
      const label = getLabel ? getLabel(v) : String(v ?? "")
      return label
    })
    return uniqSorted(raw.filter(Boolean))
  }, [faceted, getLabel])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={disabled}>
          {current ? `${title}: ${current}` : title}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="max-h-[280px] overflow-auto">
        <DropdownMenuLabel>{title}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => column.setFilterValue(undefined)}
          className={!current ? "font-semibold" : ""}
        >
          All
        </DropdownMenuItem>
        {options.map((opt) => (
          <DropdownMenuItem
            key={opt}
            onClick={() => column.setFilterValue(opt)}
            className={current === opt ? "font-semibold" : ""}
          >
            {opt}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

