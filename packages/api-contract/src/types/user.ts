import { z } from "zod"

/**
 * PersonalInfoFormSchema for user
 **/
export const PersonalInfoFormSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  middleName: z.union([
    z.string().min(2, {
      message: "Middle name must be at least 2 characters.",
    }),
    z.string().length(0),
  ]),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  userName: z
    .string()
    .min(2, {
      message: "Username must be at least 2 characters.",
    })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "Username can only contain letters, numbers, and underscores.",
    }),
  dob: z.date({ required_error: "Date of birth is required." }),
  gender: z.enum(["male", "female", "others"], {
    required_error: "Gender is required.",
  }),
})

/**
 * AddressContactSchema for user
 **/
export const AddressContactFormSchema = z.object({
  street: z.string().min(2, {
    message: "Street must be at least 2 characters.",
  }),
  city: z.string().min(2, {
    message: "City must be at least 2 characters.",
  }),
  state: z.string().min(2, {
    message: "State must be at least 2 characters.",
  }),
  postalCode: z
    .string({ required_error: "Postal Code is required." })
    .regex(/^\d{5}$/, "Postal code must be 5 digits long."),
  countryId: z.string().min(3, { message: "Country Name is required" }),
  phoneCode: z.string().min(3, { message: "Code is required" }),
  phoneNumber: z
    .string({ required_error: "Phone number is required." })
    .regex(/^\d{10}$/, "Phone Number must be 10 digits long."),
})

/**
 * DocumentFormSchema for user
 **/
export const DocumentFormSchema = z.object({
  profileUrl: z.string().url({ message: "Profile image is required." }),
  documentUrl: z.string().url({ message: "Document image is required." }),
  policeReportUrl: z
    .string()
    .url({ message: "Police report image is required." }),
})

/**
 * User type schema
 **/
export const UserTypeSchema = z.object({
  type: z.enum(["buyer", "seller"], {
    required_error: "User Type is required.",
  }),
})
