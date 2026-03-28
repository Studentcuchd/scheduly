import { z } from "zod";

export const createEventTypeSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  duration: z
    .number()
    .int()
    .positive()
    .refine((v) => [15, 30, 45, 60, 90].includes(v), {
      message: "Duration must be 15, 30, 45, 60, or 90 minutes",
    }),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, hyphens only"),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
  description: z.string().max(500).optional(),
});

export const updateEventTypeSchema = createEventTypeSchema.partial();
