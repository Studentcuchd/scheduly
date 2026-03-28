import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import Button from "../common/Button";

const BookingForm = ({ loading, onSubmit, onBack, onChangeTime, selectedDateLabel, selectedSlotLabel, eventName }) => {
  const [form, setForm] = useState({ name: "", email: "", notes: "" });
  const [errors, setErrors] = useState({});
  const canSubmit = Boolean(selectedDateLabel && selectedSlotLabel);

  const submit = (event) => {
    event.preventDefault();
    const nextErrors = {};

    if (!form.name.trim()) {
      nextErrors.name = "Name is required";
    }
    if (!form.email.trim()) {
      nextErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = "Enter a valid email";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    onSubmit(form);
  };

  return (
    <div>
      <button
        type="button"
        onClick={onBack}
        className="mb-3 inline-flex min-h-[44px] items-center gap-2 text-sm font-medium text-[var(--brand-muted)]"
      >
        <ArrowLeft className="h-4 w-4" /> Back to time slots
      </button>

      <div className="mb-3 rounded-lg border border-[var(--brand-border)] bg-[var(--brand-bg)] p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--brand-muted)]">Booking Details</p>
        <p className="mt-1 text-sm font-medium text-[var(--brand-ink)]">{eventName || "Event"}</p>
        <p className="text-sm text-[var(--brand-muted)]">
          {canSubmit ? `${selectedDateLabel} at ${selectedSlotLabel}` : "Select a date and time to continue."}
        </p>
        {canSubmit && (
          <button
            type="button"
            onClick={onChangeTime}
            className="mt-2 text-xs font-medium text-[var(--brand-primary)] hover:text-[var(--brand-primary-deep)]"
          >
            Change time
          </button>
        )}
      </div>

      <form className="space-y-3" onSubmit={submit}>
        <label className="block">
          <span className="mb-1 block text-sm text-[var(--brand-muted)]">Name</span>
          <input
            className="ui-input"
            placeholder="Your full name"
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
          />
          {errors.name && <span className="mt-1 block text-xs text-red-600">{errors.name}</span>}
        </label>

        <label className="block">
          <span className="mb-1 block text-sm text-[var(--brand-muted)]">Email</span>
          <input
            className="ui-input"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
          />
          {errors.email && <span className="mt-1 block text-xs text-red-600">{errors.email}</span>}
        </label>

        <label className="block">
          <span className="mb-1 block text-sm text-[var(--brand-muted)]">Notes (Optional)</span>
          <textarea
            className="ui-textarea"
            rows={3}
            placeholder="Anything you want us to prepare before the meeting"
            value={form.notes}
            onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
          />
        </label>

        <Button type="submit" className="w-full" loading={loading} disabled={!canSubmit}>
          Schedule Event
        </Button>
      </form>
    </div>
  );
};

export default BookingForm;
