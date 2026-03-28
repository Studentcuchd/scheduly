import { BarChart3, Calendar, Clock, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import Header from "../../components/common/Header";
import { useEventTypes } from "../../hooks/useEventTypes";
import { useMeetings } from "../../hooks/useMeetings";
import { format, startOfMonth, endOfMonth, isWithinInterval } from "date-fns";

const StatCard = ({ icon, label, value, trend }) => {
  const IconComponent = icon;

  return (
  <div className="glass-panel rounded-lg p-4 md:p-6">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs md:text-sm font-medium text-[var(--brand-muted)]">
          {label}
        </p>
        <h3 className="mt-2 text-2xl md:text-3xl font-bold text-[var(--brand-ink)]">
          {value}
        </h3>
        {trend && (
          <p className="mt-1 text-xs text-[var(--brand-success)]">
            ↑ {trend} from last month
          </p>
        )}
      </div>
      <div className="rounded-lg bg-[var(--brand-primary)]/10 p-3 md:p-4">
        <IconComponent className="h-5 w-5 md:h-6 md:w-6 text-[var(--brand-primary)]" />
      </div>
    </div>
  </div>
  );
};

const AnalyticsDashboard = () => {
  const { eventTypes, fetchEventTypes } = useEventTypes();
  const { meetings, fetchMeetings } = useMeetings();
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    fetchEventTypes();
    fetchMeetings();
  }, [fetchEventTypes, fetchMeetings]);

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 60_000);

    return () => clearInterval(timer);
  }, []);

  const monthStart = useMemo(() => startOfMonth(now), [now]);
  const monthEnd = useMemo(() => endOfMonth(now), [now]);

  const normalizedMeetings = useMemo(
    () =>
      meetings.map((meeting) => {
        const dateTimeSource = meeting.scheduledAt
          ? new Date(meeting.scheduledAt)
          : new Date(`${meeting.date}T${meeting.startTime || "00:00"}:00`);

        return {
          ...meeting,
          attendeeDisplayName: meeting.attendeeName || meeting.inviteeName || "Guest",
          scheduledDateTime: dateTimeSource,
          normalizedStatus: String(meeting.status || "").toUpperCase(),
        };
      }),
    [meetings]
  );

  const upcomingMeetings = useMemo(
    () => normalizedMeetings.filter((m) => m.normalizedStatus === "UPCOMING"),
    [normalizedMeetings]
  );

  const completedMeetings = useMemo(
    () => normalizedMeetings.filter((m) => m.normalizedStatus === "PAST"),
    [normalizedMeetings]
  );

  const cancelledMeetings = useMemo(
    () => normalizedMeetings.filter((m) => m.normalizedStatus === "CANCELLED"),
    [normalizedMeetings]
  );

  const activeMeetings = useMemo(
    () => normalizedMeetings.filter((m) => m.normalizedStatus !== "CANCELLED"),
    [normalizedMeetings]
  );

  const thisMonthMeetings = useMemo(
    () =>
      activeMeetings.filter((m) =>
        !Number.isNaN(m.scheduledDateTime.getTime()) &&
        isWithinInterval(m.scheduledDateTime, {
          start: monthStart,
          end: monthEnd,
        })
      ),
    [activeMeetings, monthStart, monthEnd]
  );

  const recentMeetings = useMemo(
    () =>
      [...normalizedMeetings]
        .filter((m) => !Number.isNaN(m.scheduledDateTime.getTime()))
        .sort((a, b) => b.scheduledDateTime.getTime() - a.scheduledDateTime.getTime())
        .slice(0, 5),
    [normalizedMeetings]
  );

  const topEventTypes = useMemo(() => {
    return [...eventTypes]
      .map((type) => ({
        ...type,
        activeCount: activeMeetings.filter(
          (m) => m.eventTypeSlug === type.slug || m.eventTypeName === type.name
        ).length,
      }))
      .sort((a, b) => b.activeCount - a.activeCount)
      .slice(0, 3);
  }, [eventTypes, activeMeetings]);

  return (
    <div className="flex flex-col h-screen md:h-auto">
      <Header
        title="Analytics"
        subtitle="Your scheduling performance at a glance"
      />
      <div className="flex-1 overflow-auto p-4 md:p-8 pb-20 md:pb-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          <StatCard
            icon={Calendar}
            label="Event Types"
            value={eventTypes.length}
          />
          <StatCard
            icon={Users}
            label="Total Meetings"
            value={activeMeetings.length}
          />
          <StatCard
            icon={Clock}
            label="This Month"
            value={thisMonthMeetings.length}
          />
          <StatCard
            icon={BarChart3}
            label="Upcoming"
            value={upcomingMeetings.length}
          />
        </div>

        {/* Recent Meetings */}
        <div className="glass-panel rounded-lg p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-semibold text-[var(--brand-ink)] mb-4">
            Recent Meetings
          </h2>
          <div className="space-y-3">
            {recentMeetings.map((meeting) => (
              <div
                key={meeting.id}
                className="flex items-center justify-between p-3 rounded-lg bg-[var(--brand-bg)] hover:bg-[var(--brand-bg)]/70 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-[var(--brand-ink)] truncate">
                    {meeting.attendeeDisplayName}
                  </p>
                  <p className="text-xs text-[var(--brand-muted)]">
                    {Number.isNaN(meeting.scheduledDateTime.getTime())
                      ? "Invalid date"
                      : format(meeting.scheduledDateTime, "MMM d, yyyy HH:mm")}
                  </p>
                </div>
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap ml-2 ${
                    meeting.normalizedStatus === "UPCOMING"
                      ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                      : meeting.normalizedStatus === "CANCELLED"
                        ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                      : "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                  }`}
                >
                  {meeting.normalizedStatus || "UNKNOWN"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-8">
          <div className="glass-panel rounded-lg p-4 md:p-6">
            <h3 className="font-semibold text-[var(--brand-ink)] mb-4">Status Overview</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-[var(--brand-muted)]">Upcoming</span>
                <span className="font-semibold text-[var(--brand-ink)]">
                  {upcomingMeetings.length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-[var(--brand-muted)]">Completed</span>
                <span className="font-semibold text-[var(--brand-ink)]">
                  {completedMeetings.length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-[var(--brand-muted)]">Cancellations</span>
                <span className="font-semibold text-[var(--brand-ink)]">
                  {cancelledMeetings.length}
                </span>
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-lg p-4 md:p-6">
            <h3 className="font-semibold text-[var(--brand-ink)] mb-4">Top Event Types</h3>
            <div className="space-y-2">
              {topEventTypes.map((type, idx) => (
                <div key={type.id} className="flex justify-between items-center">
                  <span className="text-sm text-[var(--brand-muted)] truncate">
                    {idx + 1}. {type.name}
                  </span>
                  <span className="font-semibold text-[var(--brand-ink)]">
                    {type.activeCount}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
