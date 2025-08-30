import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { BadgeAlert, Bell } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { useSheet } from '@/context/sheet-context'
import { NotificationCard } from './NotificationCard'
// import { AppAccordion } from './app-accordion'
 
export function SheetBar({
}) {

  const { sheetopen, setSheetOpen } = useSheet();

  return (
    <Sheet open={sheetopen} onOpenChange={setSheetOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="bg-white"><Bell className='h-5'></Bell></Button>
      </SheetTrigger>
      <SheetContent className="bg-white ">
        <SheetHeader>
          <SheetTitle className="flex justify-center text-2xl mt-5">Notification</SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>
        <div className='overflow-auto flex gap-2 flex-col p-4'>
   
          <NotificationCard />
        </div>
        </SheetContent>
    </Sheet>
  )
}