import React, { useState } from 'react'
import { SheetBar } from './components/app-sheetbar'
import { Button } from "@/components/ui/button"
import { AppSidebar } from "@/components/app-sidebar"
import { Input } from './components/ui/input'
import {
  Search,
  Sheet
} from 'lucide-react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router'
import Lorem from './Lorem'

import ApiCustomer from './api'

import {Outlet} from "react-router"

export function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <nav className="text-sm">
      <Link to="/" className="text-gray-600">Home</Link>
      {pathnames.map((segment, index) => {
        const to = '/' + pathnames.slice(0, index + 1).join('/');
        return (
          <span key={to}>
            {' / '}
            <Link to={to} className="text-blue-600 capitalize">{decodeURIComponent(segment)}</Link>
          </span>
        );
      })}
    </nav>
  );
}

export function GlobalSearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);

  const handleSearch = async () => {
    if (!query) return;
    try {
      const response = await ApiCustomer.get(`/api/global-search?query=${encodeURIComponent(query)}`);
      const data = response.data;
      setResults(data);
      console.log("data",data)
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  return (
    <div>
      <input
        placeholder="Search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        className="w-110 mr-45 border-b-black border border-b-2"
      />
      {/* Optional: Show results */}
      {results && (
        <div className="absolute bg-white shadow rounded p-2">
          <div>
            <strong>Cases</strong>
            {results.cases.map(c => (
              <Link key={c.CaseID} to={`/case/${c.CaseID}`} className="block hover:underline">
                {c.CaseID} - {c.site_account?.Company}
              </Link>
            ))}
          </div>
          <div>
            <strong>Work Orders</strong>
            {results.workOrders.map(wo => (
              <Link key={wo.WOID} to={`/work/${wo.WOID}`} className="block hover:underline">
                {wo.WOID}
              </Link>
            ))}
          </div>
          <div>
            <strong>Material Orders</strong>
            {results.materialOrders.map(mo => (
              <Link key={mo.MOID} to={`/material_order/${mo.MOID}`} className="block hover:underline">
                {mo.MOID}
              </Link>
            ))}
          </div>

        </div>
      )}
    </div>
  );
}

const App = () => {
  
  return (
    <div>
      <SidebarProvider style={{
    "--sidebar-width": "13rem",
    "--sidebar-width-mobile": "20rem",
  }}>
      <AppSidebar />
      <SidebarInset className="overflow-auto">
        <header className="border-2 rounded-b-xl flex h-14 items-center justify-between px-4 gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            {/* <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <Link to="/lorem">
                    <BreadcrumbLink >
                     Login
                    </BreadcrumbLink>
                  </Link>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Home Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb> */}
            <Breadcrumbs/>
          </div>
            <div className="flex  p-2 items-center gap-2">
              <Search></Search>
              <GlobalSearchBar />
              {/* <Input placeholder="Search" className="w-110 mr-45 border-b-black border border-b-2" ></Input> */}
            </div>
            <SheetBar></SheetBar>
        </header>
        {/* <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
          </div>
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
        </div> */}
        <Outlet/>
      </SidebarInset>
    </SidebarProvider>  
    </div>
  )
}

export default App
