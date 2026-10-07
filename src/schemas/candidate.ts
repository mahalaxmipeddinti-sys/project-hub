import { z } from 'zod'

export const candidateProfileSchema = z.object({
  first_name: z.string().min(2, 'First name must be at least 2 characters'),
  last_name: z.string().min(2, 'Last name must be at least 2 characters'),
  phone: z.string().optional(),
  locations: z.array(z.string()).min(1, 'Please select at least one preferred location'),
  salary_expectation: z.coerce.number().min(0).optional(),
  notice_period_days: z.coerce.number().min(0).optional(),
  is_public: z.boolean().default(false),
})

export type CandidateProfileFormData = z.infer<typeof candidateProfileSchema>
