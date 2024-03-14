"use client"

import * as React from "react"
import { useAccent } from "@web/src/hooks/use-accent"

const ThemeSwitcher = () => {
  const [accent] = useAccent()

  React.useEffect(() => {
    document.body.classList.forEach((className) => {
      if (className.match(/^theme.*/)) {
        document.body.classList.remove(className)
      }
    })

    return document.body.classList.add(`theme-${accent}`)
  }, [accent])

  return null
}

export default ThemeSwitcher
