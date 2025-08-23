import React from "react"
import {
    SidebarProvider,
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarFooter,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarRail,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Home, Inbox, Calendar, Search, Settings, User2, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Label } from "../ui/label"
import { Input } from "../ui/input"

export function SearchBar({
    className
}) {
    const items = [
        { title: "Serial Number", icon: Home, url: "#" },
        { title: "Company", icon: Inbox, url: "#" },
        { title: "Email", icon: Calendar, url: "#" },
        { title: "Phone", icon: Search, url: "#" },
        { title: "Id", icon: Settings, url: "#" },
    ]

    return (
        <Sidebar side="right" variant="sidebar"  className={cn("z-0", className)}>
            <SidebarHeader className={" bg-cyan-700 h-14"}>
                
            </SidebarHeader>

            <SidebarContent className={'bg-cyan-700'}>
                <SidebarGroup>
                    {/* <SidebarGroupLabel>Main</SidebarGroupLabel> */}
                    <SidebarGroupContent>
                        <SidebarMenu className={"flex flex-col gap-5 p-5"}>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title} className={"flex flex-col gap-3"}>
                                    <Label className="flex items-center gap-2 text-amber-50" htmlFor={item.title}>
                                        <item.icon />
                                        <span className="text-lg">{item.title}</span>
                                    </Label>
                                    <Input variant={'outline'} name={item.title} id={item.title} placeholder={`Search ${item.title}`} className="ml-2" />
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* <SidebarGroup>
                    <SidebarGroupLabel>Shortcuts</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton>
                                    <User2 />
                                    <span>Profile</span>
                                    <ChevronRight className="ml-auto" />
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                 */}
            </SidebarContent>
            <SidebarFooter>
                {/* <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <a href="#">
                                <User2 />
                                <span>Account</span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu> */}
            </SidebarFooter>

            {/* Mini-rail affordance when collapsed */}
            <SidebarRail />
        </Sidebar>
    )
}
