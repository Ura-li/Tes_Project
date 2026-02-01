"use client"

import * as React from "react"
import Swal from "sweetalert2"
import { toast } from "sonner"
import ApiCustomer from "@/api"
import { DataTableToolbar } from "./config/data-table-toolbar"
import { DataTableColumnHeader } from "./config/data-table-column-header"
import { DataTablePagination } from "./config/data-table-pagination"
import { DataTableFacetedFilter } from "./config/data-table-faceted-filter"
import { DataTable } from "./config/data-table"
import { Button } from "../ui/button"
import { ResourceAccountDelete, ResourceAccountEdit } from "../model/sc-modal"


function ResourceAccountColums(opts) {
    return [
        {
            id: "no",
            header: () => <div className="text-center">No</div>,
            cell: ({ row, table }) => {
                const pageIndex = table.getState().pagination.pageIndex
                const pageSize  = table.getState().pagination.pageSize
                return (
                    <div className="text-center">
                        {pageIndex * pageSize + row.index + 1}
                    </div>
                )
            },
        }, 
        {
            accessorKey: "ResourceAccountId",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title={"Resource Account ID"}/>
            ),
        },
        {
            accessorKey: "Name",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title={"Name"}/>
            ),
        },
        {
            accessorKey: "ResourceId",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title={"Resource Id"}/>
            ),
        },
        {
            id: "actions",
            header: () => <div className="text-center">Actions</div>,
            cell: ({ row }) => {
                const id = row.original.ResourceAccountId
            return (
                <div className="flex justify-center gap-2">
                    {opts.onEdit(id)}
                    {opts.onDelete(id)}
                </div>
            )
            },
        },
    ]
}

export function ResourceAccountTable() {
    const [data, setData] = React.useState([])
    const [resource, setResource] = React.useState([])
    const [loading, setLoading] = React.useState(false)
    const [error, setError] = React.useState(null)

    const fetchAll = React.useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
        const [accountRes, resourceRes] = await Promise.all([
            ApiCustomer.get("/api/resource-account"),
            ApiCustomer.get("/api/resources"),
        ])
        setData(accountRes.data.data)
        setResource(resourceRes.data.data)
        } catch (error) {
            toast.error("Failed to fetch Resource Account and Resource data")
            setError("Failed to fetch data")
        } finally {
            setLoading(false)
        }
    }, [])

    React.useEffect(() => {
        fetchAll()
    }, [fetchAll])

    const columns = React.useMemo(
        () => 
            ResourceAccountColums({
                onEdit: (id) => <ResourceAccountEdit ResourceAccountId={id} resources={resource} onUpdate={fetchAll}/>,
                onDelete: (id) => <ResourceAccountDelete ResourceAccountId={id}/>
            }),
        [fetchAll]
    )
    return (
        <div className="p-4 grid grid-cols-1 w-full rounded-2xl">
            <DataTable
                title={<h2 className="text-xl sm:text-2xl font-bold">📊 Resource Account Management</h2>}
                data={data}
                columns={columns}
                loading={loading}
                error={error}
                toolbar={(table) => (
                    <DataTableToolbar table={table} searchPlaceholder="🔍 Search resource account...">
                       <DataTableFacetedFilter
                        title={"All Resource"}
                        column={table.getColumn("ResourceId")}
                       />
                    </DataTableToolbar>
                )}
            />
        </div>
    )
}