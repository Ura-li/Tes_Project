import ApiCustomer from '@/api'
import { SearchBar } from '@/components/sidebar/search-sidebar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Sidebar, SidebarContent, SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '@/context/auth-context'
import { se } from 'date-fns/locale'
import { filter, set } from 'lodash'
import { PanelRight } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import Swal from 'sweetalert2'



export const FlowCase = () => {
  const { user, loading } = useAuth();

  if (loading || !user) {
    return null; // don’t render listener until auth is ready
  }

  const [caseData, setCaseData] = useState([]);
  console.log(caseData)
  const [renderer, setRenderer] = useState(false)
  const [error, setError] = useState(false)
  const [filters, setFilters] = useState({
    SerialNumber: "",
    Company: "",
    Email: "",
    Phone: "",
    Id: "",
    Status: "",  
    Type: "",
    Role: "",     
  });

  const fetchData = async () => {
    setRenderer(true);
    try {
      const response = await ApiCustomer.get('/api/case-information');
      // console.log("Case INFO LOG : ",response.data.data[23].caseinformation.CreatedBy);
      // console.log("Case INFO LOG : ",user.id);
      const filtercases = response.data.data.filter(c => c.CaseStatus !== 'Close' && (c?.caseinformation?.Owner === user.id || c?.caseinformation?.CreatedBy === user.id));
      console.log(filtercases.length);

      // console.log("Filter Case : ",filtercases)
      // console.log("Case Owner : ", filtercases[1]?.caseinformation?.Owner)
      // console.log("Case Created By : ", filtercases[1]?.caseinformation?.CreatedBy)
      // console.log("User ID : ", user.id)
      setCaseData(filtercases);
      setError(false)
      return response.data.data;
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Gagal memuat data. Silakan coba lagi.',
      });
      console.error('Error fetching case data:', error);
      setError(true);
      throw error;
    } finally {
      setRenderer(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // filter logic
  const filteredCases = caseData
  .filter(c => {
    const isCreatedBy = c?.caseinformation?.CreatedBy == user.id;
    const isOwner = c?.Owner == user.id;
    return (
      (filters.SerialNumber === "" || c.SerialNumber?.toLowerCase().includes(filters.SerialNumber.toLowerCase())) &&
      (filters.Company === "" || c.CustomerAccount?.toLowerCase().includes(filters.Company.toLowerCase())) &&
      (filters.Email === "" || c.caseinformation?.contact_information?.Email?.toLowerCase().includes(filters.Email.toLowerCase())) &&
      (filters.Phone === "" || c.caseinformation?.contact_information?.Phone?.toLowerCase().includes(filters.Phone.toLowerCase())) &&
      (filters.Id === "" || c.CaseID.toString().includes(filters.Id)) &&
      (filters.Status === "" || c.CaseStatus === filters.Status) &&
      (filters.Type === "" || c.caseinformation?.CaseType === filters.Type) &&
      (filters.Role === "" || (filters.Role === "CreatedBy" && isCreatedBy) || (filters.Role === "Owner" && isOwner) )
    );
  })
  .sort((a, b) => {
    const aIsOwner = a.Owner == user.username;
    const bIsOwner = b.Owner == user.username;
    if (aIsOwner && !bIsOwner) return -1;
    if (!aIsOwner && bIsOwner) return 1;
    return 0;
  });
  ;
  const finishedCases = caseData.filter(c => c.CaseStatus === "FinishRepair");

  
  // console.log(caseData)

  const navigate = useNavigate();
  return (
    <SidebarProvider defaultOpen>

      <SidebarInset>
        <div className="min-h-screen flex flex-col w-full ">
          <Tabs defaultValue="active">
          <div className="sticky top-13  border-t-4 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 ">
            <div className="mx-auto flex h-14 w-full max-w-7xl items-center gap-3 px-4 justify-between">
              <TabsList className=" flex items-center gap-2">  
                <TabsTrigger value="active" size="sm" >Active Case</TabsTrigger>
                <TabsTrigger value="finish" size="sm">Ready To Finish</TabsTrigger>
              </TabsList>
              <h1 className="lg:text-xl md:text-md font-semibold tracking-tight">Case For You</h1>
              <SidebarTrigger icon={PanelRight} />
            </div>
          </div>
          <TabsContent value="active" className="mx-auto w-full max-w-7xl p-4 md:p-6">
            <div className="grid grid-cols-2 gap-4 ">
              
              {renderer ? (
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
              ) : user?.role === 'lg' ? (
                 filteredCases.map((c) => (
                  <>
                    <Card key={c.CaseID} className="shadow-sm hover:shadow-md transition border-l-5 border-gray-200">
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <p className='text-lg '>#{c.caseinformation?.workorder?.[0]?.WOID}</p>
                          <p>{c.CreatedOn}</p>
                          <div className="gap-2 flex flex-col lg:flex-row">
                            <Badge className={c.CaseStatus === "Open" ? "bg-green-500" : c.CaseStatus === "InActive" ? "bg-blue-400" : c.CaseStatus === "On Hold" ? "yellow" : c.CaseStatus === "Escalated" ? "red" : "gray"}>{c.CaseStatus}</Badge>
                            <Badge>{c.caseinformation.CaseType}</Badge>
                            {console.log("Case Info : ",c?.caseinformation.CreatedBy)}
                            {console.log("User : :",user.id)}
                            {c?.caseinformation.Owner === user.id ? (
                              <Badge className="bg-purple-500">Owner</Badge>
                            ) : (
                              <Badge className="bg-sky-500">CreatedBy</Badge>
                            )}

                          </div>
                        </CardTitle>
                        <CardDescription className="text-md font-semibold italic">{c.CaseSubject}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-col lg:flex-row gap-4 mb-4">
                          <div className="grid grid-cols-3  rounded-xl bg-muted/50 items-center justify-center flex-1 gap-1 p-3">
                            <p className="font-medium">Serial Number</p>
                            <p className="text-md text-gray-500 col-span-2"> {c.SerialNumber}</p>
                            <p className="font-medium">Product Name</p>
                            <p className="text-md text-gray-500 col-span-2"> {c.ProductName}</p>
                            <p className="font-medium">Product Number</p>
                            <p className="text-md text-gray-500 col-span-2"> {c.ProductNumber}</p>
                            
                          </div>
                          <div className="grid grid-cols-3 rounded-xl bg-muted/50 items-center justify-center flex-1 gap-1 p-3">
                            <p className="font-medium">Material Order </p>
                            <p className="text-md text-gray-500 col-span-2">
                               {c.caseinformation?.workorder?.[0]?.materialorder?.[0]?.MOID}
                            </p>
                            <p className="font-medium">Part Description</p>
                            <p className="text-md text-gray-500 col-span-2">
                               {c.caseinformation?.workorder?.[0]?.materialorder?.[0]?.materialorderlineitems?.[0]?.Description || "Uknown"}
                            </p>
                           
                            <p className="font-medium">Part Number</p>
                            <p className="text-md text-gray-500 col-span-2">
                                {c.caseinformation?.workorder?.[0]?.materialorder?.[0]?.materialorderlineitems?.[0]?.PartNumber || "Uknown"}
                            </p>
                          </div>
                        </div>
                        <div className="p-3 rounded-lg bg-muted/50">
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {c.caseinformation.ProblemDescription}
                          </p>
                        </div>
                        <div className="bg-slate-100 p-2 m-2 grid grid-flow-col">
                          <p className='flex flex-col items-center'>Created BY <span>({c.caseinformation?.createdByUser?.Username}) - ({c.CreatedName})</span></p>
                          
                          <p className='flex flex-col items-center'>Repaired BY <span>({c.caseinformation?.workorder?.[0]?.owner?.Username}) - ({c.caseinformation?.workorder?.[0]?.owner?.Name})</span></p>
                        </div>
                      </CardContent>
                      <CardFooter className="justify-between">
                        <p className="text-sm text-muted-foreground">Case Holder {c.caseinformation?.ownerUser?.Username} - {c.Owner}</p>
                        <p className="text-sm text-muted-foreground">Status Right Now {c.CaseStatus}</p>
                        <Button size="sm" variant="outline" onClick={() => navigate(`/app/work/${c.caseinformation?.workorder?.[0]?.WOID}`)}>Details</Button>
                      </CardFooter>
                    </Card>

                  </>
                ))                
              ) : (
                // Render real data
                filteredCases.map((c) => (
                  <>
                    <Card key={c.CaseID} className="shadow-sm hover:shadow-xl transition border-l-5 border-gray-500 cursor-pointer" onClick={() => navigate(`/app/case/${c.CaseID}`)}>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <p className='text-lg '>#{c.CaseID}</p>
                          
                          <div className="gap-2 flex flex-col lg:flex-row">
                            <Badge className="bg-green-600">{c.CaseStatus}</Badge>
                            <Badge>{c.caseinformation.CaseType}</Badge>
                            {c?.caseinformation.Owner === user.id ? (
                              <Badge className="bg-purple-500">Owner</Badge>
                            ) : (
                              <Badge className="bg-sky-500">CreatedBy</Badge>
                            )}
                          </div>
                        </CardTitle>
                        <CardDescription className="text-md font-semibold italic"> Created ON {c.CreatedOn}</CardDescription>
                        <CardDescription className="text-md font-semibold italic"> Updated ON </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2">
                         
                           
                            <p className="text-md text-gray-500 col-span-2"> {c.SerialNumber}</p>
                           
                            <p className="text-md text-gray-500 col-span-2"> {c.ProductName}</p>
                           
                            <p className="text-md text-gray-500 col-span-2"> {c.ProductNumber}</p>

                         
                         
                            
                            <p className="text-md text-gray-500 col-span-2">
                              {c.caseinformation.contact_information.FirstName}{" "}
                              {c.caseinformation.contact_information.LastName}
                            </p>

                          
                            <p className="text-md text-gray-500 col-span-2">
                              {c.CustomerAccount || "No Company"}
                            </p>

                         
                        </div>

                      </CardContent>
                      <CardFooter className="justify-between">
                        <p className="text-sm text-muted-foreground">Case Holder {c.caseinformation?.ownerUser?.Username} - {c.Owner}</p>
                        {/* <p className="text-sm text-muted-foreground">Status Right Now {c.CaseStatus}</p> */}
                        {/* <Button size="sm" variant="outline" >Details</Button> */}
                      </CardFooter>
                    </Card>

                  </>
                ))
              )}
              {error ? <h1 className='text-center text-destructive' > Something went wrong </h1> : ''}
              {/* {caseData.values == 0 ? <h1 className='text-center text-destructive' > You dont have any case yet </h1>  : 'TEWS'} */}
            </div>
          </TabsContent>
            <TabsContent value="finish" className="mx-auto w-full max-w-7xl p-4 md:p-6">
              <div className="grid grid-cols-1 gap-4 ">
                {renderer ? (
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
                ) : finishedCases.length > 0 ? (
                  finishedCases.map((c) => (
                    <Card key={c.CaseID} className="shadow-sm hover:shadow-md transition border-l-5 border-green-500">
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <p className='text-lg '>#{c.CaseID}</p>
                          <p>{c.CreatedOn}</p>
                          <div className="gap-2 flex flex-col lg:flex-row">
                            <Badge className="bg-green-600">{c.CaseStatus}</Badge>
                            <Badge>{c.caseinformation.CaseType}</Badge>
                            {c?.caseinformation.Owner === user.id ? (
                              <Badge className="bg-purple-500">Owner</Badge>
                            ) : (
                              <Badge className="bg-sky-500">CreatedBy</Badge>
                            )}
                          </div>
                        </CardTitle>
                        <CardDescription className="text-md font-semibold italic">{c.CaseSubject}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="p-3 rounded-lg bg-muted/50">
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {c.caseinformation.ProblemDescription}
                          </p>
                        </div>
                      </CardContent>
                      <CardFooter className="justify-between">
                        <p className="text-sm text-muted-foreground">Case Holder {c.caseinformation?.ownerUser?.Username} - {c.Owner}</p>
                        <p className="text-sm text-muted-foreground">Status Right Now {c.CaseStatus}</p>
                        <Button size="sm" variant="outline" onClick={() => navigate(`/app/case/${c.CaseID}`)}>Details</Button>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <h1 className="text-center text-gray-500">No finished cases yet.</h1>
                )}
              </div>
            </TabsContent>

          </Tabs>
        </div>

      </SidebarInset>
        <SearchBar filters={filters} setFilters={setFilters} />

    </SidebarProvider>
  )
}


