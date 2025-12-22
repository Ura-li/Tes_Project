import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"
import { cva } from "class-variance-authority";

//* Test some variant styling method 
const tabsTriggerVariants = cva(
  "cursor-pointer gap-1.5 px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow]  inline-flex flex-1 items-center justifdisabled:pointer-events-none  [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",

  {
    variants: {
      variant: {
        default:
          "data-[state=active]:bg-white data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring inline-flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
	underline: [
          "rounded-none border-b-2 border-transparent px-4 py-3",
          "hover:text-foreground",
          "data-[state=active]:border-primary data-[state=active]:text-foreground",
          "transition-colors duration-300"
        ].join(" "),
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
          "data-[state=active]:bg-gray-100/40 data-[state=active]:border-l-5 border-green-300 dark:border-fuchsia-300 dark:data-[state=active]:bg-gray-800",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/40",
        ].join(" "),
	  segment: [
          "rounded-full px-4 py-2 text-slate-600 dark:text-slate-400",
          "hover:text-slate-900 dark:hover:text-slate-200",
          "data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700",
          "data-[state=active]:text-slate-950 dark:data-[state=active]:text-white",
          "data-[state=active]:shadow-[0_1px_3px_0_rgb(0,0,0,0.1),0_1px_2px_-1px_rgb(0,0,0,0.1)]", // Subtle pop
          "ease-[cubic-bezier(0.25,1,0.5,1)] duration-300", // Apple-like bouncy transition
        ].join(" "),
	  modernUnderline: [
          "relative h-10 px-2 text-center items-center justify-center", // Spacing
          "bg-transparent", 
          "text-muted-foreground hover:text-foreground", // Text colors
          
          // HOVER EFFECT: Subtle rounded background on hover
          "hover:bg-gray-100 dark:hover:bg-gray-800 rounded-t-md",
          
          // THE LINE (Pseudo-element)
          "after:absolute after:bottom-[-1px] after:left-0 after:right-0 after:h-[3px]",
          "after:bg-blue-600 dark:after:bg-blue-400", // Line Color
          "after:content-['']",
          
          // TRANSITION MAGIC: Center-out expansion
          "after:origin-center after:scale-x-0 after:transition-transform after:duration-300 after:ease-[cubic-bezier(0.4,0,0.2,1)]",
          
          // ACTIVE STATE
          "data-[state=active]:after:scale-x-100", // Expand line
          "data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400", // Active Text Color
          "data-[state=active]:font-semibold"
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

const tabsListVariants = cva(
  "inline-flex items-center justify-center rounded-lg text-muted-foreground",
  {
    variants: {
      variant: {
        default: "bg-muted p-1",
        // Modern floating dock style
        segment: "bg-slate-100/80 dark:bg-slate-800/80 p-1.5 rounded-full backdrop-blur-sm",
        // Clean line style
        underline: "bg-transparent p-0 border-b border-border w-full justify-start rounded-none",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

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
        tabsTriggerVariants({variant, size, className}),
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
