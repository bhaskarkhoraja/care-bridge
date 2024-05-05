import { initContract } from "@ts-rest/core"
import { z } from "zod"

import { AddressContactFormSchema, PersonalInfoFormSchema } from "../types"
import { PendingUserActionsSchema, PendingUsersSchema } from "../types/admin"

const c = initContract()

/**
 * Admin Contract
 **/
export const adminContract = c.router({
  /**
   * Get All Pending User
   **/
  getAllPendingUsers: {
    method: "GET",
    path: "/admin/pending-users",
    responses: {
      200: z.object({
        status: z.literal(true),
        data: PendingUsersSchema,
      }),
      204: z.object({
        status: z.literal(true),
        message: z.literal("No pending users found"),
      }),
      401: z.object({
        status: z.literal(false),
        message: z.literal("User not authorized to perform this action"),
      }),
      500: z.object({
        status: z.literal(false),
        message: z.literal("Something went wrong"),
      }),
    },
    summary: "Get All the pending users",
  },
  /**
   * Pending user actions
   **/
  pendingUserActions: {
    method: "POST",
    path: "/admin/pending-users/actions",
    responses: {
      200: z.object({
        status: z.literal(true),
        message: z.literal("Users has been verified"),
      }),
      422: z.object({
        status: z.literal(false),
        message: z.literal("Failed to verify users"),
      }),
      401: z.object({
        status: z.literal(false),
        message: z.literal("User not authorized to perform this action"),
      }),
      500: z.object({
        status: z.literal(false),
        message: z.literal("Something went wrong"),
      }),
    },
    body: PendingUserActionsSchema,
    summary: "Accept or reject pending users",
  },
})
