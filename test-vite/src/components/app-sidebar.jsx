import * as React from "react"
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
  Pin,
  Search,
  ServerCogIcon,
  ServerIcon,
  Settings2,
  SquareTerminal,
  Table,
} from "lucide-react"
import { Building, Briefcase, Phone, Folder, Box, Tag, ShieldCheck, ShoppingCart, Wrench, User, HardHat, Heart, Calendar, ClipboardCheck, Hammer, Server, Barcode, CheckCircle } from 'lucide-react';
import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavRecent } from "@/components/nav-projects"
import { NavPinned } from "@/components/nav-projects"
import { NavMywork } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

 
import { ScrollArea } from "@/components/ui/scroll-area"

import { getUserFromToken } from "@/lib/utils/auth"
import { Separator } from "./ui/separator"
import { Hpicon } from "./Hpicon";

// This is sample data.
const data = {
  // user: {
  //   name: "ME",
  //   email: "m@example.com",
  //   avatar: "/avatars/shadcn.jpg",
  // },
  user: getUserFromToken(),
  teams: [
    {
      name: "HP Company",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "PT Javag",
      logo: Hpicon,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Master",
      url: "#",
      icon: Bot,
      isActive: true,
      items: [
        {
          title: "Company",
          url: "/master/Company_table",
          icon: Building
        },
        {
          title: "Assets",
          url: "/master/Assets_table",
          icon: Briefcase
        },
        {
          title: "Contact",
          url: "/master/Contact_table",
          icon: Phone
        },
        {
          title: "Case",
          url: "/master/Case_table",
          icon: Folder
        },
        {
          title: "Product",
          url: "/master/Product_table",
          icon: Box
        },
        {
          title: "Product Type",
          url: "/master/ProductType_table ",
          icon: Tag
        },
        // {
        //   title: "Service Catalog Type",
        //   url: "/master/ServiceCatalogPartsTable ",
        // },
        // {
        //   title: "Global Trade Check",
        //   url: "/master/MaterialOrder ",
        // },              
        {
          title: "Warranty Service",
          url: "/master/WarrantyService_table",
          icon: ShieldCheck
        },    
        {
          title: "Material Order",
          url: "/master/Mo_table",
          icon: ShoppingCart
        },  
        {
          title: "Work Order",
          url: "/master/Wo_table",
          icon: Wrench
        },
        {
          title: "Resource Account",
          url: "/master/ResourceAccount",
          icon: User
        },
        {
          title: "Subk Technician",
          url: "/master/SubkTechnician",
          icon: HardHat
        },
        {
          title: "Symptom Codes",
          url: "/master/symptom_codes",
          icon: Heart
        },
        {
          title: "Bookings",
          url: "/master/Bookings",
          icon: Calendar
        },
        {
          title: "Booking Details",
          url: "/master/BookingDetails",
          icon: ClipboardCheck
        },
        {
          title: "User",
          url: "/master/User_table",
          icon: User
        },  
        {
          title: "Parts",
          url: "/master/Part_table",
          icon: Hammer
        },  
        {
          title: "Resource",
          url: "/master/Resource_table",
          icon: Server
        }, 
        {
          title: "OTC Code",
          url: "/master/OTC_Code",
          icon: Barcode
        }, 
        {
          title: "Case Resolution",
          url: "/master/CrsTable",
          icon: CheckCircle,
        },
        {
          title: "Failure Code",
          url: "/master/Failure",
        },
      ],
    },
    {
      title: "Service",
      url: "#",
      icon: ServerIcon,
      items: [
        {
          title: "Case",
          url: "/Case",
        },
        {
          title: "Work Order",
          url: "/Work",
        },
        {
          title: "Material Order",
          url: "/Material_order",
        },
        // {
        //   title: "Catalog Service",
        //   url: "/CatalogService",
        // },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Home",
      title: "Home",
      url: "/",
      icon: Home,
    },
     {
      name: "Recent",
      title: "Recent",
      url: "#",
      icon: PieChart,
    },
    {
      name: "My work",
      title: "My Work",
      url: "/search_case",
      icon: Table,
    },
    {
      name: "Pinned",
      title: "Pinned",
      url: "#",
      icon: Pin
    },
  ],

  // recent: [
  //   {
  //     name: "Recent",
  //     title: "Recent",
  //     url: "#",
  //     icon: PieChart,
  //   }
  // ],

  // mywork: [
  //   {
  //     name: "My work",
  //     title: "My Work",
  //     url: "/search_case",
  //     icon: Table,
  //   }
  // ],

  // pinned: [
  //   {
  //     name: "Pinned",
  //     title: "Pinned",
  //     url: "#",
  //     icon: Pin
  //   }
  // ],
}

export function AppSidebar({
  ...props
}) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className={'bg-cyan-700'}>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavProjects projects={data.projects} />
        <Separator className={'border-2'}></Separator>
        {/* <NavRecent recent={data.recent}/>
        <NavPinned pinned={data.pinned}/>
        <NavMywork mywork={data.mywork}/> */}
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
