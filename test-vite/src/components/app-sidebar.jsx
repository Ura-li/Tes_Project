import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Eye,
  FileCog,
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
  Slice,
  SquareTerminal,
  Stamp,
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
import { Javagicon } from "./Javagicon";
import { useDraft } from "./DraftContext";



// This is sample data.

export function AppSidebar({
  ...props
}) {
  const { drafts } = useDraft();
  const data = {
    // user: {
    //   name: "ME",
    //   email: "m@example.com",
    //   avatar: "/avatars/shadcn.jpg",
    // },
    user: getUserFromToken(),
    teams: [
      {
        name: "PT Javag",
        logo: Javagicon,
        plan: "Service Center",
      },
      {
        name: "HP Company",
        logo: Hpicon,
        plan: "Main Company",
      },
      // {
      //   name: "Evil Corp.",
      //   logo: Command,
      //   plan: "Free",
      // },
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
            url: "/app/master/Company_table",
            icon: Building
          },
          {
            title: "Assets",
            url: "/app/master/Assets_table",
            icon: Briefcase
          },
          {
            title: "Contact",
            url: "/app/master/Contact_table",
            icon: Phone
          },
          {
            title: "Case",
            url: "/app/master/Case_table",
            icon: Folder
          },
          {
            title: "Product",
            url: "/app/master/Product_table",
            icon: Box
          },
          {
            title: "Product Type",
            url: "/app/master/ProductType_table ",
            icon: Tag
          },
          // {
          //   title: "Service Catalog Type",
          //   url: "/app/master/ServiceCatalogPartsTable ",
          // },
          // {
          //   title: "Global Trade Check",
          //   url: "/app/master/MaterialOrder ",
          // },              
          {
            title: "Warranty Service",
            url: "/app/master/WarrantyService_table",
            icon: ShieldCheck
          },    
          {
            title: "Material Order",
            url: "/app/master/Mo_table",
            icon: ShoppingCart
          },  
          {
            title: "Work Order",
            url: "/app/master/Wo_table",
            icon: Wrench
          },
          {
            title: "Resource Account",
            url: "/app/master/ResourceAccount",
            icon: User
          },
          {
            title: "Subk Technician",
            url: "/app/master/SubkTechnician",
            icon: HardHat
          },
          {
            title: "Symptom Codes",
            url: "/app/master/symptom_codes",
            icon: Heart
          },
          {
            title: "Bookings",
            url: "/app/master/Bookings",
            icon: Calendar
          },
          {
            title: "Booking Details",
            url: "/app/master/BookingDetails",
            icon: ClipboardCheck
          },
          {
            title: "User",
            url: "/app/master/User_table",
            icon: User
          },  
          {
            title: "Parts",
            url: "/app/master/Part_table",
            icon: Hammer
          },  
          {
            title: "Resource",
            url: "/app/master/Resource_table",
            icon: Server
          }, 
          {
            title: "Repair Class Code",
            url: "/app/master/repairClassCode",
            icon: Slice
          }, 
          {
            title: "Service Catalog",
            url: "/app/master/ServiceCatalog",
            icon: Stamp
          },
          {
            title: "OTC Code",
            url: "/app/master/OTC_Code",
            icon: Barcode
          }, 
          {
            title: "Case Resolution",
            url: "/app/master/CrsTable",
            icon: CheckCircle,
          },
          {
            title: "Failure Code",
            url: "/app/master/Failure",
            icon: FileCog
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
            url: `/app/Case/${drafts.caseId}`,
          },
          {
            title: "Work Order",
            url: `/app/work/${drafts.woid}`,
          },
          {
            title: "Material Order",
            url: `/app/material_order/${drafts.moid}`,
          },
          {
            title: "MO Line Item",
            url: `/app/material_order/material-order-line-items/${drafts.moliId}`,
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
        hidden: true,
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
        hidden: true,
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
        url: "/app",
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
        url: "/app/search_case",
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
