import { initContract } from "@ts-rest/core"
import { z } from "zod"

import { MessageSchema, SenderDetailsSchema, SideMessageSchema } from "../types"

const c = initContract()

/**
 * Message Contract
 **/
export const messageContract = c.router({
  /**
   * Get All messages for side bar
   **/
  getAllMessages: {
    method: "GET",
    path: "/user/message",
    responses: {
      200: z.object({
        status: z.literal(true),
        data: z.array(SideMessageSchema),
      }),
      204: z.object({
        status: z.literal(true),
        message: z.literal("No messages found"),
      }),
      500: z.object({
        status: z.literal(false),
        message: z.literal("Something went wrong"),
      }),
    },
    query: z.object({
      status: z.enum(["open", "close", "spam"]),
    }),
    summary: "Get all message users",
  },
  /**
   * Get specific user's message
   **/
  getMessage: {
    method: "GET",
    path: "/user/message/:id",
    responses: {
      200: z.object({
        status: z.literal(true),
        data: z.array(MessageSchema),
      }),
      204: z.object({
        status: z.literal(true),
        message: z.literal("No messages found"),
      }),
      500: z.object({
        status: z.literal(false),
        message: z.literal("Something went wrong"),
      }),
    },
    summary: "Get specific user's message",
  },
  /**
   * Sender Details
   **/
  getSenderDetails: {
    method: "GET",
    path: "/user/message/sender/:id",
    responses: {
      200: z.object({
        status: z.literal(true),
        data: SenderDetailsSchema,
      }),
      204: z.object({
        status: z.literal(true),
        message: z.literal("No user found"),
      }),
      500: z.object({
        status: z.literal(false),
        message: z.literal("Something went wrong"),
      }),
    },
    summary: "Get sender details",
  },
  /**
   * Update message status
   **/
  markMessages: {
    method: "PATCH",
    path: "/user/message/mark",
    responses: {
      200: z.object({
        status: z.literal(true),
        message: z.literal("Successfully marked message"),
      }),
      422: z.object({
        status: z.literal(false),
        message: z.literal("Failed to mark message"),
      }),
      500: z.object({
        status: z.literal(false),
        message: z.literal("Something went wrong"),
      }),
    },
    body: z.object({
      senderId: z.string(),
      status: z.enum(["open", "close", "spam"]),
    }),
    summary: "Update message status to open, close or spam",
  },
})
