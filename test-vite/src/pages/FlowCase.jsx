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
              <div className="space-y-2">
                {renderer ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <Card key={i} className="p-4 shadow-sm">
                      <Skeleton className="h-6 w-32" />
                    </Card>
                  ))
                ) : (
                  filteredCases.map((c) => (
                    <Card
                      key={c.CaseID}
                      className="flex-row justify-between items-center p-4 shadow-sm hover:shadow-md transition cursor-pointer border-l-4"
                      onClick={() => navigate(`/app/case/${c.CaseID}`)}
                    >
                      <div>
                        <p className="font-semibold">#{c.CaseID} - {c.ProductName}</p>
                        <p className="text-sm text-gray-500">{c.SerialNumber} | {c.Primary} | {c.CustomerAccount || "No Company"}</p>
                      </div>
                      {c.CreatedOn}
                      <div className="flex items-center gap-2">
                        <Badge className="bg-green-600">{c.CaseStatus}</Badge>
                        <Badge>{c.caseinformation.CaseType}</Badge>
                        {c?.caseinformation.Owner === user.id ? (
                          <Badge className="bg-purple-500">Owner</Badge>
                        ) : (
                          <Badge className="bg-sky-500">CreatedBy</Badge>
                        )}
                      </div>
                    </Card>
                  ))
                )}
                {error ? <h1 className="text-center text-destructive">Something went wrong</h1> : ""}
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


