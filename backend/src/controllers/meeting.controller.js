import { asyncHandler } from "../middleware/asyncHandler.js";
import * as meetingService from "../services/meeting.service.js";
import { successResponse } from "../utils/responseHelper.js";

export const getAll = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const meetings = await meetingService.getAllMeetings(status);
  res.json(successResponse(meetings));
});

export const getSingle = asyncHandler(async (req, res) => {
  const meeting = await meetingService.getMeetingById(req.params.id);
  res.json(successResponse(meeting));
});

export const cancel = asyncHandler(async (req, res) => {
  const meeting = await meetingService.cancelMeeting(req.params.id);
  res.json(successResponse(meeting, "Meeting cancelled"));
});

export const remove = asyncHandler(async (req, res) => {
  const meeting = await meetingService.deleteMeeting(req.params.id);
  res.json(successResponse(meeting, "Meeting deleted"));
});
