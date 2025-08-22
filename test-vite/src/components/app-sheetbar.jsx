import React from 'react'
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { BadgeAlert } from 'lucide-react'
import { Card, CardDescription, CardHeader, CardTitle } from './ui/card'
// import { AppAccordion } from './app-accordion'
 
export function SheetBar() {
  const  notif = [
    { id: 1, title: 'Notification 1', description: 'This is the first notification.', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
    { id: 2, title: 'Notification 2', description: 'This is the second notification.', content: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' },
    { id: 3, title: 'Notification 3', description: 'This is the third notification.', content: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.' },
  ]

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="bg-white"><BadgeAlert className='size-5'></BadgeAlert></Button>
      </SheetTrigger>
      <SheetContent className="bg-white ">
        <SheetHeader>
          <SheetTitle className="flex justify-center text-2xl mt-5">Notification</SheetTitle>
        </SheetHeader>
        <div className='overflow-auto'>
        {/* <AppAccordion></AppAccordion> */}
          {notif.map((c) => (
            <Card key={c.id} className="shadow-sm border-2 border-gray-400">
              <CardHeader>
                <CardTitle>{c.title}</CardTitle>
                <CardDescription>{c.description}</CardDescription>
                <p className="text-sm leading-relaxed text-muted-foreground">{c.content}</p>
              </CardHeader>

            </Card>
          ))}
        </div>
        {/* <div>
          <Button variant="secondary" className="p-10 ml-10 w-20 bg-white border-2 drop-shadow-md"><Building2 className='size-10'></Building2></Button>
          <Button variant="secondary" className="p-10 ml-10 w-20 bg-white border-2 drop-shadow-md"><Contact className='size-10'></Contact></Button>
          <Button variant="secondary" className="mt-10 p-10 ml-10 w-20 bg-white border-2 drop-shadow-md"><Boxes className='size-10'></Boxes></Button>
          <Button variant="secondary" className="p-10 ml-10 w-20 bg-white border-2 drop-shadow-md"><PcCase className='size-10'></PcCase></Button>
        </div> */}
        {/* <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" value="Pedro Duarte" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input id="username" value="@peduarte" className="col-span-3" />
          </div>
        </div> */}
        {/* <SheetFooter>
          <SheetClose asChild>
            <Button type="submit">Save changes</Button>
          </SheetClose>
        </SheetFooter> */}
      </SheetContent>
    </Sheet>
  )
}