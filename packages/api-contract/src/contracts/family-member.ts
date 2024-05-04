import { initContract } from "@ts-rest/core"
import { z } from "zod"

import {
  DocumentFormSchema,
  ExtendedFamilyInfoFormSchema,
  FamilyInfoFormSchema,
  FamilySpecialNeedsSchema,
} from "../types"

const c = initContract()

/**
 * Family Member contracts
 **/
export const familyContract = c.router({
  /**
   * Set the personal info update or insert for family member
   **/
  setFamilyMemberInfo: {
    method: "POST",
    path: "/user/family-member/personal-info",
    responses: {
      200: z.object({
        status: z.literal(true),
        message: z.literal("Family member info updated successfully"),
      }),
      422: z.object({
        status: z.literal(false),
        message: z.literal("Failed to update personal info"),
      }),
      500: z.object({
        status: z.literal(false),
        message: z.literal("Something went wrong"),
      }),
    },
    body: z.object({
      familyMemberId: z.string(),
      data: FamilyInfoFormSchema,
    }),
    summary: "Set personal info for family member",
  },
  /**
   * Get family member info using family member id
   **/
  getFamilyMemberInfo: {
    method: "GET",
    path: "/user/family-member/personal-info/:id",
    responses: {
      200: z.object({
        status: z.literal(true),
        data: FamilyInfoFormSchema,
      }),
      204: z.object({
        status: z.literal(true),
        message: z.literal("No family member info found"),
      }),
      500: z.object({
        status: z.literal(false),
        message: z.literal("Something went wrong"),
      }),
    },
    summary: "Get family member using famimly member id",
  },
  /**
   * Set the personal info update or insert for family member
   **/
  setFamilySpecialNeed: {
    method: "POST",
    path: "/user/family-member/special-needs",
    responses: {
      200: z.object({
        status: z.literal(true),
        message: z.literal("Special needs updated successfully"),
      }),
      422: z.object({
        status: z.literal(false),
        message: z.literal("Failed to update special needs"),
      }),
      500: z.object({
        status: z.literal(false),
        message: z.literal("Something went wrong"),
      }),
    },
    body: z.object({
      familyMemberId: z.string(),
      data: FamilySpecialNeedsSchema,
    }),
    summary: "Set special needs for the family if any",
  },
  /**
   * Get family member info using family member id
   **/
  getFamilySpecialNeed: {
    method: "GET",
    path: "/user/family-member/special-needs/:id",
    responses: {
      200: z.object({
        status: z.literal(true),
        data: FamilySpecialNeedsSchema,
      }),
      204: z.object({
        status: z.literal(true),
        message: z.literal("No special needs found"),
      }),
      500: z.object({
        status: z.literal(false),
        message: z.literal("Something went wrong"),
      }),
    },
    summary: "Get family member's special need using famimly member id",
  },
  /**
   * Set Document for family member
   **/
  setFamilyDocumentInfo: {
    method: "POST",
    path: "/user/family-member/document-info",
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
    body: z.object({
      familyMemberId: z.string(),
      data: DocumentFormSchema,
    }),
    summary: "Set family document info",
  },
  /**
   * Get family member document
   **/
  getFamilyDocumentInfo: {
    method: "GET",
    path: "/user/family-member/document-info/:id",
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
    summary: "Get family document info",
  },
  /**
   * Get all family members
   **/
  getAllFamilyMemberInfo: {
    method: "GET",
    path: "/user/family-member",
    responses: {
      200: z.object({
        status: z.literal(true),
        data: z.array(ExtendedFamilyInfoFormSchema),
      }),
      204: z.object({
        status: z.literal(true),
        message: z.literal("No family member found"),
      }),
      500: z.object({
        status: z.literal(false),
        message: z.literal("Something went wrong"),
      }),
    },
    summary: "Get all family members",
  },
})
