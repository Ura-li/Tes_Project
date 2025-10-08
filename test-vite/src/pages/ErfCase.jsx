import ApiCustomer from '@/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { File } from 'lucide-react'
import React, { useEffect, useState, useMemo } from 'react'
import { toast } from 'sonner'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import { useNavigate } from 'react-router'

export const ErfCase = () => {
  const [caseData, setCaseData] = useState([])
  const [selectedFiles, setSelectedFiles] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const PAGE_SIZE = 6 // jumlah row per halaman

  const navigate = useNavigate()

  const fetchData = async () => {
    try {
      const response = await ApiCustomer.get('/api/case-information')
      const data = response.data.data.filter(c => c.CaseStatus == 'Close')
      setCaseData(data)
      toast.success("GOOD WEEL", { position: 'top-right' })
      return data
    } catch (err) {
      console.log("THIS THING GIVE ME ERROR", err)
    }
  }

  useEffect(() => {
    fetchData();
  }, [])

  async function uploadFiles(files) {
    toast.loading("WAIT FOR THE UPLOAD")
    const formData = new FormData()
    for (let file of files) {
      formData.append("files", file)
    }

    const res = await ApiCustomer.post('/api/case-information/erf', formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    console.log(res.data)
  }

  // Pagination logic
  const totalPages = Math.ceil(caseData.length / PAGE_SIZE)
  const currentPageData = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return caseData.slice(start, start + PAGE_SIZE)
  }, [caseData, currentPage])

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  return (
    <div className='bg-slate-200 p-5'>
      <Tabs defaultValue="Main">
        <TabsList>
          <TabsTrigger value="Main">Main</TabsTrigger>
          <TabsTrigger value="Pending">Pending</TabsTrigger>
        </TabsList>
        <TabsContent value="Main">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Upload Multiple ERF Files</h2>
            </CardHeader>
            <CardContent>
              <p className="mb-2 text-sm text-gray-600">
                You can upload multiple ERF files. Maximum file size per file: 10MB.
              </p>
              <Input type="file" multiple onChange={(e) => setSelectedFiles(e.target.files)} />
              <button
                onClick={() => uploadFiles(selectedFiles)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Submit
              </button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="Pending">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Closed Cases</h2>
            </CardHeader>
            <CardContent>
              <table className="min-w-full border border-gray-300 rounded">
                <thead>
                  <tr className="text-sm text-gray-700 uppercase bg-gray-200">
                    <th className="p-2 border cursor-pointer">Case ID</th>
                    <th className="p-2 border cursor-pointer">Created On</th>
                    <th className="p-2 border cursor-pointer">Case Subject</th>
                    <th className="p-2 border cursor-pointer">ErfDoc</th>
                    <th className="p-2 border cursor-pointer">Company</th>
                    <th className="p-2 border cursor-pointer">Primary</th>
                    <th className="p-2 border cursor-pointer">Serial Number</th>
                    <th className="p-2 border cursor-pointer">Product Number</th>
                    <th className="p-2 border cursor-pointer">Product Name</th>
                    <th className="p-2 border cursor-pointer">Case Status</th>
                  </tr>
                </thead>
                <tbody>
                  {currentPageData.length === 0 ? (
                    <tr>
                      <td colSpan={13} className="text-center py-4">No closed cases found.</td>
                    </tr>
                  ) : (
                    currentPageData.map((c) => (
                      <tr key={c.CaseID} className="text-center hover:bg-gray-100">
                        <td
                          className="p-2 text-blue-500 border cursor-pointer hover:underline"
                          onClick={() => navigate(`/app/case/${c.CaseID}`)}
                        >
                          {c.CaseID}
                        </td>
                        <td className="p-2 border">{c.CreatedOn}</td>
                        <td className="p-2 border">{c.CaseSubject}</td>
                        <td className="p-2 border">
                          {c.caseinformation?.ErfDoc && (
                            <Button onClick={() => window.open(`${import.meta.env.VITE_API_BASE_URL}${c.caseinformation.ErfDoc}`)}>
                              <File />
                            </Button>
                          )}
                        </td>
                        <td className="p-2 border">{c.CustomerAccount}</td>
                        <td className="p-2 border">{c.Primary}</td>
                        <td className="p-2 border">{c.SerialNumber}</td>
                        <td className="p-2 border">{c.ProductNumber}</td>
                        <td className="p-2 border">{c.ProductName}</td>
                        <td
                          className={cn(
                            "bg-emerald-300",
                            c.CaseStatus === "Close"
                              ? "bg-red-300"
                              : c.CaseStatus === "InActive"
                                ? "bg-sky-300"
                                : ""
                          )}
                        >
                          {c.CaseStatus}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {/* Pagination UI */}
              {totalPages > 1 && (
                <Pagination className="flex justify-start mt-4">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          handlePageChange(currentPage - 1)
                        }}
                      />
                    </PaginationItem>

                    {Array.from({ length: totalPages }, (_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink
                          href="#"
                          isActive={currentPage === i + 1}
                          onClick={(e) => {
                            e.preventDefault()
                            handlePageChange(i + 1)
                          }}
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          handlePageChange(currentPage + 1)
                        }}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}