import { asyncHandler } from "../middleware/asyncHandler.js";
import * as eventTypeService from "../services/eventType.service.js";
import { successResponse } from "../utils/responseHelper.js";

export const getAll = asyncHandler(async (req, res) => {
  const eventTypes = await eventTypeService.getAllEventTypes();
  res.json(successResponse(eventTypes));
});

export const getBySlug = asyncHandler(async (req, res) => {
  const eventType = await eventTypeService.getEventTypeBySlug(req.params.slug);
  res.json(successResponse(eventType));
});

export const create = asyncHandler(async (req, res) => {
  const eventType = await eventTypeService.createEventType(req.body);
  res.status(201).json(successResponse(eventType, "Event type created"));
});

export const update = asyncHandler(async (req, res) => {
  const eventType = await eventTypeService.updateEventType(req.params.id, req.body);
  res.json(successResponse(eventType, "Event type updated"));
});

export const remove = asyncHandler(async (req, res) => {
  await eventTypeService.deleteEventType(req.params.id);
  res.json(successResponse(null, "Event type deleted"));
});

export const toggle = asyncHandler(async (req, res) => {
  const eventType = await eventTypeService.toggleEventType(req.params.id);
  res.json(successResponse(eventType, "Event type toggled"));
});
