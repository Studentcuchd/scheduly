import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { DAY_KEYS, DAY_LABELS, TIMEZONES } from "../../constants";
import DayToggle from "./DayToggle";
import TimeRangePicker from "./TimeRangePicker";
import Button from "../common/Button";

const AvailabilityForm = ({ availability, onSave }) => {
  const [form, setForm] = useState(availability);
  useEffect(() => {
    setForm(availability);
  }, [availability]);

  const [query, setQuery] = useState("");
  const [error, setError] = useState("");

  const timezones = useMemo(
    () => TIMEZONES.filter((zone) => zone.toLowerCase().includes(query.toLowerCase())),
    [query]
  );

  const updateDay = (day, value) => {
    setForm((prev) => ({
      ...prev,
      days: {
        ...prev.days,
        [day]: {
          ...prev.days[day],
          ...value,
        },
      },
    }));
  };

  const handleSave = () => {
    const hasInvalidRange = DAY_KEYS.some((day) => {
      const config = form.days[day];
      return config.enabled && config.end <= config.start;
    });

    if (hasInvalidRange) {
      setError("End time must be after start time.");
      return;
    }

    setError("");
    onSave(form);
  };

  return (
    <div className="space-y-4 rounded-lg border border-[var(--brand-border)] bg-[var(--brand-card-bg)] p-4 transition-colors">
      <div>
        <p className="mb-2 text-sm font-medium text-[var(--brand-ink)]">Timezone</p>
        <div className="relative mb-2">
          <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-[var(--brand-muted)]" />
          <input
            className="ui-input pl-9 pr-3"
            placeholder="Search timezone"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <select
          className="ui-select"
          value={form.timezone}
          onChange={(e) => setForm((prev) => ({ ...prev, timezone: e.target.value }))}
          style={{ color: "var(--brand-ink)", backgroundColor: "var(--brand-card-bg)" }}
        >
          {timezones.map((zone) => (
            <option key={zone} value={zone}>
              {zone}
            </option>
          ))}
        </select>
      </div>

      <div className="divide-y divide-[var(--brand-border)]">
        {DAY_KEYS.map((day) => {
          const config = form.days[day];
          return (
            <div key={day} className="grid grid-cols-1 gap-3 py-3 md:grid-cols-[140px_1fr] md:items-center">
              <div className="flex items-center gap-3">
                <DayToggle checked={config.enabled} onChange={() => updateDay(day, { enabled: !config.enabled })} />
                <span className={`text-sm ${config.enabled ? "text-[var(--brand-ink)]" : "text-[var(--brand-muted)]"}`}>
                  {DAY_LABELS[day]}
                </span>
              </div>
              <TimeRangePicker
                start={config.start}
                end={config.end}
                disabled={!config.enabled}
                onStartChange={(value) => updateDay(day, { start: value })}
                onEndChange={(value) => updateDay(day, { end: value })}
              />
            </div>
          );
        })}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex justify-end">
        <Button onClick={handleSave}>Save Changes</Button>
      </div>
    </div>
  );
};

export default AvailabilityForm;
