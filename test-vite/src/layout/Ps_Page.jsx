import ApiCustomer from '@/api';
import { Card, CardHeader, CardTitle, CardFooter, CardContent, CardDescription } from '@/components/ui/card';
import { CaseField } from "@/pages/services/service-case";
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/context/auth-context';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { toast } from 'sonner';

export default function ProductStorage() {
  const [caseData, setCaseData] = useState([]);
  const [renderer, setRenderer] = useState(false);
  const { user } = useAuth();
  const [selectedStorage, setSelectedStorage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const navigate = useNavigate();

  const rules = [
    { prefix: "A", range: [1,2,3,4,5], label: "Laptop Old Case"},
    { prefix: "B", range: [1], label: "Part Bufer CE"},
    { prefix: "B", range: [2], label: "Unit Laptop Big Box"},
    { prefix: "B", range: [3,4,5], label: "Toner & Catridge"},
    { prefix: "C", range: [1,2,3,4,5], label: "Unit Laptop IW"},
    { prefix: "D", range: [1,2,3,4,5], label: "Unit Laptop OOW"},
    { prefix: "E", range: [1], label: "Unit Buffer CE"},
    { prefix: "E", range: [2], label: "Finish Repair Laptop(OOW)"},
    { prefix: "E", range: [3,4,5], label: "AIO & Monitor"},
    { prefix: "F", range: [1], label: "Unit Laptop OOW"},
    { prefix: "F", range: [2], label: "AIO & Monitor"},
    { prefix: "F", range: [3,4,5], label: "Finish Repair Laptop"},
    { prefix: "G", range: [1,2,3,4,5], label: "Box-Box Mr. Hadi"},
    { prefix: "H", range: [1], label: "Medium Printer"},
    { prefix: "H", range: [2,3,4,5], label: "AIO & Medium PC"},
    { prefix: "I", range: [1,2,3,4], label: "Large Printer"},
    { prefix: "I", range: [5], label: "Medium Printer"},
    { prefix: "J", range: [1,2,3,4,5], label: "Medium Printer"},
    { prefix: "K", range: [1], label: "Large Printer"},
    { prefix: "K", range: [2,3,4], label: "Medium Printer"},
    { prefix: "K", range: [5], label: "Small Printer"},
    { prefix: "L", range: [1], label: "Large Printer"},
    { prefix: "L", range: [2,3,4,5], label: "Medium Printer"},
    { prefix: "M", range: [1,2], label: "Large Printer"},
    { prefix: "M", range: [3,4,5], label: "Medium Printer"},
    { prefix: "N", range: [1], label: "Large Printer"},
    { prefix: "N", range: [2,3], label: "Small Printer"},
    { prefix: "N", range: [4,5], label: "Medium Printer"},
    { prefix: "O", range: [1], label: "Large Printer"},
    { prefix: "O", range: [2,3,4,5], label: "Medium Printer"},
    { prefix: "P", range: [1,2,3,4,5], label: "Medium Printer"},
    { prefix: "Q", range: [1], label: "Large Printer"},
    { prefix: "Q", range: [2], label: "Finish Repair Printer"},
    { prefix: "Q", range: [3,4,5], label: "Small PC & Printer"},
    { prefix: "Q", range: [4,5], label: "Small Printer"},
    { prefix: "R", range: [1,2], label: "New Incoming Laptop"},
    { prefix: "R", range: [3,4,5], label: "Unit Temporarily"},
    { prefix: "S", range: [1,2,3,4,5], label: "Printer Laser"},
    { prefix: "T", range: [1,2,3,4,5], label: "Finish Repair Laptop"},
    { prefix: "U", range: [1,2,3,4,5], label: "Finish Repair Laptop"},
    { prefix: "V", range: [1,2,3,4,5], label: "Printer Tonner"},
    { prefix: "W", range: [1,2], label: "Laptop OOW"},
    { prefix: "W", range: [3,4,5], label: "Quotation Pending"},
    { prefix: "Z", range: [1,2,3,4,5], label: "Printer"},
  ]

  const letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q","R","S","T","U","V","W","Z"]
  const maxNumber = 5;
  const storageList = []

  for (const letter of letters) {
    for (let n = 1; n <= maxNumber; n++) {
      const rule = rules.find(r => r.prefix === letter && r.range.includes(n));
      
      storageList.push({
        value: `${letter}${n}`,
        label: rule?.label ?? "Unknown"
      });
    }
  }

  const fetchData = async () => {
    setRenderer(true);
    try {
      const fetchCase = await ApiCustomer.get(`/api/case-information`);
      const fetchAllCase = fetchCase.data.data;
      setCaseData(fetchAllCase);
      const valueFilter = fetchAllCase.filter(c => c.caseinformation?.StorageLocationStore && (c?.caseinformation?.Owner === user.id || c?.caseinformation?.CreatedBy === user.id))
      setCaseData(valueFilter);
    } catch (error) {
      toast.error(error?.response?.data?.message ?? "Gagal Fetch Data")
    } finally {
      setRenderer(false);
    }
  }

  useEffect(() => {
    fetchData();
  },[]);

  const filterData = caseData.filter((c) => !selectedStorage || c?.caseinformation?.StorageLocationStore === selectedStorage)

  const sortData = [...filterData].sort((a,b) => {
    const StorageA = a.CaseID;
    const StorageB = b.CaseID;
    return StorageB.localeCompare(StorageA)
  })
  const totalPages = Math.ceil(sortData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = sortData.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className='bg-gradient-to-t dark:from-slate-800 dark:via-slate-600 dark:to-slate-800 dark:to-70% dark:via-6% dark:from-1% h-full' id='storage-list'>
    <SidebarProvider className={"min-h-0"} >
      <div className='w-full' id='storage-card'>
        <div className='flex justify-between p-2'>
        <h1 className='ml-2'>Your Storage</h1>
        <SidebarTrigger/>
        </div>
        <div className="p-3 space-y-5">
  {renderer ? (
    Array.from({ length: 4 }).map((_, i) => (
      <Card key={`skeleton-${i}`} className="p-2 shadow-sm dark:bg-gradient-to-r dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 dark:border-b-slate-600" >
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
        className="hover:bg-gray-100 cursor-pointer border-l-4 hover:border-yellow-300 dark:hover:border-purple-600 p-3 dark:bg-gradient-to-r dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 dark:border-b-slate-600"
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

<CardFooter className="items-center flex gap-4">
  <button
    className="px-2 bg-gray-300 rounded disabled:opacity-50 cursor-pointer dark:bg-gray-500 dark:text-gray-200"
    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
    disabled={currentPage === 1}
  >
    Previous
  </button>
  <span className="text-sm text-gray-600 dark:text-gray-400">
    Page {currentPage} of {totalPages}
  </span>
  <button
    className="px-2 bg-gray-300 rounded disabled:opacity-50 cursor-pointer dark:bg-gray-500 dark:text-gray-200" 
    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
    disabled={currentPage === totalPages}
  >
    Next
  </button>
</CardFooter>

        </div>
      <Sidebar side='right' variant='sidebar' className={"z-1"}>
        <SidebarHeader className={"h-16 dark:bg-gray-800"}/>
         <SidebarContent className="bg-gradient-to-t  dark:from-slate-800 dark:via-slate-600 dark:to-slate-800 dark:to-70% dark:via-6% dark:from-1%"> 
          <SidebarGroup>
            <SidebarGroupContent className={"flex flex-col gap-5 p-2 "}>
                {storageList.map((item) => (
                    <button
                      key={item.value}
                      onClick={() => {
                        setSelectedStorage(item.value);
                        setCurrentPage(1);
                      }}
                      className={`p-2 rounded-md cursor-pointer dark:border-b-slate-500 dark:bg-gradient-to-b dark:hover:border-purple-500 dark:border-1 dark:from-slate-700 dark:via-slate-600 dark:to-slate-900 ${
                        selectedStorage === item.value 
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 hover:bg-gray-300"
                      }`}
                    >
                      {item.value} - {item.label}
                    </button>
                  ))}
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
    </div>
  )
}