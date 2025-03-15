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

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

import { DialogCloseButton, DialogCompanyBtn } from './components/assets-modal'
import { SelectBar } from './components/sc-select'
import { SelectBar1 } from './components/sc-select'
import { SelectBar2 } from './components/sc-select'
import { BtnModal, BtnModalContact, BtnModalAsset } from './components/sc-modal'
import { TableContact, TableCompany, TableAsset } from './components/sc-table'

const Search_case = () => {

  // const [search, setSearch] = useState("");
  
  // // Filtered Data
  // const filteredData = data.filter((item) =>
  //   item.name.toLowerCase().includes(search.toLowerCase()) || 
  //   item.email.toLowerCase().includes(search.toLowerCase())
  // );

  return (
    <div className="flex flex-1 mt-2  gap-4 p-4 pt-0">
      <div className="flex min-h-[100vh] flex-1 rounded-xl md:min-h-min">
        <Tabs defaultValue="search" className="w-full">
          <TabsList className="drop-shadow-xl bg-sky-700 w-full h-15 flex justify-between">
            <div className="w-2xs p-2 text-white ">
              <TabsTrigger value="search" className="cursor-pointer">Search</TabsTrigger>
              <TabsTrigger value="ci" className="cursor-pointer">Costumer Information</TabsTrigger>
            </div>

            <BtnModal></BtnModal>
          </TabsList>
          <TabsContent value="search">
            <Card className="drop-shadow-md">
              <CardContent className="grid gap-5 grid-cols-3">
                <div className="space-y-0.5"> 
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" className="border-b-black p-1 "  />
                </div>
                <div className="space-y-0.5">
                  <Label htmlFor="serialnumber">Serial Number</Label>
                  <Input id="serialnumber" className="border-b-black p-1"  />
                </div>
                <div className="space-y-0.5">
                  <Label htmlFor="country">Country</Label>
                  <SelectBar></SelectBar>
                </div>
                <div className="space-y-0.5">
                  <Label htmlFor="company">Company</Label>
                  <Input id="company" className="border-b-black p-1"   />
                </div>
                <div className="space-y-0.5">
                  <Label htmlFor="zippostal">Zip/Postal</Label>
                  <Input id="zippostal" className="border-b-black p-1"  />
                </div>
                <div className="space-y-0.5">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" className="border-b-black p-1"  />
                </div>
                <div className="space-y-0.5">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" className="border-b-black p-1"   />
                </div>
                <div className="space-y-0.5">
                  <Label htmlFor="assettag">Asset Tag</Label>
                  <Input id="assettag" className="border-b-black p-1" />
                </div>
                <div className="space-y-0.5">
                  <Label htmlFor="contrackid">Contrack Id</Label>
                  <Input id="contrackid" className="border-b-black p-1"  />
                </div>
                <div className="space-y-0.5">
                  <Label htmlFor="transactiontype">Transaction Type</Label>
                  <Input id="transactiontype" className="border-b-black p-1"  />
                </div>
                <div className="space-y-0.5">
                  <Label htmlFor="transactiontid">Transaction Id</Label>
                  <Input id="transactiontid" className="border-b-black p-1" />
                </div>
                <div className="space-y-0.5">
                  <Label htmlFor="opsi">Opsi</Label>
                  <Input id="opsi" className="border-b-black p-1" />
                </div>
                <div className="space-y-0.5">
                  <Label htmlFor="lisensekey">Lisense key</Label>
                  <Input id="lisensekey" className="border-b-black p-1"  />
                </div>
                <div className="space-y-0.5">
                  <Label htmlFor="pin">Pin</Label>
                  <Input id="pin" className="border-b-black p-1" />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button variant="secondary" className="bg-white drop-shadow-md border-1 cursor-pointer w-40 h-11"><p className='text-2xl mb-1'>Search</p></Button>
              </CardFooter>
            </Card>
          </TabsContent>  
          
          <TabsContent value="ci" className="flex flex-col gap-1">
          <TabsList className="bg-white float-right mr-5 self-end">   
              <TabsTrigger value="Account" className="cursor-pointer"><span><Plus></Plus></span>Create New</TabsTrigger>
              {/* <DialogCloseButton></DialogCloseButton> */}
          </TabsList>
          
            <TableCompany></TableCompany>
            <TableContact></TableContact>
            <TableAsset></TableAsset>
            {/* <ShelterBox></ShelterBox>
            <ShelterContact></ShelterContact>
            <ShelterAsset></ShelterAsset> */}
        
          </TabsContent>

         
          <TabsContent value="Account">
          <TabsList className="flex h-[3em] bg-white">
            <div className="w-2xs p-2 text-black">
              <TabsTrigger value="Account" className="cursor-pointer">Account</TabsTrigger>
              <TabsTrigger value="Contact" className="ml-2 cursor-pointer">Contact</TabsTrigger>
            </div>
          </TabsList>
            <Card className="drop-shadow-md">
              {/* <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>
                  Change your password here. After saving, you'll be logged out.
                </CardDescription>
              </CardHeader> */}
           
                  
                <CardHeader className="flex-row justify-between">
              <CardTitle>
                  Basic Information
                </CardTitle>  
                <CardTitle>
                  Clear All
                </CardTitle>
              </CardHeader>
              
              <CardContent className="grid gap-5 grid-cols-3">
              <div className="space-y-0.5">
                  <Label htmlFor="current">Company</Label>
                  <Input id="current" className="border-b-black p-1"/>
                </div>
                <div className="space-y-0.5">
                  <Label htmlFor="current">Email</Label>
                  <Input id="current" type="email" className="border-b-black p-1" />
                </div>
                <div className="space-y-0.5">
                  <Label htmlFor="new">Primary Phone</Label>
                  <Input id="new" type="text" className="border-b-black p-1" />
                </div>
              </CardContent>

              <CardHeader className="mt-4">
                <CardTitle>
                  Address
                </CardTitle>
              </CardHeader>

              <CardContent className="grid gap-5 grid-cols-3">
              <div className="space-y-0.5">
                  <Label htmlFor="current">Addres Line 1</Label>
                  <Input id="current" type="email" className="border-b-black p-1"  />
                </div>
                <div className="space-y-0.5">
                  <Label htmlFor="current">Addres Line 2</Label>
                  <Input id="current" type="email" className="border-b-black p-1" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="new">City</Label>
                  <Input id="new" type="text" className="border-b-black p-1"  />
                </div>
                <div className="space-y-0.5">
                  <Label htmlFor="current">State/Province</Label>
                  <Input id="current" type="text" className="border-b-black p-1" />
                </div>
                <div className="space-y-0.5">
                  <Label htmlFor="current">Country</Label>
                  <SelectBar></SelectBar>
                </div>
                <div className="space-y-0.5">
                  <Label htmlFor="new">Zip/Postal Code</Label>
                  <Input id="new" type="text" className="border-b-black p-1" />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button variant="secondary" className="bg-white drop-shadow-md border-1 cursor-pointer">Verify & Save</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="Contact">
          <TabsList className="flex h-[3em] bg-white">
            <div className="w-2xs p-2 text-black">
              <TabsTrigger value="Account" className="cursor-pointer">Account</TabsTrigger>
              <TabsTrigger value="Contact" className="ml-2 cursor-pointer">Contact</TabsTrigger>
            </div>
          </TabsList>
            <Card className="drop-shadow-md">
              {/* <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>
                  Change your password here. After saving, you'll be logged out.
                </CardDescription>
              </CardHeader> */}
              
              <CardHeader className="flex-row justify-between">
              <CardTitle>
                  Basic Information
                </CardTitle>  
                <CardTitle>
                  Clear All
                </CardTitle>
              </CardHeader>

              <CardContent className="grid gap-5 grid-cols-3">
              <div className="space-y-0.5">
                  <Label htmlFor="current">Salutation</Label>
                  <SelectBar1></SelectBar1>
                  <Label htmlFor="current" className="mt-2">Preferend Language</Label>
                  <SelectBar2></SelectBar2>
                </div>
                <div className="space-y-0.5 absolute ml-42">
                  <Label htmlFor="current">First Name</Label>
                  <Input id="current" type="email"className="border-b-black p-1 w-40.5"/>
                </div>
                <div className="space-y-0.5">
                  <Label htmlFor="current">Last Name</Label>
                  <Input id="current" type="email"className="border-b-black p-1"/>
                </div>
                <div className="space-y-0.5">
                  <Label htmlFor="new">EXTN</Label>
                  <Input id="new" type="text" className="border-b-black p-1"/>
                </div>
              </CardContent>
              
              <CardHeader className="mt-2">
                <CardTitle>
                Phone preferences
                </CardTitle>
              </CardHeader>

              <CardContent className="grid gap-5 grid-cols-3">
              <div className="space-y-0.5">
                  <Label htmlFor="current">Phone</Label>
                  <Input id="current" type="email" className="border-b-black p-1" />
                </div>
                <div className="space-y-0.5">
                  <Label htmlFor="current">Mobile</Label>
                  <Input id="current" type="email" className="border-b-black p-1" />
                </div>
                <div className="space-y-0.5">
                  <Label htmlFor="new">Work</Label>
                  <Input id="new" type="text" className="border-b-black p-1 w-38.5"/>
                </div>
                <div className="space-y-0.5 absolute ml-215">
                  <Label htmlFor="current">EXTN</Label>
                  <Input id="current" type="text" className="border-b-black p-1 w-38.5" />
                </div>  
                <div className="space-y-0.5">
                  <Label htmlFor="current">Other</Label>
                  <Input id="current" type="text" className="border-b-black p-1 w-38"/>
                </div>
                <div className="space-y-0.5 absolute mt-18 ml-43">
                  <Label htmlFor="current">EXTN</Label>
                  <Input id="current" type="text" className="border-b-black p-1 w-38" />
                </div> 
                <div className="space-y-0.5">
                  <Label htmlFor="new">FAX</Label>
                  <Input id="new" type="text" className="border-b-black p-1" />
                </div>
              </CardContent>

              <CardHeader className="mt-2">
                <CardTitle>
                Address
                </CardTitle>
              </CardHeader>

              <CardContent className="grid gap-5 grid-cols-3">
                <div className="space-y-0.5">
                  <Label htmlFor="current">Addres Line 1</Label>
                  <Input id="current" type="email" className="border-b-black p-1"  />
                </div>
                <div className="space-y-0.5">
                  <Label htmlFor="current">Addres Line 2</Label>
                  <Input id="current" type="email" className="border-b-black p-1" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="new">City</Label>
                  <Input id="new" type="text" className="border-b-black p-1"  />
                </div>
                <div className="space-y-0.5">
                  <Label htmlFor="current">State/Province</Label>
                  <Input id="current" type="text" className="border-b-black p-1" />
                </div>
                <div className="space-y-0.5">
                  <Label htmlFor="current">Country</Label>
                  <SelectBar></SelectBar>
                </div>
                <div className="space-y-0.5">
                  <Label htmlFor="new">Zip/Postal Code</Label>
                  <Input id="new" type="text" className="border-b-black p-1" />
                </div>
              </CardContent>

              <CardFooter className="flex justify-end gap-4">
              <Button variant="secondary" className="bg-white drop-shadow-md border-1 cursor-pointer w-20">Save</Button>
                <Button variant="secondary" className="bg-white drop-shadow-md border-1 cursor-pointer">Verify & Save</Button>
              </CardFooter>
            </Card>
            
          </TabsContent>
        </Tabs>
      </div>
      {/* <div className="flex  flex-col min-h-[100vh]  rounded-xl bg-muted/50 md:min-h-min">
        <Sidebar side='right' className="relative" collapsible='icon'>
          <SidebarContent>
            <InfoSide items={data.navMain} />
          </SidebarContent>
        </Sidebar>
      </div> */}
    </div>
  )
}

export default Search_case
