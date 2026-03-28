import { generateHalfHourOptions } from "../../utils/slotUtils";

const options = generateHalfHourOptions();

const TimeRangePicker = ({ start, end, disabled, onStartChange, onEndChange }) => {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
      <select
        disabled={disabled}
        value={start}
        onChange={(e) => onStartChange(e.target.value)}
        className="ui-select disabled:opacity-70"
        style={{ color: "var(--brand-ink)", backgroundColor: "var(--brand-card-bg)" }}
      >
        {options.map((time) => (
          <option key={`start-${time}`} value={time} style={{ color: "#0f172a", backgroundColor: "#ffffff" }}>
            {time}
          </option>
        ))}
      </select>
      <span className="text-[var(--brand-muted)]">-</span>
      <select
        disabled={disabled}
        value={end}
        onChange={(e) => onEndChange(e.target.value)}
        className="ui-select disabled:opacity-70"
        style={{ color: "var(--brand-ink)", backgroundColor: "var(--brand-card-bg)" }}
      >
        {options.map((time) => (
          <option key={`end-${time}`} value={time} style={{ color: "#0f172a", backgroundColor: "#ffffff" }}>
            {time}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TimeRangePicker;
