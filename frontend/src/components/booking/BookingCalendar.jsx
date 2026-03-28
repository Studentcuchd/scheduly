import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  endOfWeek,
} from "date-fns";
import { DAY_KEYS } from "../../constants";
import { isPastDate } from "../../utils/dateUtils";

const BookingCalendar = ({ currentMonth, selectedDate, availability, onMonthChange, onSelectDate }) => {
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const gridStart = startOfWeek(monthStart);
  const gridEnd = endOfWeek(monthEnd);
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          className="rounded-md border border-[var(--brand-border)] bg-[var(--brand-card-bg)] p-2 text-[var(--brand-muted)] transition hover:bg-[var(--brand-bg)] hover:text-[var(--brand-ink)]"
          onClick={() => onMonthChange(addMonths(currentMonth, -1))}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <h3 className="font-semibold text-[var(--brand-ink)]">{format(currentMonth, "MMMM yyyy")}</h3>
        <button
          type="button"
          className="rounded-md border border-[var(--brand-border)] bg-[var(--brand-card-bg)] p-2 text-[var(--brand-muted)] transition hover:bg-[var(--brand-bg)] hover:text-[var(--brand-ink)]"
          onClick={() => onMonthChange(addMonths(currentMonth, 1))}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs text-[var(--brand-muted)]">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="py-1">{day}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const dayKey = DAY_KEYS[Number(format(day, "i")) - 1];
          const isEnabled = availability.days?.[dayKey]?.enabled;
          const selectable = isSameMonth(day, currentMonth) && !isPastDate(day) && isEnabled;
          const isSelected = selectedDate && isSameDay(day, selectedDate);

          return (
            <button
              key={day.toISOString()}
              type="button"
              disabled={!selectable}
              onClick={() => onSelectDate(day)}
              className={`mx-auto flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium transition ${
                isSelected
                  ? "bg-[var(--brand-primary)] text-white shadow-sm"
                  : selectable
                    ? "text-[var(--brand-ink)] hover:bg-[var(--brand-bg)] hover:text-[var(--brand-primary)]"
                    : "cursor-not-allowed text-slate-400 dark:text-slate-600"
              }`}
            >
              {format(day, "d")}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BookingCalendar;
