import { z } from 'zod';

export const ResumeSchema = z.object({
  title: z.string().min(1, "Title is required"),
  template: z.enum(['professional', 'modern', 'academic']),
  summary: z.string().optional(),
  skills: z.array(z.string()).min(1, "At least one skill is required"),
  experience: z.array(
    z.object({
      company: z.string().min(1),
      position: z.string().min(1),
      startDate: z.string().datetime(),
      endDate: z.string().datetime().optional().or(z.literal('Present')),
      description: z.string().optional()
    })
  ).optional(),
  education: z.array(
    z.object({
      institution: z.string().min(1),
      degree: z.string().min(1),
      field: z.string().optional(),
      startDate: z.string().datetime(),
      endDate: z.string().datetime().optional()
    })
  ).optional(),
}).strict();