import { asyncHandler } from "../middleware/asyncHandler.js";
import * as availabilityService from "../services/availability.service.js";
import { successResponse } from "../utils/responseHelper.js";

export const get = asyncHandler(async (req, res) => {
  const availability = await availabilityService.getAvailability();
  res.json(successResponse(availability));
});

export const save = asyncHandler(async (req, res) => {
  const availability = await availabilityService.saveAvailability(req.body);
  res.json(successResponse(availability, "Availability saved"));
});
