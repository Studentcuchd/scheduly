import { Router } from "express";
import * as ctrl from "../controllers/publicBooking.controller.js";
import { validate } from "../middleware/validate.js";
import { createPublicBookingSchema } from "../validators/booking.validator.js";

const router = Router();

router.get("/public/:username/:slug", ctrl.getPublicEvent);
router.get("/slots/:username/:slug", ctrl.getPublicSlots);
router.post("/book", validate(createPublicBookingSchema), ctrl.createPublicBooking);
router.post("/bookings", validate(createPublicBookingSchema), ctrl.createPublicBooking);

export default router;
