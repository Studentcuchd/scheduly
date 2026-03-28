import { Router } from "express";
import * as ctrl from "../controllers/availability.controller.js";
import { validate } from "../middleware/validate.js";
import { saveAvailabilitySchema } from "../validators/availability.validator.js";

const router = Router();

router.get("/", ctrl.get);
router.post("/", validate(saveAvailabilitySchema), ctrl.save);
router.put("/", validate(saveAvailabilitySchema), ctrl.save);

export default router;
