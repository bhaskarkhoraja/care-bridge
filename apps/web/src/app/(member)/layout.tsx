import { notFound } from "next/navigation"
import SiteFooter from "@web/src/components/layout/site-footer"
import SiteHeader from "@web/src/components/layout/site-header"
import { getCurrentUser } from "@web/src/lib/session"

interface MemberLayoutProps {
  children?: React.ReactNode
}

export default async function MemberLayout({ children }: MemberLayoutProps) {
  const user = await getCurrentUser()

  if (!user) {
    return notFound()
  }

  return (
    <div className="flex min-h-screen flex-col space-y-6">
      <SiteHeader />
      <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr]">
        <main className="flex w-full flex-1 flex-col overflow-hidden">
          {children}
        </main>
      </div>
      <SiteFooter className="border-t" />
    </div>
  )
}
