import { addMinutes, format, parse } from "date-fns";
import { doesSlotOverlap, isSlotInPast, parseTimeOnDate } from "./dateUtils";

export const generateHalfHourOptions = () => {
  const options = [];
  let cursor = parse("00:00", "HH:mm", new Date());

  for (let i = 0; i < 48; i += 1) {
    options.push(format(cursor, "HH:mm"));
    cursor = addMinutes(cursor, 30);
  }

  return options;
};

export const generateTimeSlots = (availability, duration, bookedSlots, selectedDate) => {
  if (!availability?.days || !selectedDate) {
    return [];
  }

  const dayName = format(selectedDate, "EEEE").toLowerCase();
  const dayConfig = availability.days?.[dayName];

  if (!dayConfig?.enabled) {
    return [];
  }

  const startAt = parseTimeOnDate(dayConfig.start, selectedDate);
  const endAt = parseTimeOnDate(dayConfig.end, selectedDate);

  const generated = [];
  let cursor = new Date(startAt);

  while (addMinutes(cursor, duration) <= endAt) {
    const slotLabel = format(cursor, "HH:mm");
    generated.push(slotLabel);
    cursor = addMinutes(cursor, duration);
  }

  const bookingRanges = (bookedSlots || [])
    .map((slot) => {
      const slotStart = typeof slot === "string" ? slot : slot?.startTime;
      const slotEnd = typeof slot === "string" ? null : slot?.endTime;

      if (!slotStart) {
        return null;
      }

      const bookingStart = parseTimeOnDate(slotStart, selectedDate);
      const bookingEnd = slotEnd
        ? parseTimeOnDate(slotEnd, selectedDate)
        : addMinutes(bookingStart, duration);

      return { bookingStart, bookingEnd };
    })
    .filter(Boolean);

  return generated
    .filter((slot) => {
      const slotStart = parseTimeOnDate(slot, selectedDate);
      return !bookingRanges.some(({ bookingStart, bookingEnd }) =>
        doesSlotOverlap(slotStart, duration, bookingStart, bookingEnd)
      );
    })
    .filter((slot) => !isSlotInPast(selectedDate, slot));
};
