import { getAdminDashboard } from "@web/src/actions/admin"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@web/src/components/ui/card"

import Overview from "./_components/overview"
import RecentSales from "./_components/recent-sales"

export default async function AdminDashboard() {
  const dashboardData = await getAdminDashboard()

  if (dashboardData.status !== 200) {
    return (
      <main className="w-full">
        <h1 className="mb-4 text-2xl font-bold leading-none">
          All your accepted requests
        </h1>

        <p className="text-muted-foreground text-sm">
          {dashboardData.body.message || "Nothing to show"}
        </p>
      </main>
    )
  }

  return (
    <main className="w-full">
      <div className="flex flex-col">
        <div className="flex-1 space-y-4 pt-0">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="col-span-4 grid grid-cols-2 gap-4 lg:col-span-1 lg:block lg:gap-0 lg:space-x-0 lg:space-y-1">
              <Card className="col-span-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Revenue
                  </CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="text-muted-foreground size-4"
                  >
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${dashboardData.body.data.totalRevenue}
                  </div>
                </CardContent>
              </Card>
              <Card className="col-span-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Users</CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="text-muted-foreground size-4"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {dashboardData.body.data.totalUser}
                  </div>
                </CardContent>
              </Card>
              <Card className="col-span-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Request Completed
                  </CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="text-muted-foreground size-4"
                  >
                    <rect width="20" height="14" x="2" y="5" rx="2" />
                    <path d="M2 10h20" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {dashboardData.body.data.totalRequestCompleted}
                  </div>
                </CardContent>
              </Card>
              <Card className="col-span-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active Request
                  </CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="text-muted-foreground size-4"
                  >
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {dashboardData.body.data.totalActiveRequest}
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="col-span-4 lg:col-span-3">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Overview</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <Overview data={dashboardData.body.data.overView} />
                </CardContent>
              </Card>
            </div>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Recent Completed Request</CardTitle>
              <CardDescription>
                You made {dashboardData.body.data.recentCompletedRequest.length}{" "}
                sales this month.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <RecentSales
                data={dashboardData.body.data.recentCompletedRequest}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
