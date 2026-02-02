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
import { AssetEdit, AssetDelete } from "../model/sc-modal"
import { formatDate } from "@/lib/utils"

function assetColums(opts) {
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
            accessorKey: "SerialNumber",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title={"Serial Number"}/>
            ),
        },
        {
            accessorKey: "product_information.ProductName",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title={"Product Name"}/>
            ),
        },
        {
            accessorKey: "ProductNumber",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title={"Product Number"}/>
            ),
        },
        {
            accessorKey: "product_information.ProductLine",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title={"Product Line"}/>
            ),
        },
        {
            accessorKey: "site_account.Company",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title={"Site Account"}/>
            ),
        },
        {
            id: "Contact",
            accessorKey: "contact_information.FirstName",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title={"Contact"}/>
            ),
            cell: ({ row }) => {
                const item = row.original
                return (
                    <span>{item.contact_information?.FirstName} {item.contact_information?.LastName}</span>
                )
            }
        },
        {
            accessorKey: "Warranty_Status",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title={"Warranty Status"}/>
            ),
        },
        {
            accessorKey: "EOW_Date",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title={"EOW Date"}/>
            ),
            cell: ({ getValue }) => formatDate(getValue())
        },
        {
            id: "actions",
            header: () => <div className="text-center">Actions</div>,
            cell: ({ row }) => {
                const id = row.original.AssetID
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

export function AssetTable() {
    const [data, setData] = React.useState([])
    const [loading, setLoading] = React.useState(false)
    const [error, setError] = React.useState(null)

    const fetchAsset = React.useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
      const LIMIT = 1000;
      const first = await ApiCustomer.get(`/api/asset-information?page=1&limit=${LIMIT}`);
      const firstData = first?.data?.data || [];
      const totalPages = first?.data?.totalPages ?? 1;

      let all = [...firstData];
      for (let p = 2; p <= totalPages; p++) {
        const res = await ApiCustomer.get(`/api/asset-information?page=${p}&limit=${LIMIT}`);
        all = all.concat(res?.data?.data || []);
      }
      if (totalPages === 1 && Array.isArray(first?.data) && !first?.data?.data) {
        all = first.data;
      }
      setData(all)
        } catch (error) {
            toast.error("Failed to fetch Asset data")
            setError("Failed to fetch data")
        } finally {
            setLoading(false)
        }
    }, [])

    React.useEffect(() => {
        fetchAsset()
    }, [fetchAsset])

    const columns = React.useMemo(
        () => 
            assetColums({
                onEdit: (id) => <AssetEdit assetId={id} onUpdate={fetchAsset}/>,
                onDelete: (id) => <AssetDelete assetId={id}/>
            }),
        [fetchAsset]
    )
    return (
        <div className="p-4 grid grid-cols-1 w-full rounded-2xl">
            <DataTable
                title={<h2 className="text-xl sm:text-2xl font-bold">📦 Asset Information</h2>}
                data={data}
                columns={columns}
                loading={loading}
                error={error}
                toolbar={(table) => (
                    <DataTableToolbar table={table} searchPlaceholder="🔍 Search asset...">
                        <DataTableFacetedFilter
                            title="All Serial Number"
                            column={table.getColumn("SerialNumber")}
                        />
                        <DataTableFacetedFilter
                            title="All Product Number"
                            column={table.getColumn("ProductNumber")}
                        />
                        <DataTableFacetedFilter
                            title="All Contact"
                            column={table.getColumn("Contact")}
                        />
                    </DataTableToolbar>
                )}
            />
        </div>
    )
}