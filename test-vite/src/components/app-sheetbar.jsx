import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { BadgeAlert, Bell } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { useSheet } from '@/context/sheet-context'
import { NotificationCard } from '@/layout/FrontDesk_Page'
// import { AppAccordion } from './app-accordion'
 
export function SheetBar({
}) {
  const  notif = [
    { id: 1, title: 'Notification 1', description: 'This is the first notification.', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
    { id: 2, title: 'Notification 2', description: 'This is the second notification.', content: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' },
    { id: 3, title: 'Notification 3', description: 'This is the third notification.', content: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.' },
    { id: 4, title: 'Notification 4', description: 'This is the fourth notification.', content: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.' },
    { id: 5, title: 'Notification 5', description: 'This is the fifth notification.', content: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' },
    { id: 6, title: 'Notification 6', description: 'This is the sixth notification.', content: 'Curabitur pretium tincidunt lacus.' },

  ]

  const { sheetopen, setSheetOpen } = useSheet();

  return (
    <Sheet open={sheetopen} onOpenChange={setSheetOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="bg-white"><Bell className='h-5'></Bell></Button>
      </SheetTrigger>
      <SheetContent className="bg-white ">
        <SheetHeader>
          <SheetTitle className="flex justify-center text-2xl mt-5">Notification</SheetTitle>
        </SheetHeader>
        <div className='overflow-auto flex gap-2 flex-col p-4'>
        {/* <AppAccordion></AppAccordion> */}
          {/* {notif.map((c) => (
            <Card key={c.id} className="shadow-sm border-2 border-gray-400">
              <CardHeader>
                <CardTitle className={'flex justify-between'}><p>{c.title}</p> 02/12/2020</CardTitle>
                
              </CardHeader>
                <CardContent>
                <CardDescription>{c.description}</CardDescription>
                <p className="text-sm leading-relaxed text-muted-foreground">{c.content}</p> 
                </CardContent>
            </Card>
          ))} */}
          <NotificationCard />
        </div>
        </SheetContent>
    </Sheet>
  )
}