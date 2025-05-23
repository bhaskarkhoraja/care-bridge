import { initContract } from "@ts-rest/core"
import { z } from "zod"

import {
  AddressContactFormSchema,
  DocumentFormSchema,
  PersonalInfoFormSchema,
  UserDashBoardSchema,
  UserTypeSchema,
} from "../types/user"

const c = initContract()

/**
 * User contracts
 **/
export const userContract = c.router({
  /**
   * Set the personal info update or insert
   **/
  setPersonalInfo: {
    method: "POST",
    path: "/user/personal-info",
    responses: {
      200: z.object({
        status: z.literal(true),
        message: z.literal("Personal info updated successfully"),
      }),
      422: z.object({
        status: z.literal(false),
        message: z.literal("Failed to update personal info"),
      }),
      409: z.object({
        status: z.literal(false),
        message: z.literal("Username already taken"),
      }),
      500: z.object({
        status: z.literal(false),
        message: z.literal("Something went wrong"),
      }),
    },
    body: z.object({ data: PersonalInfoFormSchema, profileId: z.string() }),
    summary: "Set personal info",
  },
  /**
   * Get the personal data using session-id
   **/
  getPersonalInfo: {
    method: "GET",
    path: "/user/personal-info/:id",
    responses: {
      200: z.object({
        status: z.literal(true),
        data: PersonalInfoFormSchema,
      }),
      204: z.object({
        status: z.literal(true),
        message: z.literal("No personal info found"),
      }),
      500: z.object({
        status: z.literal(false),
        message: z.literal("Something went wrong"),
      }),
    },
    summary: "Get user by id",
  },
  /**
   * Set Address and contact info, update or insert
   **/
  setAddressContactInfo: {
    method: "POST",
    path: "/user/address-contact-info",
    responses: {
      200: z.object({
        status: z.literal(true),
        message: z.literal("Address & Contact info updated successfully"),
      }),
      422: z.object({
        status: z.literal(false),
        message: z.literal("Failed to update address & contact info"),
      }),
      409: z.object({
        status: z.literal(false),
        message: z.literal("Phone number already taken"),
      }),
      500: z.object({
        status: z.literal(false),
        message: z.literal("Something went wrong"),
      }),
    },
    body: AddressContactFormSchema,
    summary: "Set personal info",
  },
  /**
   * Get Address and contact info using session-id
   **/
  getAddressContactInfo: {
    method: "GET",
    path: "/user/address-contact-info/:id",
    responses: {
      200: z.object({
        status: z.literal(true),
        data: AddressContactFormSchema,
      }),
      204: z.object({
        status: z.literal(true),
        message: z.literal("No address contact info found"),
      }),
      500: z.object({
        status: z.literal(false),
        message: z.literal("Something went wrong"),
      }),
    },
    summary: "Get address and contact details",
  },
  /**
   * Set Document info, update or insert
   **/
  setDocumentInfo: {
    method: "POST",
    path: "/user/document-info",
    responses: {
      200: z.object({
        status: z.literal(true),
        message: z.literal("Document info updated successfully"),
      }),
      422: z.object({
        status: z.literal(true),
        message: z.literal("Failed to update document info"),
      }),
      500: z.object({
        status: z.literal(false),
        message: z.literal("Something went wrong"),
      }),
    },
    body: DocumentFormSchema,
    summary: "Set user document",
  },
  /**
   * Get the document info of user using session-id
   **/
  getDocumentInfo: {
    method: "GET",
    path: "/user/document-info/:id",
    responses: {
      200: z.object({
        status: z.literal(true),
        data: DocumentFormSchema,
      }),
      204: z.object({
        status: z.literal(true),
        message: z.literal("No documents found"),
      }),
      500: z.object({
        status: z.literal(false),
        message: z.literal("Something went wrong"),
      }),
    },
    summary: "Get user by id",
  },
  /**
   * Set User Type
   **/
  setUserType: {
    method: "POST",
    path: "/user/type",
    responses: {
      200: z.object({
        status: z.literal(true),
        message: z.literal("User type updated successfully"),
      }),
      422: z.object({
        status: z.literal(true),
        message: z.literal("Failed to update user type"),
      }),
      500: z.object({
        status: z.literal(false),
        message: z.literal("Something went wrong"),
      }),
    },
    body: UserTypeSchema,
    summary: "Set user type(buyer | seller)",
  },
  /**
   * get user dashboard
   **/
  getDashboard: {
    method: "GET",
    path: "/user/dashboard",
    responses: {
      200: z.object({
        status: z.literal(true),
        data: UserDashBoardSchema,
      }),
      204: z.object({
        status: z.literal(false),
        message: z.literal("Nothing to show"),
      }),
      500: z.object({
        status: z.literal(false),
        message: z.literal("Something went wrong"),
      }),
    },
    summary: "Get dashborad details",
  },
})
