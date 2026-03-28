import { useCallback, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { compareDesc, parseISO } from "date-fns";
import { useAppContext } from "../context/AppContext";
import { meetingService } from "../services/api";
import { eventTypeService } from "../services/api";

const normalizeStatus = (value) => String(value || "").toLowerCase();

const normalizeMeeting = (item) => ({
  id: item.id,
  inviteeName: item.inviteeName,
  inviteeEmail: item.inviteeEmail,
  eventTypeName: item.eventType?.name || item.eventTypeName || "Event",
  eventTypeSlug: item.eventType?.slug || item.eventTypeSlug || "",
  date: item.date,
  startTime: item.startTime,
  endTime: item.endTime,
  notes: item.notes || "",
  status: normalizeStatus(item.status),
});

export const useMeetings = () => {
  const { meetings, setMeetings, setEventTypes } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const refreshEventTypeCounts = useCallback(async () => {
    try {
      const response = await eventTypeService.getAll();
      setEventTypes(response?.data?.data || []);
    } catch {
      // keep meeting flow resilient even if event count refresh fails
    }
  }, [setEventTypes]);

  const fetchMeetings = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await meetingService.getAll();
      const items = (response?.data?.data || []).map(normalizeMeeting);
      setMeetings(items);
      return items;
    } catch (err) {
      const message = err?.response?.data?.message || "Failed to load meetings.";
      setError(message);
      toast.error(message);
      return [];
    } finally {
      setLoading(false);
    }
  }, [setMeetings]);

  const cancelMeeting = useCallback(
    async (id) => {
      setLoading(true);
      setError("");

      try {
        const targetMeeting = meetings.find((item) => item.id === id);

        // Optimistic count update so Event Types page reflects cancellation immediately.
        if (targetMeeting?.eventTypeSlug) {
          setEventTypes((prev) =>
            prev.map((item) => {
              if (item.slug !== targetMeeting.eventTypeSlug) {
                return item;
              }

              return {
                ...item,
                bookingCount: Math.max(0, Number(item.bookingCount || 0) - 1),
              };
            })
          );
        }

        await meetingService.remove(id);
        await Promise.all([fetchMeetings(), refreshEventTypeCounts()]);
        toast.success("Meeting cancelled");
      } catch (err) {
        const message = err?.response?.data?.message || "Failed to cancel meeting.";
        setError(message);
        toast.error(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchMeetings, meetings, refreshEventTypeCounts, setEventTypes]
  );

  const upcomingMeetings = useMemo(
    () => meetings.filter((item) => item.status === "upcoming").sort((a, b) => compareDesc(parseISO(b.date), parseISO(a.date))),
    [meetings]
  );

  const pastMeetings = useMemo(
    () => meetings.filter((item) => item.status === "past").sort((a, b) => compareDesc(parseISO(b.date), parseISO(a.date))),
    [meetings]
  );

  const cancelledMeetings = useMemo(
    () =>
      meetings
        .filter((item) => item.status === "cancelled")
        .sort((a, b) => compareDesc(parseISO(b.date), parseISO(a.date))),
    [meetings]
  );

  return {
    meetings,
    loading,
    error,
    fetchMeetings,
    cancelMeeting,
    upcomingMeetings,
    pastMeetings,
    cancelledMeetings,
  };
};
