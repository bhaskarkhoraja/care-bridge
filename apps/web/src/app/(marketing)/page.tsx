import { getCurrentUser } from "@web/src/lib/session"

export default async function Home() {
  const user = await getCurrentUser()

  if (!user) {
    return <h1>Not logged in</h1>
  }

  return <div className="w-full overflow-x-scroll">{JSON.stringify(user)}</div>
}
