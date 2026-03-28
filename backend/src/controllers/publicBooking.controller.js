import { asyncHandler } from "../middleware/asyncHandler.js";
import * as bookingService from "../services/booking.service.js";
import { successResponse } from "../utils/responseHelper.js";

export const getPublicEvent = asyncHandler(async (req, res) => {
  const { username, slug } = req.params;
  const event = await bookingService.getPublicEventByUsernameAndSlug(username, slug);
  res.json(successResponse(event));
});

export const getPublicSlots = asyncHandler(async (req, res) => {
  const { username, slug } = req.params;
  const { date } = req.query;
  const slots = await bookingService.getPublicSlotsByUsernameAndSlug(username, slug, date);
  res.json(successResponse(slots));
});

export const createPublicBooking = asyncHandler(async (req, res) => {
  const booking = await bookingService.createPublicBooking(req.body);
  res.status(201).json(successResponse(booking, "Meeting booked successfully"));
});
