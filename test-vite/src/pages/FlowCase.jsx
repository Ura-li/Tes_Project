import { SearchBar } from '@/components/sidebar/search-sidebar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Sidebar, SidebarContent, SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import React from 'react'



export const FlowCase = () => {
  const cards = Array.from({ length: 9 }).map((_, i) => ({
    id: i + 1,
    title: `Card ${i + 1}`,
    description: "Small description for this card.",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero.",
  }))

  return (
    <SidebarProvider defaultOpen>

      <SidebarInset>
        <div className="min-h-screen flex flex-col w-full">
          <div className="sticky top-13  border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 ">
            <div className="mx-auto flex h-14 w-full max-w-7xl items-center gap-3 px-4 justify-between">
              <div className=" flex items-center gap-2">
                <Button size="sm" variant="outline">Action</Button>
                <Button size="sm">Primary</Button>
              </div>
              <h1 className="text-xl font-semibold tracking-tight">Case For You</h1>
              <SidebarTrigger />
            </div>
          </div>
          <section className="mx-auto w-full max-w-7xl p-4 md:p-6">
            <div className="grid grid-cols-1 gap-4 ">
              {cards.map((c) => (
                <Card key={c.id} className="shadow-sm">
                  <CardHeader>
                    <CardTitle>{c.title}</CardTitle>
                    <CardDescription>{c.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed text-muted-foreground">{c.content}</p>
                  </CardContent>
                  <CardFooter className="justify-end">
                    <Button size="sm" variant="outline">Details</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </SidebarInset>
        <SearchBar />

    </SidebarProvider>
  )
}
