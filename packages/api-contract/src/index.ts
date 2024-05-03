import { initContract } from "@ts-rest/core"

import { familyContract } from "./contracts/family-member"
import { generalContract } from "./contracts/general"
import { userContract } from "./contracts/user"

const c = initContract()

const contract = c.router(
  {
    general: generalContract,
    users: userContract,
    family: familyContract,
  },
  {
    strictStatusCodes: true,
  }
)

export default contract
