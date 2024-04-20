import { initContract } from "@ts-rest/core"

import { generalContract } from "./contracts/general"
import { userContract } from "./contracts/user"

const c = initContract()

const contract = c.router(
  {
    users: userContract,
    general: generalContract,
  },
  {
    strictStatusCodes: true,
  }
)

export default contract
