import { useCallback, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { useAppContext } from "../context/AppContext";
import { eventTypeService } from "../services/api";

export const useEventTypes = () => {
  const { eventTypes, setEventTypes } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchEventTypes = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await eventTypeService.getAll();
      const items = response?.data?.data || [];
      setEventTypes(items);
      return items;
    } catch (err) {
      console.error("Failed to fetch event types", {
        status: err?.response?.status,
        message: err?.message,
      });
      const message = err?.response?.data?.message || "Failed to fetch event types.";
      setError(message);
      toast.error(message);
      return [];
    } finally {
      setLoading(false);
    }
  }, [setEventTypes]);

  const createEventType = useCallback(
    async (payload) => {
      setLoading(true);
      setError("");

      try {
        await eventTypeService.create(payload);
        await fetchEventTypes();
        toast.success("Event type created");
      } catch (err) {
        const message = err?.response?.data?.message || err?.message || "Failed to create event type.";
        setError(message);
        toast.error(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchEventTypes]
  );

  const updateEventType = useCallback(
    async (id, payload) => {
      setLoading(true);
      setError("");

      try {
        await eventTypeService.update(id, payload);
        await fetchEventTypes();
        toast.success("Event type updated");
      } catch (err) {
        const message = err?.response?.data?.message || err?.message || "Failed to update event type.";
        setError(message);
        toast.error(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchEventTypes]
  );

  const deleteEventType = useCallback(
    async (id) => {
      setLoading(true);
      setError("");

      try {
        await eventTypeService.delete(id);
        await fetchEventTypes();
        toast.success("Event type deleted");
      } catch (err) {
        const message = err?.response?.data?.message || "Failed to delete event type.";
        setError(message);
        toast.error(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchEventTypes]
  );

  const toggleEventType = useCallback(
    async (id) => {
      setLoading(true);
      setError("");

      try {
        await eventTypeService.toggle(id);
        await fetchEventTypes();
        toast.success("Event type updated");
      } catch (err) {
        const message = err?.response?.data?.message || "Failed to update event type.";
        setError(message);
        toast.error(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchEventTypes]
  );

  const value = useMemo(
    () => ({
      eventTypes,
      loading,
      error,
      fetchEventTypes,
      createEventType,
      updateEventType,
      deleteEventType,
      toggleEventType,
    }),
    [eventTypes, loading, error, fetchEventTypes, createEventType, updateEventType, deleteEventType, toggleEventType]
  );

  return value;
};
