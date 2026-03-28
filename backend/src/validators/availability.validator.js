import { z } from "zod";

export const saveAvailabilitySchema = z.object({
  timezone: z.string().min(1),
  days: z
    .array(
      z.object({
        dayOfWeek: z.number().int().min(0).max(6),
        isEnabled: z.boolean(),
        startTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
        endTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
      })
    )
    .length(7),
});
