import { initContract } from "@ts-rest/core"
import { z } from "zod"

import {
  AdminDashBoardSchema,
  PendingActionsSchema,
  PendingMembersSchema,
  PendingUsersSchema,
} from "../types/admin"

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
    path: "/admin/pending-users",
    responses: {
      200: z.object({
        status: z.literal(true),
        message: z.union([
          z.literal("Users has been verified"),
          z.literal("Users has been rejected"),
        ]),
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
    body: PendingActionsSchema,
    summary: "Accept or reject pending users",
  },
  /**
   * Get All Pending Family Member
   **/
  getAllPendingMembers: {
    method: "GET",
    path: "/admin/pending-members",
    responses: {
      200: z.object({
        status: z.literal(true),
        data: PendingMembersSchema,
      }),
      204: z.object({
        status: z.literal(true),
        message: z.literal("No pending members found"),
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
    summary: "Get All the pending member",
  },
  /**
   * Pending member actions
   **/
  pendingMemberActions: {
    method: "POST",
    path: "/admin/pending-members",
    responses: {
      200: z.object({
        status: z.literal(true),
        message: z.union([
          z.literal("Members has been verified"),
          z.literal("Members has been rejected"),
        ]),
      }),
      422: z.object({
        status: z.literal(false),
        message: z.literal("Failed to verify members"),
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
    body: PendingActionsSchema,
    summary: "Accept or reject pending members",
  },
  /**
   * get admin dashboard
   **/
  getDashboard: {
    method: "GET",
    path: "/admin/dashboard",
    responses: {
      200: z.object({
        status: z.literal(true),
        data: AdminDashBoardSchema,
      }),
      204: z.object({
        status: z.literal(false),
        message: z.literal("Nothing to show"),
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
    summary: "Get dashborad details",
  },
})
