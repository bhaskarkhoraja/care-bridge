import { z } from "zod"

/**
 * Family Member Schema
 **/
export const FamilyInfoFormSchema = z.object({
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
  gender: z.enum(["male", "female", "others"], {
    required_error: "Gender is required.",
  }),
  dob: z.date({ required_error: "Date of birth is required." }),
})

/**
 * Family Member Special Needs Schema
 **/
// rested specialNeeds because RHF couldn't deal with array of object
export const FamilySpecialNeedsSchema = z.object({
  specialNeeds: z.array(
    z.object({
      title: z.string().min(5, {
        message: "Title should be atleast 5 characters",
      }),
      description: z.string().min(10, {
        message: "Description should be atleast 10 characters",
      }),
      url: z.string().url({ message: "Url of the special needs is required" }),
    })
  ),
})
