import ApiCustomer from '@/api';
import { Card, CardHeader, CardTitle, CardFooter, CardContent, CardDescription } from '@/components/ui/card';
import { CaseField } from "@/pages/services/service-case";
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/context/auth-context';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

export default function ProductStorage() {
  const [caseData, setCaseData] = useState([]);
  const [renderer, setRenderer] = useState(false);
  const { user } = useAuth();
  const [selectedStorage, setSelectedStorage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const navigate = useNavigate();


  const fetchData = async () => {
    setRenderer(true);
    try {
      const fetchCase = await ApiCustomer.get(`/api/case-information`);
      const fetchAllCase = fetchCase.data.data;
      setCaseData(fetchAllCase);
      const valueFilter = fetchAllCase.filter(c => c.caseinformation?.StorageLocationStore && (c?.caseinformation?.Owner === user.id || c?.caseinformation?.CreatedBy === user.id))
      setCaseData(valueFilter);
      setError(false)
    } catch (error) {
      console.log("Gagal Fetch Data", error);
    } finally {
      setRenderer(false);
    }
  }

  useEffect(() => {
    fetchData();
  },[]);

  const filterData = caseData.filter((c) => !selectedStorage || c?.caseinformation?.StorageLocationStore === selectedStorage)
  console.log("Data Filtering : ",filterData);

  const sortData = [...filterData].sort((a,b) => {
    const StorageA = a.CaseID;
    const StorageB = b.CaseID;
    return StorageB.localeCompare(StorageA)
  })
  console.log("Sorted Data : ", sortData)
  const totalPages = Math.ceil(sortData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = sortData.slice(startIndex, startIndex + itemsPerPage);

  return (
    <>
    <SidebarProvider className={"min-h-0"}>
      <div className='w-full'>
        <div className='flex justify-between p-2'>
        <h1 className=''>Your Storage</h1>
        <SidebarTrigger/>
        </div>
        <div className="p-3 space-y-5">
  {renderer ? (
    Array.from({ length: 4 }).map((_, i) => (
      <Card key={`skeleton-${i}`} className="p-3 shadow-sm">
        <div className="flex justify-between">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-5 w-32" />
        </div>
        <div className="flex justify-between">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-5 w-50" />
        </div>
      </Card>
    ))
  ) : currentData.length === 0 ? (
    <div className="p-2 text-center text-gray-500 ">
      Unit tidak tersedia di Storage
    </div>
  ): (
    currentData.map((c, index) => (
      <Card
        key={`${c.caseinformation?.asset_information?.AssetID || "no-id"}-${index}`}
        className="hover:bg-gray-100 cursor-pointer border-l-4 hover:border-yellow-300 p-3"
        onClick={() => navigate(`/app/case/${c.CaseID}`)}
      >
        <CardHeader>
          <div className="flex justify-between">
            <CardTitle>
              {c.ProductNumber} - {c.SerialNumber}
            </CardTitle>
            <CardTitle className="text-gray-400">
              {c.CaseID} - {c.CreatedOn}
            </CardTitle>
          </div>
          <hr />
        </CardHeader>
        <CardContent className="flex justify-between">
          <div>
            <CaseField>
              {c.Primary} / {c.ProductName}
            </CaseField>
          </div>
          <CaseField>
            {c.caseinformation?.asset_information?.WarrantyOTCCode?.OTCCode} -{" "}
            {c.caseinformation?.asset_information?.WarrantyOTCCode?.Description}
          </CaseField>
        </CardContent>
      </Card>
    ))
  )}
  
</div>

<CardFooter className="items-center justify-center flex gap-4">
  <button
    className="px-2 bg-gray-300 rounded disabled:opacity-50 cursor-pointer"
    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
    disabled={currentPage === 1}
  >
    Previous
  </button>
  <span className="text-sm text-gray-600">
    Page {currentPage} of {totalPages}
  </span>
  <button
    className="px-2 bg-gray-300 rounded disabled:opacity-50 cursor-pointer"
    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
    disabled={currentPage === totalPages}
  >
    Next
  </button>
</CardFooter>

        </div>
      <Sidebar side='right' variant='sidebar' className={"z-1"}>
        <SidebarHeader className={"bg-blue-500 h-16"}/>
         <SidebarContent> 
          <SidebarGroup>
            <SidebarGroupContent className={"flex flex-col gap-5 p-2"}>
                {["Storage 1", "Storage 2", "Storage 3", "Storage 4", 
                  "Storage 5", "Storage 6", "Storage 7", "Storage 8",
                  "Storage 9", "Storage 10"].map((StorageLocationStore) => (
                    <button
                      key={StorageLocationStore}
                      onClick={() => {
                        setSelectedStorage(StorageLocationStore);
                        setCurrentPage(1);
                      }}
                      className={`p-2 rounded-md cursor-pointer  ${
                        selectedStorage === StorageLocationStore 
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 hover:bg-gray-300"
                      }`}
                    >
                      {StorageLocationStore}
                    </button>
                  ))}
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
    </>
  )
}