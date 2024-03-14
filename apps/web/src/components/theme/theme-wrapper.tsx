"use client"

import { useAccent } from "@web/src/hooks/use-accent"
import { cn } from "@web/src/lib/utils"

interface ThemeWrapperProps extends React.ComponentProps<"div"> {
  defaultTheme?: string
}

const ThemeWrapper = ({ children, className }: ThemeWrapperProps) => {
  const [accent] = useAccent()

  return <div className={cn(`theme-${accent}`, className)}>{children}</div>
}

export default ThemeWrapper
