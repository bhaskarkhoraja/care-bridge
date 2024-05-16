import { initContract } from "@ts-rest/core"

import { adminContract } from "./contracts/admin"
import { familyContract } from "./contracts/family-member"
import { generalContract } from "./contracts/general"
import { messageContract } from "./contracts/message"
import { requestContract } from "./contracts/request"
import { userContract } from "./contracts/user"

const c = initContract()

const contract = c.router(
  {
    general: generalContract,
    users: userContract,
    family: familyContract,
    admin: adminContract,
    request: requestContract,
    message: messageContract,
  },
  {
    strictStatusCodes: true,
  }
)

export default contract
