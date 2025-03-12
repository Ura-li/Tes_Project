import { React } from 'react'
import  { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from './components/ui/card'
import { Input } from './components/ui/input'
import { InfoSide } from './components/info-sidebar'
import { 
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarTrigger,
} from './components/ui/sidebar' 

import { Button } from "@/components/ui/button"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Eye,
  Frame,
  GalleryVerticalEnd,
  Home,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  Plus,
} from "lucide-react"

import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

// import {
//   Sheet,
//   SheetTrigger,
//   SheetClose,
//   SheetContent,
//   SheetHeader,
//   SheetFooter,
//   SheetTitle,
//   SheetDescription 
// } from "@/components/ui/sheet"

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import TabsDialog from "@/components/Tabs-dialog"
import {DialogDemo} from "@/components/modals-dialog"
const data = {
  navMain: [
    {
      title: "Account info",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "History",
          value: "#",
        },
        {
          title: "Starred",
          value: "#",
        },
        {
          title: "Settings",
          value: "#",
        },
      ],
    },
    {
      title: "Contact info",
      icon: Bot,
      items: [
        {
          title: "Genesis",
          value: "#",
        },
        {
          title: "Explorer",
          value: "#",
        },
        {
          title: "Quantum",
          value: "#",
        },
      ],
    },
    {
      title: "Asset info",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          value: "#",
        },
        {
          title: "Get Started",
          value: "#",
        },
        {
          title: "Tutorials",
          value: "#",
        },
        {
          title: "Changelog",
          value: "#",
        },
      ],
    },
    {
      title: "Entitlement info",
      icon: Settings2,
      items: [
        {
          title: "General",
          value: "#",
        },
        {
          title: "Team",
          value: "#",
        },
        {
          title: "Billing",
          value: "#",
        },
        {
          title: "Limits",
          value: "#",
        },
      ],
    },
  ],
}
const Search_case = () => {

  // const [search, setSearch] = useState("");
  
  // // Filtered Data
  // const filteredData = data.filter((item) =>
  //   item.name.toLowerCase().includes(search.toLowerCase()) || 
  //   item.email.toLowerCase().includes(search.toLowerCase())
  // );

  return (
    
    <div className="flex flex-1  gap-4 p-4 pt-0">
      <div className="flex  min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
        <Tabs defaultValue="search" className="w-full">
          <TabsList className=" w-full flex justify-between h-[3em]">
            <div className="w-2xs">
              <TabsTrigger value="search">Search</TabsTrigger>
              <TabsTrigger value="ci">Costumer Information</TabsTrigger>
            </div>
            <Button><span><Plus></Plus></span>Create Case</Button>
          </TabsList>
          <TabsContent value="search">
            <Card>
              <CardContent className="space-y-2 grid gap-1 grid-cols-3">
                <div className="space-y-1">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email"  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="serialnumber">Serial Number</Label>
                  <Input id="serialnumber" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="country">Country</Label>
                  <Input id="country" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="company">Company</Label>
                  <Input id="company"  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="zippostal">Zip/Postal</Label>
                  <Input id="zippostal" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone"  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="assettag">Asset Tag</Label>
                  <Input id="assettag" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="contrackid">Contrack Id</Label>
                  <Input id="contrackid" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="transactiontype">Transaction Type</Label>
                  <Input id="transactiontype"  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="transactiontid">Transaction Id</Label>
                  <Input id="transactiontid" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="opsi">Opsi</Label>
                  <Input id="opsi" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="lisensekey">Lisense key</Label>
                  <Input id="lisensekey"  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="pin">Pin</Label>
                  <Input id="pin" />
                </div>
                
              </CardContent>
              <CardFooter>
                <Button>Save changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="ci">
            <Card>
              <DialogDemo></DialogDemo>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <div className="flex  flex-col min-h-[100vh]  rounded-xl bg-muted/50 md:min-h-min">
        <Sidebar side='right' className="relative" collapsible='icon'>
          <SidebarTrigger />
          <SidebarContent>
            <InfoSide items={data.navMain} />
          </SidebarContent>
        </Sidebar>
      </div>
    </div>
  )
}

export default Search_case
