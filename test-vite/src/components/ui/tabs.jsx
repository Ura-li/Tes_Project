import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"
import { cva } from "class-variance-authority";

//* Test some variant styling method 
const tabsVariants = cva(
  "cursor-pointer gap-1.5 px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow]  inline-flex flex-1 items-center justifdisabled:pointer-events-none  [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",

  {
    variants: {
      variant: {
        default:
          "data-[state=active]:bg-white data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring inline-flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        underline:
          "data-[state=active]: data-[state=active]:border-b-4 border-b-blue-500 px-1.5 py-3 font-semibold text-black",
        fullsize:
          "rounded-none data-[state=active]:bg-gray-300 p-5 hover:bg-gray-100",
        simple:
          " data-[state=active]:border-b-4 border-b-blue-500 px-1.5 py-3 font-semibold text-black text-center justify-center",
        underline2:
          "data-[state=active]: data-[state=active]:border-b-5 border-b-blue-900 px-1.5 py-3 font-semibold text-white",
        cleanPill: [
          "relative z-10",
          "flex-1 justify-center rounded-xl",
          "px-3 py-3 text-sm font-semibold",
          "text-slate-800/80 dark:text-slate-200/80",
          "transition-all duration-200",
          "hover:text-slate-950 dark:hover:text-white",
          "hover:bg-white/20 dark:hover:bg-white/5",
          "data-[state=active]:text-slate-950 dark:data-[state=active]:text-white",
          // keep active clean — pill already indicates active
          "data-[state=active]:bg-gray-100/40 data-[state=active]:border-l-5 border-green-300 dark:border-fuchsia-300 dark:data-[state=active]:bg-gray-800",
          // accessible focus (subtle, not a loud ring)
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/40",
        ].join(" "),
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "",
    },
  }
);

function Tabs({
  className,
  ...props
}) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-2", className)}
      {...props} />
  );
}

function TabsList({
  className,
  ...props
}) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-1",
        className
      )}
      {...props} />
  );
}

function TabsTrigger({
  className,
  variant,
  size,
  disabled,
  ...props
}) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        tabsVariants({variant, size, className}),
        disabled && "cursor-not-allowed opacity-50"
      )}
      disabled={disabled}
      {...props}
    />
  );
}

function TabsContent({
  className,
  ...props
}) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props} />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
