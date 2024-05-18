import React from "react"
import { Card } from "@web/src/components/ui/card"
import { Skeleton } from "@web/src/components/ui/skeleton"

const SettingContentShimmer = () => {
  return (
    <Skeleton className="rounded-lg">
      <Card className="p-4">
        <div className="bg-primary/10 h-10 w-full rounded-lg"></div>
      </Card>
    </Skeleton>
  )
}

export default SettingContentShimmer
