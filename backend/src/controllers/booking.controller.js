import { asyncHandler } from "../middleware/asyncHandler.js";
import * as bookingService from "../services/booking.service.js";
import { successResponse } from "../utils/responseHelper.js";

export const getEventBySlug = asyncHandler(async (req, res) => {
  const event = await bookingService.getEventBySlug(req.params.slug, req.params.username);
  res.json(successResponse(event));
});

export const getAvailableSlots = asyncHandler(async (req, res) => {
  const { slug, username } = req.params;
  const { date } = req.query;
  const slots = await bookingService.getAvailableSlots(slug, date, username);
  res.json(successResponse(slots));
});

export const createBooking = asyncHandler(async (req, res) => {
  const booking = await bookingService.createBooking(req.params.slug, req.body, req.params.username);
  res.status(201).json(successResponse(booking, "Meeting booked successfully"));
});
