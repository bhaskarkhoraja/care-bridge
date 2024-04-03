import { authOptions } from "@web/src/lib/auth"
import { getServerSession } from "next-auth/next"

/**
 * Get current logged in user
 **/
export async function getCurrentUser() {
  const session = await getServerSession(authOptions)

  return session?.user
}
