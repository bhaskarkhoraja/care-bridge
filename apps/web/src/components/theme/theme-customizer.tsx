"use client"

import * as React from "react"
import { TooltipProvider } from "@radix-ui/react-tooltip"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@web/src/components/ui/tooltip"
import { useAccent } from "@web/src/hooks/use-accent"
import { themes } from "@web/src/lib/theme"
import { cn } from "@web/src/lib/utils"
import { useTheme } from "next-themes"

const ThemeCustomizer = () => {
  const [accent, setAccent] = useAccent()
  const { resolvedTheme: mode } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="flex w-fit items-center space-x-2">
      <div>
        <div className="mr-2 flex items-center space-x-0.5">
          {mounted ? (
            <>
              {["zinc", "rose", "blue", "green", "orange"].map((color) => {
                const theme = themes.find((theme) => theme.name === color)
                const isActive = accent === color

                if (!theme) {
                  return null
                }

                return (
                  <TooltipProvider key={theme.name}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => setAccent(theme.name)}
                          className={cn(
                            "flex size-9 items-center justify-center rounded-full border-2 text-xs",
                            isActive
                              ? "border-[--theme-primary]"
                              : "border-transparent"
                          )}
                          style={
                            {
                              "--theme-primary": `hsl(${
                                theme?.activeColor[
                                  mode === "dark" ? "dark" : "light"
                                ]
                              })`,
                            } as React.CSSProperties
                          }
                        >
                          <span
                            className={cn(
                              "flex size-6 items-center justify-center rounded-full bg-[--theme-primary]"
                            )}
                          ></span>
                          <span className="sr-only">{theme.label}</span>
                        </button>
                      </TooltipTrigger>
                      <TooltipContent
                        align="center"
                        className="rounded-lg bg-zinc-900 text-zinc-50"
                      >
                        {theme.label}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )
              })}
            </>
          ) : (
            <div className="mr-1 flex items-center gap-4">Loading</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ThemeCustomizer
