import { z } from "zod"

import { ExtendedPersonalInfoFormSchema } from "./user"

/**
 * Message Schema
 **/
export const SideMessageSchema = z.object({
  id: z.string(),
  senderProfile: ExtendedPersonalInfoFormSchema,
  recieverProfile: ExtendedPersonalInfoFormSchema,
  message: z.string(),
  isRead: z.boolean(),
  createdAt: z.date(),
})

/**
 * Message Schema
 **/
export const MessageSchema = z.object({
  id: z.string(),
  senderProfileId: z.string(),
  recieverProfileId: z.string(),
  message: z.string(),
  isRead: z.boolean(),
  createdAt: z.date(),
})

/**
 * Sender Details
 **/
export const SenderDetailsSchema = z.object({
  firstName: z.string(),
  middleName: z.string(),
  lastName: z.string(),
  profileUrl: z.string().url(),
  email: z.string().email(),
})
