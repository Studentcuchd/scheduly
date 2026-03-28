import { getCurrentDateAndMinutesInTimeZone, toMinutes, toTimeString } from "./dateUtils.js";

export const generateSlots = ({
  startTime,
  endTime,
  duration,
  bookedSlots,
  date,
  timezone = "UTC",
}) => {
  const bufferMinutes = Number(process.env.BOOKING_BUFFER_MINUTES || 0);
  const startMins = toMinutes(startTime);
  const endMins = toMinutes(endTime);

  const allSlots = [];
  for (let current = startMins; current + duration <= endMins; current += duration) {
    allSlots.push({
      startTime: toTimeString(current),
      endTime: toTimeString(current + duration),
    });
  }

  const available = allSlots.filter((slot) => {
    const slotStart = toMinutes(slot.startTime);
    const slotEnd = toMinutes(slot.endTime);

    return !bookedSlots.some((booked) => {
      const bookedStart = toMinutes(booked.startTime);
      const bookedEnd = toMinutes(booked.endTime) + bufferMinutes;
      return slotStart < bookedEnd && slotEnd > bookedStart;
    });
  });

  const { date: today, minutes: currentMins } = getCurrentDateAndMinutesInTimeZone(timezone);
  const availableStartTimes = available.map((slot) => slot.startTime);

  if (date === today) {
    return availableStartTimes.filter((start) => toMinutes(start) > currentMins);
  }

  return availableStartTimes;
};
