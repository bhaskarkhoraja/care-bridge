import { initContract } from "@ts-rest/core"
import { z } from "zod"

import { ExtendedPersonalInfoFormSchema } from "../types"
import {
  ExtendedRequestSchema,
  RequestSchema,
  RequestWithPaidStatus,
} from "../types/request"

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
  /**
   * Apply for request
   **/
  applyForRequest: {
    method: "POST",
    path: "/user/seller/apply",
    responses: {
      200: z.object({
        status: z.literal(true),
        message: z.literal("Application has been submitted"),
      }),
      204: z.object({
        status: z.literal(true),
        message: z.literal("No such requests found"),
      }),
      500: z.object({
        status: z.literal(false),
        message: z.literal("Something went wrong"),
      }),
    },
    body: z.object({
      requestId: z.string(),
    }),
    summary: "Apply for request",
  },
  /**
   * Get applied user for certain request
   **/
  getRequestApplicant: {
    method: "GET",
    path: "/user/request-applicant/:id",
    responses: {
      200: z.object({
        status: z.literal(true),
        data: z.array(ExtendedPersonalInfoFormSchema),
      }),
      204: z.object({
        status: z.literal(true),
        message: z.literal("No applicants found"),
      }),
      500: z.object({
        status: z.literal(false),
        message: z.literal("Something went wrong"),
      }),
    },
    summary: "Get applied user for certain request",
  },
  /**
   * Get request that seller applied to
   **/
  getAppliedRequest: {
    method: "GET",
    path: "/user/applied-request",
    responses: {
      200: z.object({
        status: z.literal(true),
        data: z.array(RequestSchema),
      }),
      204: z.object({
        status: z.literal(true),
        message: z.literal("No applied request found found"),
      }),
      500: z.object({
        status: z.literal(false),
        message: z.literal("Something went wrong"),
      }),
    },
    summary: "Get request that seller applied to",
  },
  /**
   * assign request to user
   **/
  assignRequest: {
    method: "POST",
    path: "/user/assign-request",
    responses: {
      200: z.object({
        status: z.literal(true),
        message: z.literal("Successfully assigned request"),
      }),
      422: z.object({
        status: z.literal(false),
        message: z.literal("Failed to assign."),
      }),
      500: z.object({
        status: z.literal(false),
        message: z.literal("Something went wrong"),
      }),
    },
    body: z.object({
      requestId: z.string(),
      sellerProfileId: z.string(),
    }),
    summary: "Assign request to specific person",
  },
  /**
   * get accepted request
   **/
  getAcceptedRequest: {
    method: "GET",
    path: "/user/assigned-request",
    responses: {
      200: z.object({
        status: z.literal(true),
        data: z.array(RequestWithPaidStatus),
      }),
      204: z.object({
        status: z.literal(true),
        message: z.literal("No accepted request found"),
      }),
      500: z.object({
        status: z.literal(false),
        message: z.literal("Something went wrong"),
      }),
    },
    summary: "Get request accepted by buyer",
  },
  /**
   * get accepted request
   **/
  getArchivedRequest: {
    method: "GET",
    path: "/user/archived-request",
    responses: {
      200: z.object({
        status: z.literal(true),
        data: z.array(RequestWithPaidStatus),
      }),
      204: z.object({
        status: z.literal(true),
        message: z.literal("No archived request found"),
      }),
      500: z.object({
        status: z.literal(false),
        message: z.literal("Something went wrong"),
      }),
    },
    summary: "Get my archived request",
  },
})
