import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AppContext = createContext(null);
const STORAGE_KEY = "scheduly-app-state";

const defaultAvailability = {
  timezone: "Asia/Kolkata",
  days: {
    monday: { enabled: true, start: "09:00", end: "17:00" },
    tuesday: { enabled: true, start: "09:00", end: "17:00" },
    wednesday: { enabled: true, start: "09:00", end: "17:00" },
    thursday: { enabled: true, start: "09:00", end: "17:00" },
    friday: { enabled: true, start: "09:00", end: "17:00" },
    saturday: { enabled: false, start: "09:00", end: "17:00" },
    sunday: { enabled: false, start: "09:00", end: "17:00" },
  },
};

const defaultState = {
  eventTypes: [],
  availability: defaultAvailability,
  meetings: [],
};

const readPersistedState = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return defaultState;
    }

    const parsed = JSON.parse(raw);
    return {
      eventTypes: Array.isArray(parsed?.eventTypes) ? parsed.eventTypes : defaultState.eventTypes,
      availability: parsed?.availability || defaultState.availability,
      meetings: Array.isArray(parsed?.meetings) ? parsed.meetings : defaultState.meetings,
    };
  } catch {
    return defaultState;
  }
};

export const AppProvider = ({ children }) => {
  const [bootState] = useState(readPersistedState);
  const [eventTypes, setEventTypes] = useState(bootState.eventTypes);
  const [availability, setAvailability] = useState(bootState.availability);
  const [meetings, setMeetings] = useState(bootState.meetings);

  useEffect(() => {
    const nextState = {
      eventTypes,
      availability,
      meetings,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
  }, [eventTypes, availability, meetings]);

  const value = useMemo(
    () => ({
      eventTypes,
      setEventTypes,
      availability,
      setAvailability,
      meetings,
      setMeetings,
    }),
    [eventTypes, availability, meetings]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useAppContext must be used within AppProvider");
  }

  return context;
};
