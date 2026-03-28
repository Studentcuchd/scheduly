import { useCallback, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { useAppContext } from "../context/AppContext";
import { availabilityService } from "../services/api";

const DAY_KEYS = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

const availabilityEquals = (a, b) => JSON.stringify(a) === JSON.stringify(b);

const toFrontendAvailability = (payload) => {
  if (!payload) {
    return null;
  }

  const days = {
    monday: { enabled: true, start: "09:00", end: "17:00" },
    tuesday: { enabled: true, start: "09:00", end: "17:00" },
    wednesday: { enabled: true, start: "09:00", end: "17:00" },
    thursday: { enabled: true, start: "09:00", end: "17:00" },
    friday: { enabled: true, start: "09:00", end: "17:00" },
    saturday: { enabled: false, start: "09:00", end: "17:00" },
    sunday: { enabled: false, start: "09:00", end: "17:00" },
  };

  for (const item of payload.days || []) {
    const key = DAY_KEYS[item.dayOfWeek];
    if (!key) {
      continue;
    }

    days[key] = {
      enabled: item.isEnabled,
      start: item.startTime,
      end: item.endTime,
    };
  }

  return {
    timezone: payload.timezone,
    days,
  };
};

const toBackendAvailability = (payload) => {
  const dayOrder = [
    { key: "sunday", dayOfWeek: 0 },
    { key: "monday", dayOfWeek: 1 },
    { key: "tuesday", dayOfWeek: 2 },
    { key: "wednesday", dayOfWeek: 3 },
    { key: "thursday", dayOfWeek: 4 },
    { key: "friday", dayOfWeek: 5 },
    { key: "saturday", dayOfWeek: 6 },
  ];

  return {
    timezone: payload.timezone,
    days: dayOrder.map(({ key, dayOfWeek }) => {
      const day = payload.days?.[key] || { enabled: false, start: "09:00", end: "17:00" };
      return {
        dayOfWeek,
        isEnabled: Boolean(day.enabled),
        startTime: day.start,
        endTime: day.end,
      };
    }),
  };
};

export const useAvailability = () => {
  const { availability, setAvailability } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchAvailability = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await availabilityService.get();
      const normalized = toFrontendAvailability(response?.data?.data);
      if (normalized) {
        setAvailability((prev) => (availabilityEquals(prev, normalized) ? prev : normalized));
      }

      return normalized;
    } catch (err) {
      const message = err?.response?.data?.message || "Failed to load availability.";
      setError(message);
      toast.error(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [setAvailability]);

  const saveAvailability = useCallback(
    async (nextAvailability) => {
      setLoading(true);
      setError("");

      try {
        const payload = toBackendAvailability(nextAvailability);
        const response = await availabilityService.save(payload);
        const normalized = toFrontendAvailability(response?.data?.data);
        if (normalized) {
          setAvailability((prev) => (availabilityEquals(prev, normalized) ? prev : normalized));
        }

        toast.success("Availability saved");
      } catch (err) {
        const message = err?.response?.data?.message || "Failed to save availability.";
        setError(message);
        toast.error(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setAvailability]
  );

  return useMemo(
    () => ({ availability, loading, error, fetchAvailability, saveAvailability }),
    [availability, loading, error, fetchAvailability, saveAvailability]
  );
};
