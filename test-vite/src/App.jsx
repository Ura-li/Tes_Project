import React, { useState, useRef, useEffect } from 'react'
import { SheetBar } from './components/app-sheetbar'
import { Button } from "@/components/ui/button"
import { AppSidebar } from "@/components/app-sidebar"
import { Input } from './components/ui/input'
import {
  Loader2,
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
import debounce from 'lodash.debounce';

export function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <nav className="text-sm">
      <Link to="/" className="text-gray-400">Home</Link>
      {pathnames.map((segment, index) => {
        const to = '/' + pathnames.slice(0, index + 1).join('/');
        return (
          <span key={to}>
            {' / '}
            <Link to={to} className="text-sky-100 capitalize">{decodeURIComponent(segment)}</Link>
          </span>
        );
      })}
    </nav>
  );
}

export function GlobalSearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const containerRef = useRef(null);
  const [loading, setLoading] = useState(false)
  const fetchResults = async (q) => {
    if (!q) {
      setResults(null);
      return;
    }

    try {
    setLoading(true);
      const response = await ApiCustomer.get(`/api/global-search?query=${encodeURIComponent(q)}`);
      const data = response.data;
      setResults(data);
      setShowResults(true);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Debounce the search call
  const debouncedFetch = useRef(debounce(fetchResults, 300)).current;

  useEffect(() => {
    debouncedFetch(query);
    if (!query) {
      setResults(null);
      setShowResults(false);
    }
  }, [query, debouncedFetch]);

  // Hide results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <span className='flex items-center gap-2'> 
        <Input
          placeholder="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border border-b-2 border-b-black bg-sky-100"
          onFocus={() => {
            if (results) setShowResults(true);
          }}
        />
        {loading ? <Loader2 className=' animate-spin'></Loader2> : ""}
      </span>
      {showResults && results && (
        <div className="absolute bg-white shadow rounded p-2 z-50 w-full">
          <div>
            <strong>Cases</strong>
            {results.cases.map(c => (
              <Link key={c.CaseID} to={`/app/case/${c.CaseID}`} className="block hover:underline">
                {c.CaseID} - {c.site_account?.Company}
              </Link>
            ))}
          </div>
          <div>
            <strong>Work Orders</strong>
            {results.workOrders.map(wo => (
              <Link key={wo.WOID} to={`/app/work/${wo.WOID}`} className="block hover:underline">
                {wo.WOID}
              </Link>
            ))}
          </div>
          <div>
            <strong>Material Orders</strong>
            {results.materialOrders.map(mo => (
              <Link key={mo.MOID} to={`/app/material_order/${mo.MOID}`} className="block hover:underline">
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
        <header className="flex  items-center justify-between px-4 gap-2 bg-cyan-700">
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
            <div className="flex  p-2 items-center gap-2 self-center">
              <Search></Search>
              <GlobalSearchBar />
              {/* <Input placeholder="Search" className="w-110 mr-45 border-b-black border border-b-2" ></Input> */}
            </div>
            {/* <SheetBar></SheetBar> */}
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
