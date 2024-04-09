"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@web/src/components/ui/button"
import { ChevronLeft } from "lucide-react"

/**
 * Back button with ChevronLeft icon
 **/
const BackButton = () => {
  const router = useRouter()

  return (
    <Button onClick={() => router.back()} variant="outline" size="sm">
      <ChevronLeft className="size-4" />
    </Button>
  )
}

export default BackButton
