import * as React from "react"

import { cn } from "@/lib/utils"
import { Search } from "lucide-react"

function SearchInput({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <div className="relative w-full">
      <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input
        type="search"
        data-slot="input"
        placeholder="Search..."
        className={cn(
          "border-input text-primary-foreground file:text-foreground placeholder:primary-foreground selection:bg-blue-200 selection:text-blue-900 flex h-9 w-full min-w-0 rounded-md bg-gray-100 px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          "pl-9 rounded-2xl",
          className
        )}
        {...props} 
      />
    </div>
  )
}

export { SearchInput }
