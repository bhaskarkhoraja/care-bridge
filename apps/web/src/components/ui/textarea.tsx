import * as React from "react"
import { Label } from "@web/src/components/ui/label"
import { cn } from "@web/src/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <textarea
          className={cn(
            "border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring peer flex min-h-[80px] w-full rounded-md border p-2 pt-5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          placeholder=""
          ref={ref}
          {...props}
        />
        <Label
          htmlFor={props.id}
          className="text-muted-foreground peer-focus:text-muted-foreground peer-focus-within:text-muted-foreground peer-focus-visible:text-muted-foreground peer-placeholder-shown:text-muted-foreground bg-background absolute start-2 top-3.5 z-10 w-[125%] origin-[0] translate-y-[-15.5px] scale-75 pt-[2px] text-sm duration-100 peer-placeholder-shown:w-11/12 peer-placeholder-shown:-translate-y-1 peer-placeholder-shown:scale-100 peer-placeholder-shown:pt-0 peer-focus:w-[125%] peer-focus:translate-y-[-15.5px] peer-focus:scale-75 peer-focus:pt-[2px] rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4"
        >
          {label}
        </Label>
      </div>
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
