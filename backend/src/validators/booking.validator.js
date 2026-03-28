import { z } from "zod";

export const createBookingSchema = z.object({
  inviteeName: z.string().min(1, "Name is required").max(100),
  inviteeEmail: z.string().email("Valid email required"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
  startTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
  endTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/).optional(),
  notes: z.string().max(500).optional(),
});

export const createPublicBookingSchema = createBookingSchema.extend({
  username: z.string().min(1, "username is required"),
  slug: z.string().min(1, "slug is required"),
});
