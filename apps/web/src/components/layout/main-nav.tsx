import * as React from "react"
import Link from "next/link"
import { Icons } from "@web/src/components/icons"

const MainNav = () => {
  return (
    <div className="mr-4 hidden md:flex">
      <Link href="/" className="mr-6 flex items-center space-x-2">
        <Icons.logofull className="h-8 w-fit" />
      </Link>
    </div>
  )
}
export default MainNav
