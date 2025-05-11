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
      name: "Acme Corp.",
      logo: AudioWaveform,
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
        },
        {
          title: "Assets",
          url: "/master/Assets_table",
        },
        {
          title: "Contact",
          url: "/master/Contact_table",
        },
        {
          title: "Case",
          url: "/master/Case_table",
        },
        {
          title: "Product",
          url: "/master/Product_table",
        },
        {
          title: "Product Type",
          url: "/master/ProductType_table ",
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
        },    
        {
          title: "Material Order",
          url: "/master/Mo_table",
        },  
        {
          title: "Work Order",
          url: "/master/Wo_table",
        },
        {
          title: "Resource Account",
          url: "/master/ResourceAccount",
        },
        {
          title: "Subk Technician",
          url: "/master/SubkTechnician",
        },
        {
          title: "Symptom Codes",
          url: "/master/symptom_codes",
        },
        {
          title: "Bookings",
          url: "/master/Bookings",
        },
        {
          title: "Booking Details",
          url: "/master/BookingDetails",
        },
        {
          title: "User",
          url: "/master/User_table",
        },  
        {
          title: "Parts",
          url: "/master/Part_table",
        },  
        {
          title: "Resource",
          url: "/master/Resource_table",
        }, 
        {
          title: "OTC Code",
          url: "/master/OTC_Code",
        }, 
        {
          title: "Case Resolution",
          url: "/master/CrsTable",
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
      url: "/",
      icon: Home,
    },
  ],

  recent: [
    {
      name: "Recent",
      url: "#",
      icon: PieChart,
    }
  ],

  mywork: [
    {
      name: "My work",
      url: "/search_case",
      icon: Table,
    }
  ],

  pinned: [
    {
      name: "Pinned",
      url: "#",
      icon: Pin
    }
  ],
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
        <NavRecent recent={data.recent}/>
        <NavPinned pinned={data.pinned}/>
        <NavMywork mywork={data.mywork}/>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
