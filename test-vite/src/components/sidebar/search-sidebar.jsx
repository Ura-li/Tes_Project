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

export function SearchBar({ filters, setFilters, className }) {
    const items = [
        { title: "SerialNumber", label: "Serial Number" },
        { title: "Company", label: "Company" },
        { title: "Email", label: "Email" },
        { title: "Phone", label: "Phone" },
        { title: "Id", label: "Case ID" },
    ];

    const handleChange = (field, value) => {
        setFilters(prev => ({ ...prev, [field]: value }));
    };

    return (
        <Sidebar side="right" variant="sidebar" className={cn("z-0", className)}>
            {/* <SidebarHeader className="bg-cyan-700 h-14" /> */}

            <SidebarContent className="mt-10 bg-gradient-to-br from-hp-200 to-hp-400">
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu className="flex flex-col gap-5 p-3">
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title} className="flex flex-col gap-3">
                                    <Label className="flex items-center gap-2 text-amber-50" htmlFor={item.title}>
                                        <span className="text-lg">{item.label}</span>
                                    </Label>
                                    <Input
                                        id={item.title}
                                        value={filters[item.title] || ""}
                                        onChange={(e) => handleChange(item.title, e.target.value)}
                                        placeholder={`Search ${item.label}`}
                                        className="ml-2"
                                    />
                                </SidebarMenuItem>
                            ))}

                            {/* Dropdown filters */}
                            <SidebarMenuItem className="flex flex-col gap-3">
                                <Label className="text-amber-50">Case Status</Label>
                                <select
                                    value={filters.Status}
                                    onChange={(e) => handleChange("Status", e.target.value)}
                                    className="p-2 rounded-md"
                                >
                                    <option value="">All</option>
                                    <option value="Open">Open</option>
                                    <option value="InActive">InActive</option>
                                    <option value="On Hold">On Hold</option>
                                    <option value="Escalated">Escalated</option>
                                </select>
                            </SidebarMenuItem>

                            <SidebarMenuItem className="flex flex-col gap-3">
                                <Label className="text-amber-50">Case Type</Label>
                                <select
                                    value={filters.Type}
                                    onChange={(e) => handleChange("Type", e.target.value)}
                                    className="p-2 rounded-md"
                                >
                                    <option value="">All</option>
                                    <option value="Hardware">Hardware</option>
                                    <option value="Software">Software</option>
                                    <option value="Warranty">Warranty</option>
                                </select>
                            </SidebarMenuItem>
                            <SidebarMenuItem className="flex flex-col gap-3">
                                <Label className="text-amber-50">Case Holder</Label>
                                <select
                                    value={filters.Role}
                                    onChange={(e) => handleChange("Role", e.target.value)}
                                    className="p-2 rounded-md"
                                >
                                    <option value="">All</option>
                                    <option value="Owner">Case Owner</option>
                                    <option value="CreatedBy">Case Created</option>
                                </select>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            {/* <SidebarFooter /> */}
            <SidebarRail />
        </Sidebar>
    );
}

