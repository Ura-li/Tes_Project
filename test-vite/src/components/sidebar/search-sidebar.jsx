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
import { STATUS_ENUM_TO_LABEL, STATUS_LABELS } from "@/pages/CaseDetail"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import DatePicker from "../date-picker"

export function SearchBar({ filters, setFilters, className, caseData, filterClose, dataTime }) {
    const items = [
        { title: "SerialNumber", label: "Serial Number" },
        { title: "Company", label: "Company" },
        { title: "Email", label: "Email" },
        { title: "Phone", label: "Phone" },
        { title: "Id", label: "Case ID" },
    ];
    const timeRanges = [
        { key: "within4", label: "1–3" },
        { key: "within8", label: "4–7" },
        { key: "within15", label: "8–15" },
        { key: "over15", label: ">15" },
    ];

    

    const handleChange = (field, value) => {
        setFilters(prev => ({ ...prev, [field]: value }));
    };

    // const dataTime = [
    //     {
    //         status: "Finish Repair",
    //         data: {
    //             within4: [],
    //             within8: [],
    //             within15: [],
    //             over15: [],
    //         }
    //     },
    //     {
    //         status: "NEW_POPDoc",
    //         data: {
    //             within4: [],
    //             within8: [],
    //             within15: [],
    //             over15: [],
    //         }
    //     },
    //     {
    //         status: "Close",
    //         data: {
    //             within4: [],
    //             within8: [],
    //             within15: [],
    //             over15: [],
    //         },
    //         hide: filterClose
    //     },
    // ]


    
    // const getDaysAgo = (val) => {
    //     const date = val ? (val instanceof Date ? val : new Date(val)) : null;
    //     if (!date || isNaN(date)) return Infinity;
    //     return Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
    // };
    // let groupedDataTime = [];

    // if (caseData) {
    //     groupedDataTime = dataTime.map((t) => {
    //         const filt = caseData.filter((data) =>
    //             data.UpdatedActionLogs[0]?.dataNew === t.status
    //         );

    //         const groupedCases = {
    //             within4: [],
    //             within8: [],
    //             within15: [],
    //             over15: [],
    //         };

    //         filt.forEach((c) => {
    //             const days = getDaysAgo(c.UpdateOn);
    //             if (days <= 4) groupedCases.within4.push(c);
    //             else if (days <= 8) groupedCases.within8.push(c);
    //             else if (days <= 15) groupedCases.within15.push(c);
    //             else groupedCases.over15.push(c);
    //         });

    //         t.data = groupedCases;
    //     });
    // }

    return (
        <Sidebar side="right" variant="sidebar" className={cn("z-10 top-16 h-full", className)}>
            <Tabs defaultValue="search" className="w-full">

                <SidebarHeader className="bg-cyan-700 h-14" >
                    <TabsList className={'w-full'}>
                        <TabsTrigger value="search" className="w-full justify-center">Search </TabsTrigger>
                        <TabsTrigger value="Time" className="w-full justify-center">Time </TabsTrigger>
                    </TabsList>
                </SidebarHeader>
                <TabsContent value="search" className={'max-h-[calc(100vh-8rem)] overflow-y-auto'}>

                    <SidebarContent className=" ">
                        <SidebarGroup>
                            <SidebarGroupContent>
                                <SidebarMenu className="flex flex-col gap-3 p-3">
                                    {items.map((item) => (
                                        <SidebarMenuItem key={item.title} className="flex flex-col gap-3">
                                            <Label className="font-semibold flex items-center gap-2 text-gray-500 text-md" htmlFor={item.title}>
                                                {item.label}
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
                                        <Label className="text-gray-500">Case Status</Label>
                                        <select
                                            value={filters.Status}
                                            onChange={(e) => handleChange("Status", e.target.value)}
                                            className="p-2 rounded-md"
                                        >
                                            <option value="">All</option>
                                            {STATUS_LABELS.map((status) => (
                                                <option key={status} value={status}>
                                                    {status}
                                                </option>
                                            ))}
                                        </select>
                                    </SidebarMenuItem>

                                    <SidebarMenuItem className="flex flex-col gap-3">
                                        <Label className="text-gray-500">Case Type</Label>
                                        <select
                                            value={filters.Type}
                                            onChange={(e) => handleChange("Type", e.target.value)}
                                            className="p-2 rounded-md"
                                        >
                                            <option value="">All</option>
                                            <option value="Bench">Bench</option>
                                            <option value="Onsite">Onsite</option>
                                        </select>
                                    </SidebarMenuItem>
                                    <SidebarMenuItem className="flex flex-col gap-3">
                                        <Label className="text-gray-500">Case Holder</Label>
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
                                    <SidebarMenuItem className="flex flex-col gap-3">
                                        <Label className="text-gray-500">Range Time</Label>
                                        <DatePicker 
                                            value={filters.RangeTime}
                                            onChange={(val) => handleChange("RangeTime",val)}
                                            variant="Date"
                                            mode="range"
                                        />
                                    </SidebarMenuItem>
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    </SidebarContent>
                </TabsContent>

                <TabsContent value="Time">
                    <SidebarContent className=" p-2">
                        {dataTime?.map((e, idx) => ( 
                            <SidebarGroup key={e.status} hidden={e.hide}>
                                <SidebarGroupContent className={''}>
                                    <Table className={''}>
                                        <TableHeader>
                                            <TableRow className={'col-span-5'}>
                                                <TableHead className={'text-center font-semibold text-black text-[15px] ring-4 ring-teal-500'} colSpan={5}>
                                                    {STATUS_ENUM_TO_LABEL[e.status]}
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            <TableRow className={'border-y-2'}>
                                                <TableHead className={''}> 1-3 </TableHead>
                                                <TableHead className={''}> 4-7  </TableHead>
                                                <TableHead className={''}> 8-15  </TableHead>
                                                <TableHead className={''}> &gt; 15  </TableHead>
                                            </TableRow>
                                            <TableRow>
                                                {/* <TableCell className={'p-2'} onClick={''}>{dataTime[idx]?.data?.within4?.length || ''}</TableCell>
                                                <TableCell className={'p-2'} onClick={''}>{dataTime[idx]?.data?.within8?.length || ''} </TableCell>
                                                <TableCell className={'p-2'} onClick={''}>{dataTime[idx]?.data?.within15?.length || ''} </TableCell>
                                                <TableCell className={'p-2'} onClick={''}>{dataTime[idx]?.data?.over15?.length || ''} </TableCell> */}
                                                {["within4","within8","within15","over15"].map((key) => (
                                                    <TableCell
                                                        key={key}
                                                        className={cn(
                                                             "p-2 text-center cursor-pointer hover:bg-teal-100",
                                                             filters.Status === e.status && filters.TimeLength === key && "bg-teal-300"
                                                        )}
                                                        onClick={() => {
                                                            const sameClick = filters.Status === e.status && filters.TimeLength === key;
                                                            if (sameClick) {
                                                                handleChange("Status", "");
                                                                handleChange("TimeLength", "");
                                                            }else {
                                                             handleChange("Status", e.status);
                                                             handleChange("TimeLength", key);
                                                            }
                                                        }}
                                                    >
                                                        {dataTime[idx]?.data?.[key]?.length || 0}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </SidebarGroupContent>
                            </SidebarGroup>
                            
                        ))}
                        {/* {groupedDataTime?.map((group, idx) => (
                            <div key={group.status}>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead
                                                colSpan={5}
                                                className="text-center font-semibold text-black text-[15px] ring-4 ring-teal-500"
                                            >
                                                {group.status}
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>

                                    <TableBody>
                                        <TableRow>
                                            {timeRanges.map((r) => (
                                                <TableHead key={r.key} className="text-center">
                                                    {r.label}
                                                </TableHead>
                                            ))}
                                        </TableRow>

                                        <TableRow>
                                            {timeRanges.map((r) => (
                                                <TableCell
                                                    key={r.key}
                                                    className={cn(
                                                        "p-2 text-center cursor-pointer hover:bg-teal-100",
                                                        filters.TimeLength === r.key && "bg-teal-200 font-semibold"
                                                    )}
                                                    onClick={() => handleChange("TimeLength", filters.TimeLength === r.key ? "" : r.key)}
                                                >
                                                    {group.data?.[r.key]?.length || 0}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </div>
                        ))} */}

                        <SidebarGroup hidden={!filterClose}>
                            <SidebarGroupContent className={'italic text-center text-gray-500'}>
                                == Closed Case Data Hidden ==
                            </SidebarGroupContent>
                        </SidebarGroup>

                    </SidebarContent>
                </TabsContent>
            </Tabs>

            <SidebarFooter />
            <SidebarRail />
        </Sidebar>
    );
}

