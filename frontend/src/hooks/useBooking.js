import { useEffect, useState } from "react";
import { format } from "date-fns";
import { bookingService } from "../services/api";

export const useBooking = ({ username, slug }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSlots = async () => {
      if (!selectedDate || !username || !slug) {
        setAvailableSlots([]);
        return;
      }

      try {
        setSlotsLoading(true);
        setError("");
        const dateKey = format(selectedDate, "yyyy-MM-dd");
        const response = username
          ? await bookingService.getSlots(username, slug, dateKey)
          : await bookingService.getSlotsBySlugOnly(slug, dateKey);
        setAvailableSlots(response?.data?.data || []);
      } catch (err) {
        const message = err?.response?.data?.message || "Failed to load slots.";
        setError(message);
        setAvailableSlots([]);
      } finally {
        setSlotsLoading(false);
      }
    };

    fetchSlots();
  }, [selectedDate, slug, username]);

  const selectDate = (date) => {
    setSelectedDate(date);
    setSelectedSlot("");
  };

  const selectSlot = (slot) => {
    setSelectedSlot(slot);
  };

  const submitBooking = async (payload, onSuccess) => {
    try {
      setSubmitting(true);
      setError("");
      const response = username
        ? await bookingService.create(username, slug, payload)
        : await bookingService.createBySlugOnly(slug, payload);
      onSuccess?.(response?.data?.data);
    } catch (err) {
      const message = err?.response?.data?.message || "Unable to book this meeting.";
      setError(message);
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  return {
    selectedDate,
    selectedSlot,
    availableSlots,
    slotsLoading,
    submitting,
    error,
    selectDate,
    selectSlot,
    submitBooking,
  };
};
