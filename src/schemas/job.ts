import { z } from 'zod'

export const jobSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  type: z.enum(['full-time', 'part-time', 'contract', 'internship']),
  mode: z.enum(['on-site', 'hybrid', 'remote']),
  location: z.string().min(2, "Location is required"),
  salary_min: z.coerce.number().min(0).optional(),
  salary_max: z.coerce.number().min(0).optional(),
  skills: z.array(z.string()).min(1, "At least one skill is required"),
  expiry_days: z.coerce.number().min(1).max(60).default(30)
}).refine(data => {
  if (data.salary_min && data.salary_max) {
    return data.salary_min <= data.salary_max
  }
  return true
}, {
  message: "Max salary must be greater than or equal to Min salary",
  path: ["salary_max"]
})

export type JobFormData = z.infer<typeof jobSchema>
