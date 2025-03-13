import { Copy } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import {
    Search,
} from "lucide-react"

import {
    Table,
    TableHeader,
    TableBody,
    TableFooter,
    TableHead,
    TableRow,
    TableCell,
    TableCaption,
} from "@/components/ui/table"

const invoices = [
    {
        assets: "Virtus by hp",
        serialno: "KN2323323",
        productno: "9TMWNDKW",
        productline: "M7",
    },
    {
        assets: "Virtus by hp",
        serialno: "KN2323323",
        productno: "9TMWNDKW",
        productline: "M7",
    },
    {
        assets: "Virtus by hp ",
        serialno: "KN2323323",
        productno: "9TMWNDKW",
        productline: "M7",
    },
    
]

export function DialogCloseButton() {
  return (
    <Dialog >
      <DialogTrigger asChild>
        <Button variant="outline">Assets</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl gap-y-10 shadow-white">
        <DialogHeader>
          <DialogTitle className="mb-5">Assets</DialogTitle>
          <DialogDescription className="text-black  gap-1">
            <span className="flex items-center w-[20em]  gap-2 relative">Search Assets
            <Search className="absolute right-1"/><Input className=" flex-1 ring-2 border-0 rounded-2xl pr-10"/></span>
          </DialogDescription>
        </DialogHeader>
        
        <Table className="table-fixed border-spacing-0 mx-auto">
            <TableHeader>
                <TableRow className="text-xl bg-blue-200">
                    <TableHead>Assets</TableHead>
                    <TableHead>Serial Number</TableHead>
                    <TableHead>Product No</TableHead>
                    <TableHead>Product Line</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {invoices.map((invoice) => (
            <TableRow key={invoice.invoice}>
                <TableCell className="whitespace-break-spaces ">{invoice.assets}</TableCell>
                <TableCell>{invoice.serialno}</TableCell>
                <TableCell>{invoice.productno}</TableCell>
                <TableCell >{invoice.productline}</TableCell>
            </TableRow>
                 ))} 
            </TableBody>
        </Table>
        <DialogFooter className="sm:justify-end">
            <Button type="button" variant="secondary">
              Select
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
