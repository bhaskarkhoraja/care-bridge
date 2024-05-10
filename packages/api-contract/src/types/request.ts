import { z } from "zod"

import { ExtendedFamilyInfoFormSchema } from "./family-member"

/**
 * Request schema
 **/
export const RequestSchema = z.object({
  id: z.string(),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters long" }),
  startTime: z.date({ message: "Start time is required" }),
  endTime: z.date({ message: "End time is required" }),
  location: z.string().min(3, { message: "Location is required" }),
  preferedGender: z.enum(["male", "female", "others"]).optional(),
  mandatoryGender: z.boolean(),
  preferedAge: z.coerce
    .number()
    .min(18, { message: "Prefered Age must be atleast 18" }),
  mandatoryAge: z.boolean(),
  preferedNationality: z.string(),
  mandatoryNationality: z.boolean(),
  familyMemberIds: z
    .array(z.string())
    .min(1, { message: "Atleast one family member must be selected" }),
  status: z.enum(["open", "close", "draft"]),
})

/**
 * Request schema with family members
 **/
export const ExtendedRequestSchema = RequestSchema.extend({
  familyMembers: z.array(ExtendedFamilyInfoFormSchema),
})
