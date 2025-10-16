import * as React from "react"

import { cn } from "@/lib/utils"
import { cva } from "class-variance-authority";

const inputVariants = cva(
  "border-input file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        default:
          "border-0 border-input border-b-2 file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex h-9 w-full min-w-0 bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
        outline:
          "border border-input bg-background shadow-xs hover:bg-accent hover:text-accent-foreground",
        invisible:
          "border-0 bg-transparent shadow-none hover:bg-accent hover:text-accent-foreground focus:ring-1",
          // border-b-0 shadow-none ring-0 focus:ring-1
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Input({
  className,
  type,
  value,
  variant,
  ...props
}) {
  const safeValue = value === null || value === undefined ? "" : value;
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(inputVariants({ variant, className }))}
      value={type !== 'file' ? safeValue : value}
      {...props} />
  );
}

export { Input }
