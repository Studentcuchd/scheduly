import { Router } from "express";
import * as ctrl from "../controllers/booking.controller.js";
import { validate } from "../middleware/validate.js";
import { createBookingSchema } from "../validators/booking.validator.js";

const router = Router();

router.get("/:username/:slug", ctrl.getEventBySlug);
router.get("/:username/:slug/slots", ctrl.getAvailableSlots);
router.post("/:username/:slug", validate(createBookingSchema), ctrl.createBooking);

router.get("/:slug", ctrl.getEventBySlug);
router.get("/:slug/slots", ctrl.getAvailableSlots);
router.post("/:slug", validate(createBookingSchema), ctrl.createBooking);

export default router;
