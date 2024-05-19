"use client"

import { AdminDashBoardSchema } from "node_modules/api-contract/dist/types/admin.mjs"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { z } from "zod"

interface OverviewProps {
  data: z.infer<typeof AdminDashBoardSchema>["overView"]
}

const Overview: React.FC<OverviewProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data} layout="horizontal">
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
          dataKey="totalMonthlyRevenue"
          fill="currentColor"
          radius={[4, 4, 0, 0]}
          className="fill-primary"
        />
      </BarChart>
    </ResponsiveContainer>
  )
}

export default Overview
