import { z } from "zod"

export const projectFormSchema = z.object({
  businessName: z.string().min(2, "Business name must be at least 2 characters"),
  industry: z.string().optional(),
  websiteType: z.enum(["BUSINESS", "ECOMMERCE", "PORTFOLIO", "BLOG", "CUSTOM"]),
  features: z.array(z.string()).min(1, "Please select at least one feature"),
  numberOfPages: z.number().min(1, "Must have at least 1 page").max(100, "Maximum 100 pages"),
  deadline: z.coerce.date().min(new Date(), "Deadline must be in the future"),
  budget: z.number().min(500, "Minimum budget is $500"),
})

export type ProjectFormData = z.infer<typeof projectFormSchema>

export const updateProjectStatusSchema = z.object({
  status: z.enum(["DRAFT", "SUBMITTED", "IN_PROGRESS", "COMPLETED", "CANCELLED"]),
  notes: z.string().optional(),
})
