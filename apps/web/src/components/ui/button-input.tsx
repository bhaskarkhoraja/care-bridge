"use client"

import * as React from "react"
import { cn } from "@web/src/lib/utils"
import clsx from "clsx"

export interface ButtonInputProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string
}

const ButtonInput = React.forwardRef<HTMLButtonElement, ButtonInputProps>(
  ({ className, type, label, value, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <button
          className={cn(
            "border-input bg-background placeholder:text-muted-foreground focus-visible:ring-ring ring-offset-background peer flex h-10 w-full rounded-md border p-2 pt-5 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          type="button"
          {...props}
        />
        <p
          className={clsx(
            "absolute start-2 top-3.5 z-10 origin-[0] text-sm duration-100 text-muted-foreground -translate-y-1 scale-100 font-medium",
            {
              "text-muted-foreground translate-y-[-14px] scale-75": value,
            }
          )}
        >
          {label}
        </p>
        <p className="absolute left-2 top-4 text-sm">{value}</p>
      </div>
    )
  }
)
ButtonInput.displayName = "ButtonInput"

export { ButtonInput }
