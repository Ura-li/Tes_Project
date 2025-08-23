import ApiCustomer from '@/api'
import { SearchBar } from '@/components/sidebar/search-sidebar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Sidebar, SidebarContent, SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Skeleton } from '@/components/ui/skeleton'
import { se } from 'date-fns/locale'
import { set } from 'lodash'
import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2'



export const FlowCase = () => {
  const [caseData, setCaseData] = useState([]);
  const [loading, setLoading] = useState(false)

  const fetchData = async () => {
    setLoading(true);
    try {
  
      const response = await ApiCustomer.get('/api/case-information')
      const filtercases = response.data.data.filter(c => c.CaseStatus !== 'Close')
      setCaseData(filtercases)
      return response.data.data;
    }catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Gagal memuat data. Silakan coba lagi.',
      })
      console.error('Error fetching case data:', error)
      throw error
    } finally {
      setLoading(false);  
    }}

  useEffect(() => {
    fetchData();
  }, []);

  const cards = Array.from({ length: 9 }).map((_, i) => ({
    id: i + 1,
    title: `Card ${i + 1}`,
    description: "Small description for this card.",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero.",
  }))

  console.log(caseData)

  
  return (
    <SidebarProvider defaultOpen>

      <SidebarInset>
        <div className="min-h-screen flex flex-col w-full ">
          <div className="sticky top-13  border-t-4 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 ">
            <div className="mx-auto flex h-14 w-full max-w-7xl items-center gap-3 px-4 justify-between">
              <div className=" flex items-center gap-2">
                <Button size="sm" variant="outline">Active Case</Button>
                <Button size="sm">Ready To Finish</Button>
              </div>
              <h1 className="text-xl font-semibold tracking-tight">Case For You</h1>
              <SidebarTrigger />
            </div>
          </div>
          <section className="mx-auto w-full max-w-7xl p-4 md:p-6">
            <div className="grid grid-cols-1 gap-4 ">
              
              {loading ? (
                // Show skeletons while waiting
                Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i} className="shadow-sm">
                    <CardHeader>
                      <Skeleton className="h-6 w-32" />
                    </CardHeader>
                    <CardContent className="flex gap-4">
                      <Skeleton className="h-20 w-full" />
                      <Skeleton className="h-20 w-full" />
                    </CardContent>
                  </Card>
                ))
              ) : (
                // Render real data
                caseData.map((c) => (
                  <>
                    <Card key={c.CaseID} className="shadow-sm hover:shadow-md transition border-l-5 border-gray-200">
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          #{c.CaseID}
                          <div className="gap-2 flex">
                            <Badge className={c.CaseStatus === "Open" ? "bg-green-500" : c.CaseStatus === "InActive" ? "bg-blue-400" : c.CaseStatus === "On Hold" ? "yellow" : c.CaseStatus === "Escalated" ? "red" : "gray"}>{c.CaseStatus}</Badge>
                            <Badge>{c.caseinformation.CaseType}</Badge>
                          </div>
                        </CardTitle>
                        <CardDescription className="text-md font-semibold italic">{c.CaseSubject}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex gap-4 mb-4">
                          <div className="grid grid-cols-3 rounded-xl bg-muted/50 items-center justify-center flex-1 gap-1 p-3">
                            <p className="font-medium">Serial Number</p>
                            <p className="text-md text-gray-500 col-span-2"> {c.SerialNumber}</p>
                            <p className="font-medium">Product Name</p>
                            <p className="text-md text-gray-500 col-span-2"> {c.ProductName}</p>
                            <p className="font-medium">Product Number</p>
                            <p className="text-md text-gray-500 col-span-2"> {c.ProductNumber}</p>
                            
                          </div>
                          <div className="grid grid-cols-3 rounded-xl bg-muted/50 items-center justify-center flex-1 gap-1 p-3">
                            <p className="font-medium">Customer</p>
                            <p className="text-md text-gray-500 col-span-2">
                               {c.caseinformation.contact_information.FirstName}{" "}
                              {c.caseinformation.contact_information.LastName}
                            </p>
                            <p className="font-medium">Email</p>
                            <p className="text-md text-gray-500 col-span-2">
                               {c.caseinformation.contact_information?.Email || "No Email"}
                            </p>
                            <p className="font-medium">Company</p>
                            <p className="text-md text-gray-500 col-span-2">
                                {c.CustomerAccount || "No Company"}
                            </p>
                          </div>
                        </div>
                        <div className="p-3 rounded-lg bg-muted/50">
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {c.caseinformation.ProblemDescription}
                          </p>
                        </div>
                      </CardContent>
                      <CardFooter className="justify-between">
                        <p className="text-sm text-muted-foreground">Owner: {c.Owner}</p>
                        <Button size="sm" variant="outline">Details</Button>
                      </CardFooter>
                    </Card>

                    {/* <Card className="w-96 shadow-md hover:shadow-lg transition">
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-base font-semibold">
                            #{c.CaseID} — {c.CaseSubject}
                          </CardTitle>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium 
            ${c.CasePriority === "High" ? "bg-orange-100 text-orange-700" :
                              c.CasePriority === "Critical" ? "bg-red-100 text-red-700" :
                                "bg-gray-100 text-gray-700"}`}>
                            {c.CasePriority}
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm">
                        <p className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 text-xs">
                            {c.CaseStatus}
                          </span>
                          <span className="text-muted-foreground">{c.IncomingChannel}</span>
                        </p>
                        <p><strong>Customer:</strong> {c.contact_information?.FirstName} {c.contact_information?.LastName} ({c.site_account?.Company})</p>
                        <p><strong>Asset:</strong> {c.asset_information?.SerialNumber} / {c.asset_information?.ProductNumber}</p>
                        <p className="line-clamp-2 text-muted-foreground">
                          {c.ProblemDescription}
                        </p>
                        <p className="text-xs text-muted-foreground">Owner: {c.Owner}</p>
                      </CardContent>
                    </Card>

                    <Card className="w-full max-w-2xl shadow-lg">
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-lg font-bold">
                            #{c.CaseID} — {c.CaseSubject}
                          </CardTitle>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium 
            ${c.CasePriority === "Critical" ? "bg-red-100 text-red-700" :
                              c.CasePriority === "High" ? "bg-orange-100 text-orange-700" :
                                "bg-gray-100 text-gray-700"}`}>
                            {c.CasePriority}
                          </span>
                        </div>
                        <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                          <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 text-xs">
                            {c.CaseStatus}
                          </span>
                          <span>Opened: {new Date(c.CreatedOn).toLocaleString()}</span>
                          {c.CaseClosedDate && (
                            <span>Closed: {new Date(c.CaseClosedDate).toLocaleString()}</span>
                          )}
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        <section>
                          <h3 className="font-semibold">Problem</h3>
                          <p className="text-sm">{c.ProblemDescription}</p>
                        </section>

                        {c.CaseResolution && (
                          <section>
                            <h3 className="font-semibold">Resolution</h3>
                            <p className="text-sm">{c.CaseResolution}</p>
                          </section>
                        )}

                        <section>
                          <h3 className="font-semibold">Customer</h3>
                          <p className="text-sm">
                            {c.contact_information?.FirstName} {c.contact_information?.LastName}
                            ({c.contact_information?.Email})
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {c.site_account?.Company}, {c.site_account?.Country}
                          </p>
                        </section>

                        <section>
                          <h3 className="font-semibold">Asset</h3>
                          <p className="text-sm">
                            Serial: {c.asset_information?.SerialNumber}
                            Product: {c.asset_information?.ProductNumber}
                          </p>
                        </section>

                        {c.casenotes_casenotes_CaseIDTocaseinformation?.length > 0 && (
                          <section>
                            <h3 className="font-semibold">Recent Notes</h3>
                            <ul className="list-disc list-inside text-sm">
                              {c.casenotes_casenotes_CaseIDTocaseinformation
                                .slice(0, 2)
                                .map((note, i) => (
                                  <li key={i}>{note.content}</li>
                                ))}
                            </ul>
                          </section>
                        )}
                      </CardContent>
                    </Card> */}
                  </>
                ))
              )}
            </div>
          </section>
        </div>
      </SidebarInset>
        <SearchBar />

    </SidebarProvider>
  )
}

export function LargeCaseCard({ caseInfo }) {
  return (
    <Card className="w-full max-w-2xl shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-bold">
            #{c.CaseID} — {c.CaseSubject}
          </CardTitle>
          <span className={`px-3 py-1 rounded-full text-sm font-medium 
            ${c.CasePriority === "Critical" ? "bg-red-100 text-red-700" :
              c.CasePriority === "High" ? "bg-orange-100 text-orange-700" :
                "bg-gray-100 text-gray-700"}`}>
            {c.CasePriority}
          </span>
        </div>
        <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
          <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 text-xs">
            {c.CaseStatus}
          </span>
          <span>Opened: {new Date(c.CreatedOn).toLocaleString()}</span>
          {c.CaseClosedDate && (
            <span>Closed: {new Date(c.CaseClosedDate).toLocaleString()}</span>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <section>
          <h3 className="font-semibold">Problem</h3>
          <p className="text-sm">{c.ProblemDescription}</p>
        </section>

        {c.CaseResolution && (
          <section>
            <h3 className="font-semibold">Resolution</h3>
            <p className="text-sm">{c.CaseResolution}</p>
          </section>
        )}

        <section>
          <h3 className="font-semibold">Customer</h3>
          <p className="text-sm">
            {c.contact_information?.FirstName} {c.contact_information?.LastName}
            ({c.contact_information?.Email})
          </p>
          <p className="text-sm text-muted-foreground">
            {c.site_account?.Company}, {c.site_account?.Country}
          </p>
        </section>

        <section>
          <h3 className="font-semibold">Asset</h3>
          <p className="text-sm">
            Serial: {c.asset_information?.SerialNumber}
            Product: {c.asset_information?.ProductNumber}
          </p>
        </section>

        {c.casenotes_casenotes_CaseIDTocaseinformation?.length > 0 && (
          <section>
            <h3 className="font-semibold">Recent Notes</h3>
            <ul className="list-disc list-inside text-sm">
              {c.casenotes_casenotes_CaseIDTocaseinformation
                .slice(0, 2)
                .map((note, i) => (
                  <li key={i}>{note.content}</li>
                ))}
            </ul>
          </section>
        )}
      </CardContent>
    </Card>
  )
}
