import { initContract } from "@ts-rest/core"
import { z } from "zod"

const c = initContract()

/**
 * Paypal contracts
 **/
export const paypalContract = c.router({
  /**
   * Get the action url
   **/
  getActionUrl: {
    method: "GET",
    path: "/user/payment/paypal/partner-referal",
    responses: {
      200: z.object({
        status: z.literal(true),
        data: z.object({ actionUrl: z.string().url() }),
      }),
      422: z.object({
        status: z.literal(false),
        message: z.literal("Couldn't process partner referal"),
      }),
      500: z.object({
        status: z.literal(false),
        message: z.literal("Something went wrong"),
      }),
    },
    summary: "Get action url for signup",
  },
  /**
   * Set paypal merchant account
   **/
  setPaypalMerchantAccount: {
    method: "POST",
    path: "/user/payment/paypal/seller-account",
    responses: {
      200: z.object({
        status: z.literal(true),
        message: z.literal("Successfully updated seller account"),
      }),
      204: z.object({
        status: z.literal(false),
        message: z.literal("User not found"),
      }),
      422: z.object({
        status: z.literal(false),
        message: z.literal("Failed to update seller account"),
      }),
      500: z.object({
        status: z.literal(false),
        message: z.literal("Something went wrong"),
      }),
    },
    body: z.object({ merchantIdInPaypal: z.string() }),
    summary: "Set paypal merchant account",
  },
  /**
   * get paypal merchant account
   **/
  checkSellerPaypalAndStatus: {
    method: "GET",
    path: "/user/payment/paypal/seller-account",
    responses: {
      200: z.object({
        status: z.literal(true),
        data: z.object({
          paypalStatus: z.union([z.literal("Active"), z.literal("Pending")]),
        }),
      }),
      204: z.object({
        status: z.literal(false),
        message: z.literal("No paypal account found"),
      }),
      500: z.object({
        status: z.literal(false),
        message: z.literal("Something went wrong"),
      }),
    },
    summary: "Set paypal merchant account",
  },
  /**
   * Get the paymetn url
   **/
  getPaymentURL: {
    method: "GET",
    path: "/user/payment/paypal/payment-url/:id",
    responses: {
      200: z.object({
        status: z.literal(true),
        data: z.object({ paymentUrl: z.string().url() }),
      }),
      422: z.object({
        status: z.literal(false),
        message: z.literal("Couldn't find payment url"),
      }),
      500: z.object({
        status: z.literal(false),
        message: z.literal("Something went wrong"),
      }),
    },
    summary: "Get payment url",
  },
  /**
   * verify payment
   **/
  verifyPayment: {
    method: "GET",
    path: "/user/payment/paypal/verify-payment/:id",
    responses: {
      200: z.object({
        status: z.literal(true),
        data: z.object({ verifiedStatus: z.boolean() }),
      }),
      500: z.object({
        status: z.literal(false),
        message: z.literal("Something went wrong"),
      }),
    },
    summary: "verify payment",
  },
})
