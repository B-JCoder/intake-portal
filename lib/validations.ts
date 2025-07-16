import { z } from "zod"

export const clientSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters"),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters"),
  email: z.string().email("Please enter a valid email address"),
  company: z.string().max(100, "Company name must be less than 100 characters").optional(),
  phone: z.string().optional(),
})

export const intakeSchema = z.object({
  projectName: z
    .string()
    .min(3, "Project name must be at least 3 characters")
    .max(100, "Project name must be less than 100 characters"),
  projectType: z.enum(["WEB_DEVELOPMENT", "MOBILE_APP", "DESIGN", "CONSULTING", "MARKETING", "OTHER"]),
  budget: z.number().min(100, "Budget must be at least $100").max(1000000, "Budget must be less than $1,000,000"),
  timeline: z.string().min(1, "Please specify a timeline"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(2000, "Description must be less than 2000 characters"),
  requirements: z
    .array(z.string())
    .min(1, "Please specify at least one requirement")
    .max(20, "Maximum 20 requirements allowed"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).default("MEDIUM"),
})

export const intakeFormSchema = z.object({
  client: clientSchema,
  intake: intakeSchema,
})

export type ClientFormData = z.infer<typeof clientSchema>
export type IntakeFormData = z.infer<typeof intakeSchema>
export type IntakeFormFullData = z.infer<typeof intakeFormSchema>
