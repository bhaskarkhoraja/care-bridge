import * as React from "react"
import { Label } from "@web/src/components/ui/label"
import { cn } from "@web/src/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  hidden?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, hidden, ...props }, ref) => {
    return (
      <div className={cn("relative w-full", hidden ? "size-0" : "")}>
        <input
          type={type}
          className={cn(
            "border-input bg-background placeholder:text-muted-foreground focus-visible:ring-ring ring-offset-background peer flex h-10 w-full rounded-md border p-2 pt-5 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className,
            hidden
              ? "size-0 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
              : ""
          )}
          placeholder=""
          ref={ref}
          {...props}
        />
        <Label
          htmlFor={props.id}
          className={cn(
            "text-muted-foreground peer-focus:text-muted-foreground peer-focus-within:text-muted-foreground peer-focus-visible:text-muted-foreground peer-placeholder-shown:text-muted-foreground absolute start-2 top-3.5 z-10 origin-[0] translate-y-[-13px] scale-75 text-sm duration-100 peer-placeholder-shown:-translate-y-1 peer-placeholder-shown:scale-100 peer-focus:translate-y-[-13px] peer-focus:scale-75 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4",
            hidden ? "hidden" : ""
          )}
        >
          {label}
        </Label>
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
