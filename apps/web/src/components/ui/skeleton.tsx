import { cn } from "@web/src/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "before:border-primary/10 before:via-primary/15 relative space-y-5 overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:border-t before:bg-gradient-to-r before:from-transparent before:to-transparent",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
