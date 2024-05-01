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
    <>
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </>
  )
}
