import { z } from "zod"

import {
  AddressContactFormSchema,
  ExtendedFamilyInfoFormSchema,
  ExtendedPersonalInfoFormSchema,
} from "../types"

/**
 * Array of PendingUSers
 **/
export const PendingUsersSchema = z.array(
  z.object({
    personalInfo: ExtendedPersonalInfoFormSchema,
    addressInfo: AddressContactFormSchema,
  })
)
/**
 * Schema for pending user action
 **/
export const PendingActionsSchema = z.object({
  action: z.union([z.literal("accept"), z.literal("reject")]),
  ids: z.array(z.string()),
})

/**
 * Array of PendingUSers
 **/
export const PendingMembersSchema = z.array(
  z.object({
    familyMemberInfo: ExtendedFamilyInfoFormSchema,
    userPersonalInfo: ExtendedPersonalInfoFormSchema,
  })
)

/**
 * Adimn dashboard
 **/
export const AdminDashBoardSchema = z.object({
  totalUser: z.string(),
  totalRequestCompleted: z.string(),
  totalActiveRequest: z.string(),
  totalRevenue: z.string(),
  overView: z.array(
    z.object({
      month: z.string(),
      totalMonthlyRevenue: z.number(),
    })
  ),
  recentCompletedRequest: z.array(
    z.object({
      buyerProfile: ExtendedPersonalInfoFormSchema,
      sellerProfile: ExtendedPersonalInfoFormSchema,
      price: z.string(),
    })
  ),
})
