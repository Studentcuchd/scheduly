import { format } from "date-fns";
import Button from "../common/Button";
import Loader from "../common/Loader";
import { formatDisplayTime } from "../../utils/dateUtils";

const TimeSlotPicker = ({ timezone, selectedDate, slots, loading = false, error = "", selectedSlot, onSelectSlot, onNext }) => {
  if (!selectedDate) {
    return <p className="text-sm text-[var(--brand-muted)]">Select a date to view available times.</p>;
  }

  if (loading) {
    return <Loader label="Loading slots..." />;
  }

  if (error) {
    return <p className="text-sm text-red-600">{error}</p>;
  }

  if (!slots.length) {
    return <p className="text-sm text-[var(--brand-muted)]">No slots available on {format(selectedDate, "EEEE, MMMM d")}.</p>;
  }

  return (
    <div>
      <h4 className="font-semibold text-[var(--brand-ink)]">{format(selectedDate, "EEEE, MMMM d")}</h4>
      <p className="mb-3 text-xs text-[var(--brand-muted)]">{timezone}</p>
      <div className="max-h-[220px] md:max-h-[260px] space-y-2 overflow-auto pr-1">
        {slots.map((slot) => (
          <button
            key={slot}
            type="button"
            onClick={() => onSelectSlot(slot)}
            className={`w-full rounded-lg border px-3 py-2 text-sm transition ${
              selectedSlot === slot
                ? "border-[var(--brand-primary)] bg-[var(--brand-primary)] text-white"
                : "border-[var(--brand-border)] bg-[var(--brand-card-bg)] text-[var(--brand-ink)] hover:bg-[var(--brand-bg)]"
            }`}
          >
            {formatDisplayTime(slot)}
          </button>
        ))}
      </div>
      {selectedSlot && (
        <div className="mt-3">
          <Button className="w-full" onClick={onNext}>Next: Add Details</Button>
        </div>
      )}
    </div>
  );
};

export default TimeSlotPicker;
