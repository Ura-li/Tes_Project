import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"

import { cn } from "@/lib/utils"
import { cva } from "class-variance-authority";

const labelVariants = cva(
  "flex items-center gap-2 text-sm leading-none font-medium  group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
  // "block text-neutral-700 text-sm font-medium leading-tight mb-2",
  {
    variants: {
      variant: {
        default: "text-neutral-800 dark:text-neutral-200",
        primary: "text-blue-600 font-semibold",
        error: "text-red-500 font-semibold",
        hidden: "sr-only", // For accessibility purposes (screen reader only)
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);


function Label({
  className,
  variant,
  ...props
}) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(labelVariants({ variant, className }))} 
      {...props} />
  );
}

export { Label }
