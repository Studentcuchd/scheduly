import { Router } from "express";
import * as ctrl from "../controllers/eventType.controller.js";
import { validate } from "../middleware/validate.js";
import {
  createEventTypeSchema,
  updateEventTypeSchema,
} from "../validators/eventType.validator.js";

const router = Router();

router.get("/", ctrl.getAll);
router.get("/:slug", ctrl.getBySlug);
router.post("/", validate(createEventTypeSchema), ctrl.create);
router.put("/:id", validate(updateEventTypeSchema), ctrl.update);
router.delete("/:id", ctrl.remove);
router.patch("/:id/toggle", ctrl.toggle);

export default router;
