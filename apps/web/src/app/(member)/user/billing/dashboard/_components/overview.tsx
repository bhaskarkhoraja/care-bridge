"use client"

import { UserDashBoardSchema } from "node_modules/api-contract/dist/types/user.mjs"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { z } from "zod"

interface OverviewProps {
  data: z.infer<typeof UserDashBoardSchema>["overView"]
}

const Overview: React.FC<OverviewProps> = ({ data }) => {
  return (
    <>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data}>
          <XAxis
            dataKey="month"
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value}`}
          />
          <Bar
            dataKey="paid"
            fill="currentColor"
            radius={[4, 4, 0, 0]}
            className="fill-foreground"
          />
          <Bar
            dataKey="recieved"
            fill="currentColor"
            radius={[4, 4, 0, 0]}
            className="fill-background stroke-foreground/40"
          />
        </BarChart>
      </ResponsiveContainer>
      <div className="flex items-center justify-center gap-4">
        <div className="flex items-center gap-2">
          <div className="bg-foreground size-4 rounded-sm"></div>
          <p>Paid</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="border-foreground size-4 rounded-sm border"></div>
          <p>Recieved</p>
        </div>
      </div>
    </>
  )
}

export default Overview
