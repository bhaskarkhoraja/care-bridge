"use client"

import * as React from "react"
import { Button } from "@web/src/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@web/src/components/ui/dropdown-menu"
import { cn } from "@web/src/lib/utils"
import {
  Laptop2 as LaptopMinimal,
  Moon,
  MoonIcon,
  Sun,
  SunIcon,
} from "lucide-react"
import { useTheme } from "next-themes"

interface modeToggleProps {
  type: "button" | "tab"
}

const ModeToggle: React.FC<modeToggleProps> = ({ type }) => {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const { setTheme, theme } = useTheme()

  if (type === "button") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="w-9 px-0">
            <SunIcon className="size-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <MoonIcon className="absolute size-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setTheme("light")}>
            Light
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("dark")}>
            Dark
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("system")}>
            System
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <div className="bg-primary/10 flex w-fit rounded-lg p-1">
      <span className="sr-only">Toggle Dark Mode</span>
      {mounted ? (
        <div className="bg-card flex cursor-pointer rounded-sm">
          <div
            role="button"
            aria-label="Light"
            onClick={() => {
              setTheme("light")
            }}
            className={cn(
              "flex items-center gap-2  rounded-sm px-3 py-1",
              theme === "light" && "bg-primary text-primary-foreground"
            )}
          >
            <Sun className="size-5" />
            Light
          </div>
          <div
            role="button"
            aria-label="dark"
            onClick={() => {
              setTheme("dark")
            }}
            className={cn(
              "flex items-center gap-2 rounded-sm px-3 py-1",
              theme === "dark" && "bg-primary text-primary-foreground"
            )}
          >
            <Moon className="size-5" />
            Dark
          </div>
          <div
            role="button"
            aria-label="system"
            onClick={() => {
              setTheme("system")
            }}
            className={cn(
              "flex items-center gap-2 rounded-sm px-3 py-1",
              theme === "system" && "bg-primary text-primary-foreground"
            )}
          >
            <LaptopMinimal className="size-5" />
            System
          </div>
        </div>
      ) : (
        <div className="bg-primary-foreground flex h-8 w-full rounded-sm">
          <div className="rounded-sm px-3 py-1">Light</div>
          <div className="rounded-sm px-3 py-1">Dark</div>
          <div className="rounded-sm px-3 py-1">System</div>
        </div>
      )}
    </div>
  )
}

export default ModeToggle
