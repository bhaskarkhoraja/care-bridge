import { trpc } from "@web/src/app/trpc"

import ClientSide from "../components/ClientSide"

export default async function Home() {
  /* const { greeting } = await trpc.hello.query({ name: `Tom` }) */
  return (
    <div>
      {/* {greeting} <ClientSide /> */}
      hello
    </div>
  )
}
