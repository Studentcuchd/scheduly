import { useEffect, useState } from "react";
import { ArrowLeft, Clock3 } from "lucide-react";
import { addMinutes, format } from "date-fns";
import { useNavigate, useParams } from "react-router-dom";
import BookingCalendar from "../../components/booking/BookingCalendar";
import TimeSlotPicker from "../../components/booking/TimeSlotPicker";
import BookingForm from "../../components/booking/BookingForm";
import Loader from "../../components/common/Loader";
import { APP_NAME, COMPANY, PROJECT_TAGLINE, ROUTES, USER } from "../../constants";
import { useBooking } from "../../hooks/useBooking";
import { bookingService, eventTypeService } from "../../services/api";

const SESSION_MODES = [
  { value: "Google Meet", label: "Google Meet" },
  { value: "In-person", label: "In-person" },
  { value: "Phone Call", label: "Phone Call" },
];

const BookingPage = () => {
  const navigate = useNavigate();
  const { username, slug, eventSlug } = useParams();
  const resolvedSlug = eventSlug || slug;
  const [step, setStep] = useState("slots");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [sessionMode, setSessionMode] = useState(SESSION_MODES[0].value);
  const [eventType, setEventType] = useState(null);
  const [resolvedUsername, setResolvedUsername] = useState(username || "");
  const [availability, setAvailability] = useState({ timezone: "UTC", days: {} });
  const [eventLoading, setEventLoading] = useState(true);
  const [eventError, setEventError] = useState("");

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate(ROUTES.ANALYTICS);
  };

  useEffect(() => {
    const fetchEvent = async () => {
      if (!resolvedSlug) {
        setEventError("Invalid booking link.");
        setEventLoading(false);
        return;
      }

      try {
        setEventLoading(true);
        setEventError("");
        const response = await eventTypeService.getBySlug(resolvedSlug);

        const payload = response?.data?.data;
        setEventType(payload);
        setResolvedUsername(payload?.user?.username || username || "");
        setAvailability(payload?.availability || { timezone: "UTC", days: {} });
      } catch (err) {
        const status = err?.response?.status;
        const message = status === 404 ? "Event not found" : err?.response?.data?.message || "Unable to load booking page.";
        setEventError(message);
      } finally {
        setEventLoading(false);
      }
    };

    fetchEvent();
  }, [resolvedSlug, username]);

  const { selectedDate, selectedSlot, availableSlots, slotsLoading, submitting, error, selectDate, selectSlot, submitBooking } =
    useBooking({
      username: resolvedUsername || username,
      slug: resolvedSlug,
    });

  const scheduleEvent = async (form) => {
    if (!eventType || !selectedDate || !selectedSlot) {
      return;
    }

    const date = format(selectedDate, "yyyy-MM-dd");
    const [hours, minutes] = selectedSlot.split(":").map(Number);
    const slotStart = new Date(selectedDate);
    slotStart.setHours(hours, minutes, 0, 0);
    const slotEnd = addMinutes(slotStart, eventType.duration || 30);

    const bookingPayload = {
      inviteeName: form.name,
      inviteeEmail: form.email,
      notes: form.notes,
      date,
      startTime: selectedSlot,
    };

    await submitBooking(bookingPayload, (meeting) => {
      const bookingData = {
        ...meeting,
        email: form.email,
        eventName: eventType.name,
        inviteeName: form.name,
        inviteeEmail: form.email,
        eventTypeSlug: eventType.slug,
        sessionMode,
        date,
        startTime: selectedSlot,
        endTime: format(slotEnd, "HH:mm"),
      };

      const confirmPath = resolvedUsername
        ? ROUTES.PUBLIC_CONFIRM(resolvedUsername, resolvedSlug)
        : ROUTES.CONFIRM(resolvedSlug);
      navigate(confirmPath, {
        replace: true,
        state: bookingData,
      });
    });
  };

  if (eventLoading) {
    return <Loader fullPage label="Loading booking page..." />;
  }

  if (eventError || !eventType) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4 bg-[var(--brand-bg)]">
        <div className="max-w-md rounded-lg border border-[var(--brand-border)] bg-[var(--brand-card-bg)] p-6 text-center">
          <h1 className="text-lg font-semibold text-[var(--brand-ink)]">Booking Link Unavailable</h1>
          <p className="mt-2 text-sm text-[var(--brand-muted)]">{eventError || "This booking link is invalid."}</p>
          <button
            type="button"
            onClick={handleBack}
            className="mt-4 inline-flex items-center gap-2 rounded-lg border border-[var(--brand-border)] bg-[var(--brand-card-bg)] px-3 py-2 text-sm font-medium text-[var(--brand-text-secondary)] transition hover:bg-[var(--brand-bg)]"
          >
            <ArrowLeft className="h-4 w-4" /> Go Back
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="mx-auto mb-4 max-w-6xl">
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-2 rounded-lg border border-[var(--brand-border)] bg-[var(--brand-card-bg)] px-3 py-2 text-sm font-medium text-[var(--brand-text-secondary)] transition hover:bg-[var(--brand-bg)]"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <span className="hero-chip">{COMPANY}</span>
        <p className="mt-2 text-sm text-[var(--brand-muted)]">{PROJECT_TAGLINE}</p>
      </div>

      <div className="glass-panel mx-auto grid max-w-6xl grid-cols-1 gap-4 rounded-xl p-4 md:grid-cols-[280px_1fr_320px] md:p-6">
        <section className="rounded-lg border border-[var(--brand-border)] bg-[var(--brand-bg)] p-4">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--brand-primary)]/15 font-semibold text-[var(--brand-primary)]">
              {(eventType?.user?.name || USER.name)
                .split(" ")
                .map((part) => part[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </div>
            <div>
              <p className="text-sm text-[var(--brand-muted)]">{APP_NAME}</p>
              <p className="font-semibold text-[var(--brand-ink)]">{eventType?.user?.name || USER.name}</p>
            </div>
          </div>
          <h1 className="text-lg font-semibold text-[var(--brand-ink)]">{eventType?.name}</h1>
          <p className="mt-2 flex items-center gap-2 text-sm text-[var(--brand-muted)]">
            <Clock3 className="h-4 w-4" /> {eventType?.duration} min
          </p>
          <p className="mt-2 text-sm text-[var(--brand-muted)]">{eventType?.description}</p>

          <div className="mt-4 rounded-lg border border-[var(--brand-border)] bg-[var(--brand-card-bg)] p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--brand-muted)]">Session Format</p>
            <div className="mt-2 grid gap-2">
              {SESSION_MODES.map((mode) => (
                <button
                  key={mode.value}
                  type="button"
                  onClick={() => setSessionMode(mode.value)}
                  className={`min-h-[44px] rounded-lg border px-3 text-left text-sm font-medium ${
                    sessionMode === mode.value
                      ? "border-[var(--brand-primary)] bg-[var(--brand-primary)]/10 text-[var(--brand-primary)]"
                      : "border-[var(--brand-border)] bg-[var(--brand-card-bg)] text-[var(--brand-muted)]"
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-[var(--brand-border)] bg-[var(--brand-card-bg)] p-4">
          <BookingCalendar
            currentMonth={currentMonth}
            selectedDate={selectedDate}
            availability={availability}
            onMonthChange={setCurrentMonth}
            onSelectDate={selectDate}
          />
        </section>

        <section className="rounded-lg border border-[var(--brand-border)] bg-[var(--brand-card-bg)] p-4">
          {step === "slots" ? (
            <TimeSlotPicker
              timezone={availability.timezone}
              selectedDate={selectedDate}
              slots={availableSlots}
              loading={slotsLoading}
              error={error}
              selectedSlot={selectedSlot}
              onSelectSlot={selectSlot}
              onNext={() => setStep("details")}
            />
          ) : (
            <BookingForm
              loading={submitting}
              onSubmit={scheduleEvent}
              onBack={() => setStep("slots")}
              onChangeTime={() => setStep("slots")}
              eventName={eventType?.name}
              selectedDateLabel={selectedDate ? format(selectedDate, "EEEE, MMMM d") : ""}
              selectedSlotLabel={selectedSlot}
            />
          )}
        </section>
      </div>
    </main>
  );
};

export default BookingPage;
