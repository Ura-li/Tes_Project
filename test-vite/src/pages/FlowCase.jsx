import ApiCustomer from '@/api'
import { SearchBar } from '@/components/sidebar/search-sidebar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import { Sidebar, SidebarContent, SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '@/context/auth-context'
import { cn } from '@/lib/utils'
import { se } from 'date-fns/locale'
import { filter, set } from 'lodash'
import { PanelRight } from 'lucide-react'
import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import Swal from 'sweetalert2'
import { STATUS_LABELS } from './CaseDetail'
import { Label } from '@/components/ui/label'



export const FlowCase = () => {
  const { user, loading } = useAuth();

  if (loading || !user) {
    return null; // don’t render listener until auth is ready
  }
  return <FlowCaseData user={user}/>

}

export const FlowCaseData = (user) => {
  const [caseData, setCaseData] = useState([]);
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
    RangeTime: "",
  });
  const [filterClose, setFilterClose] = useState(true)

  const fetchData = async () => {
    setRenderer(true);
    try {
      const response = await ApiCustomer.get('/api/case-information');
      const filtercases = response.data.data.filter(c => (c?.caseinformation?.Owner === user.user?.id || c?.caseinformation?.CreatedBy === user.user?.id) && (filterClose ? c.CaseStatus !== 'Close' : c.CaseStatus !== '' ) );

      // const sortedCases = filtercases.sort((a, b) => {
      //   const dateAraw = a.caseinformation.ActionLog[0]?.ChangeAt;
      //   const dateBraw = b.caseinformation.ActionLog[0]?.ChangeAt;

      //   const dateA = dateAraw ? (dateAraw instanceof Date ? dateAraw : new Date(dateAraw)) : new Date(0);
      //   const dateB = dateBraw ? (dateBraw instanceof Date ? dateBraw : new Date(dateBraw)) : new Date(0);

      //   return dateB - dateA; // newest first
      // });

      const sortedCases = filtercases.sort((a, b) => {
        const dateAraw = a.UpdateOn;
        const dateBraw = b.UpdateOn;

        const dateA = dateAraw ? (dateAraw instanceof Date ? dateAraw : new Date(dateAraw)) : new Date(0);
        const dateB = dateBraw ? (dateBraw instanceof Date ? dateBraw : new Date(dateBraw)) : new Date(0);

        return dateB - dateA; // newest first
      });

      setCaseData(sortedCases);
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
  }, [user.user, filterClose]);

  // filter logic
  const filteredCases = caseData
    .filter(c => {
      const isCreatedBy = c?.caseinformation?.CreatedBy == user.user.id;
      const isOwner = c?.Owner == user.user.id;
      return (
        (filters.SerialNumber === "" || c.SerialNumber?.toLowerCase().includes(filters.SerialNumber.toLowerCase())) &&
        (filters.Company === "" || c.CustomerAccount?.toLowerCase().includes(filters.Company.toLowerCase())) &&
        (filters.Email === "" || c.caseinformation?.contact_information?.Email?.toLowerCase().includes(filters.Email.toLowerCase())) &&
        (filters.Phone === "" || c.caseinformation?.contact_information?.Phone?.toLowerCase().includes(filters.Phone.toLowerCase())) &&
        (filters.Id === "" || c.CaseID.toString().includes(filters.Id)) &&
        (filters.Status === "" || c.CaseStatus === filters.Status) &&
        (filters.Type === "" || c.caseinformation?.CaseType === filters.Type) &&
        (filters.Role === "" || (filters.Role === "CreatedBy" && isCreatedBy) || (filters.Role === "Owner" && isOwner))
      );
    })
    .sort((a, b) => {
      const aIsOwner = a.Owner == user.user.username;
      const bIsOwner = b.Owner == user.user.username;
      if (aIsOwner && !bIsOwner) return -1;
      if (!aIsOwner && bIsOwner) return 1;
      return 0;
    })
    .map(c => {
      // Grab the raw CreatedOn
      const rawCreated = c.UpdateOn;
      const createdDate = rawCreated ? (rawCreated instanceof Date ? rawCreated : new Date(rawCreated)) : null;

      let estimatedTime = null;
      if (createdDate) {
        const diffMs = Date.now() - createdDate.getTime(); // difference in milliseconds
        const diffSeconds = Math.floor(diffMs / 1000);
        const diffMinutes = Math.floor(diffSeconds / 60);
        const diffHours = Math.floor(diffMinutes / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffDays > 0) {
          estimatedTime = `${diffDays} day(s) ago`;
        } else if (diffHours > 0) {
          estimatedTime = `${diffHours} hour(s) ago`;
        } else if (diffMinutes > 0) {
          estimatedTime = `${diffMinutes} minute(s) ago`;
        } else {
          estimatedTime = `${diffSeconds} second(s) ago`;
        }
      }

      return {
        ...c,
        FormattedCreatedOn: createdDate ? createdDate.toLocaleString("id-ID") : null,
        EstimedTimeFromUpdate: estimatedTime || "No Update",
      };
    })
    ;

  const finishedCases = caseData.filter(c => c.CaseStatus === "FinishRepair");
  // console.log(caseData)
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 6;
  // if the window width size more than 2400px set page size to 12
  const totalPages = Math.ceil(filteredCases.length / PAGE_SIZE);
  const MAX_PAGES_SHOWN = 3;
  const getPaginationPages = () => {
    if (totalPages <= MAX_PAGES_SHOWN) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage <= 2) {
      return [1, 2, 3];
    }
    if (currentPage >= totalPages - 1) {
      return [totalPages - 2, totalPages - 1, totalPages];
    }
    return [currentPage - 1, currentPage, currentPage + 1];
  };
  const paginationPages = getPaginationPages();
  const currentPageData = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredCases.slice(start, start + PAGE_SIZE);
  }, [filteredCases, currentPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const allowedRoles = ["fd", "admin"];

  const navigate = useNavigate();
  return (
    <>
      <SidebarProvider defaultOpen className={'min-h-0'}>

        <SidebarInset>
          <div className="max-h-screen flex flex-col w-full ">

            <div className="sticky top-13   bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 ">
              <div className=" flex h-14 w-full  items-center gap-3 px-4 justify-between">
                <div className="flex items-center gap-2">
                  <Switch checked={filters.Status === "FinishRepair"}
                    onCheckedChange={(checked) => setFilters({
                      ...filters,
                      Status: checked ? "FinishRepair" : "",
                    })} className=" hover:bg-blue-500 hover:ring-1 hover:ring-blue-500" id="Finish" />
                  <Label htmlFor="Finish" className={'font-[700]'}>Show Only Finished Case</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={filterClose === false}
                    onCheckedChange={(checked) => setFilterClose(
                      
                      checked ? false : true,
                    )} className=" hover:bg-blue-500 hover:ring-1 hover:ring-blue-500" id="Finish" />
                  <Label htmlFor="Finish" className={'font-[700]'}>Enabled Closed Case</Label>
                </div>
                <h1 className="lg:text-xl md:text-md font-semibold tracking-tight text-sm">Case For You</h1>
                <SidebarTrigger icon={PanelRight} />
              </div>
            </div>

            <div className="space-y-3 p-5">
              {renderer ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i} className="p-4 shadow-sm">
                    <Skeleton className="h-6 w-32" />
                  </Card>
                ))
              ) : (
                currentPageData.map((c) => (
                  <Card
                    key={c.CaseID}
                    className={cn("flex-row justify-between items-center p-4 shadow-md hover:shadow-md hover:border-amber-200 transition cursor-pointer border-l-4",
                      c.CaseStatus === "FinishRepair" ? "border-green-300" :
                      c.CaseStatus === "Close" ? "border-red-300 bg-fuchsia-100" :
                        c?.caseinformation.Owner !== user.user.id ? "border-blue-300" : ''
                    )}
                    onClick={() => navigate(`/app/case/${c.CaseID}`)}
                  >
                    <div>
                      <p className="font-semibold">#{c.CaseID} - {c.ProductName}</p>
                      <p className="text-sm text-gray-500">{c.SerialNumber} | {c.Primary} | {c.CustomerAccount || "No Company"} | {c.CreatedOn}</p>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <div className="space-x-2">
                        {c?.caseinformation?.asset_information?.WarrantyOTCCode?.WarrantyCondition === "InWarranty" ? (
                          <Badge className="bg-green-500">IW</Badge>
                        ) : c?.caseinformation?.asset_information?.WarrantyOTCCode?.WarrantyCondition === "OutWarranty" ? (
                          <Badge className="bg-red-500">OOW</Badge>
                        ) : (
                          <Badge className="bg-gray-500">?</Badge>
                        )}

                        <Badge className="bg-cyan-600">{c.CaseStatus}</Badge>
                        <Badge>{c.caseinformation.CaseType}</Badge>
                        {c?.caseinformation.Owner === user.user.id ? (
                          <Badge className="bg-purple-500">Owner</Badge>
                        ) : (
                          <Badge className="bg-sky-500">CreatedBy</Badge>
                        )}
                      </div>
                      {c.EstimedTimeFromUpdate}
                    </div>
                  </Card>
                ))
              )}
              <Pagination className="flex justify-start">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      placeholder='First'
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(totalPages - totalPages + 1);
                      }}
                    />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(currentPage - 1);
                      }}
                    />
                  </PaginationItem>

                  {paginationPages.map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        isActive={currentPage === page}
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(page);
                        }}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(currentPage + 1);
                      }}
                    />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext
                      placeholder='Last'
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(totalPages);
                      }}
                    />
                  </PaginationItem>
                  <div className="flex gap-3 p-1 items-center">
                    Total Page
                    <span className='border-2 p-1 rounded-md shadow-2xl'>
                      {totalPages}
                    </span>
                  </div>
                </PaginationContent>
              </Pagination>
              {error ? <h1 className="text-center text-destructive">Something went wrong</h1> : ""}
            </div>
          </div>

        </SidebarInset>
        <SearchBar filters={filters} setFilters={setFilters} caseData={caseData} filterClose={filterClose} />

      </SidebarProvider>
    </>
  )
  
}


