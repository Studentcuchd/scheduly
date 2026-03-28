import { Router } from "express";
import * as ctrl from "../controllers/meeting.controller.js";

const router = Router();

router.get("/", ctrl.getAll);
router.get("/:id", ctrl.getSingle);
router.patch("/:id/cancel", ctrl.cancel);
router.delete("/:id", ctrl.remove);

export default router;
