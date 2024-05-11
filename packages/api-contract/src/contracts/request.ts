import { initContract } from "@ts-rest/core"
import { z } from "zod"

import { ExtendedRequestSchema, RequestSchema } from "../types/request"

const c = initContract()

/**
 * Request contracts
 **/
export const requestContract = c.router({
  /**
   * Add request
   **/
  createRequest: {
    method: "POST",
    path: "/user/request/add",
    responses: {
      200: z.object({
        status: z.literal(true),
        message: z.literal("Request updated successfully"),
      }),
      422: z.object({
        status: z.literal(false),
        message: z.literal("Failed to update request."),
      }),
      500: z.object({
        status: z.literal(false),
        message: z.literal("Something went wrong"),
      }),
    },
    body: RequestSchema,
    summary: "Create a request by buyer",
  },
  /**
   * Get all sellers request
   **/
  getMyRequest: {
    method: "GET",
    path: "/user/request",
    responses: {
      200: z.object({
        status: z.literal(true),
        data: z.array(RequestSchema),
      }),
      204: z.object({
        status: z.literal(true),
        message: z.literal("No requests found"),
      }),
      500: z.object({
        status: z.literal(false),
        message: z.literal("Something went wrong"),
      }),
    },
    summary: "Get all request by seller",
  },
  /**
   * Get specific requset
   **/
  getRequest: {
    method: "GET",
    path: "/user/request/:id",
    responses: {
      200: z.object({
        status: z.literal(true),
        data: ExtendedRequestSchema,
      }),
      204: z.object({
        status: z.literal(true),
        message: z.literal("No requests found"),
      }),
      500: z.object({
        status: z.literal(false),
        message: z.literal("Something went wrong"),
      }),
    },
    summary: "Get specific request",
  },
  /**
   * Get request for seller
   **/
  getRequestForSeller: {
    method: "GET",
    path: "/user/seller/request",
    responses: {
      200: z.object({
        status: z.literal(true),
        data: z.array(RequestSchema),
      }),
      204: z.object({
        status: z.literal(true),
        message: z.literal("No requests found"),
      }),
      500: z.object({
        status: z.literal(false),
        message: z.literal("Something went wrong"),
      }),
    },
    summary: "Get request for seller",
  },
})
