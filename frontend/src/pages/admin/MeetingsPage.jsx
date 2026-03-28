import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "../../components/common/Header";
import MeetingTabs from "../../components/meetings/MeetingTabs";
import MeetingCard from "../../components/meetings/MeetingCard";
import Loader from "../../components/common/Loader";
import Modal from "../../components/common/Modal";
import Button from "../../components/common/Button";
import { PROJECT_TAGLINE, STRINGS } from "../../constants";
import { useEventTypes } from "../../hooks/useEventTypes";
import { useMeetings } from "../../hooks/useMeetings";

const MeetingsPage = () => {
  const { search } = useLocation();
  const { eventTypes, fetchEventTypes } = useEventTypes();
  const { loading, error, fetchMeetings, upcomingMeetings, pastMeetings, cancelledMeetings, cancelMeeting } = useMeetings();
  const [tab, setTab] = useState("upcoming");
  const [selectedId, setSelectedId] = useState("");
  const [query, setQuery] = useState(() => new URLSearchParams(search).get("eventSlug") || "");

  useEffect(() => {
    fetchEventTypes();
    fetchMeetings();
  }, [fetchEventTypes, fetchMeetings]);

  const meetings = useMemo(() => {
    const source =
      tab === "upcoming" ? upcomingMeetings : tab === "past" ? pastMeetings : cancelledMeetings;

    return source.filter((item) => {
      const search = query.toLowerCase();
      return (
        item.inviteeName.toLowerCase().includes(search) ||
        item.inviteeEmail.toLowerCase().includes(search) ||
        item.eventTypeName.toLowerCase().includes(search) ||
        item.eventTypeSlug.toLowerCase().includes(search)
      );
    });
  }, [tab, query, upcomingMeetings, pastMeetings, cancelledMeetings]);

  const exportCsv = () => {
    const rows = [
      ["Invitee", "Email", "Event", "Date", "Start", "End", "Status"],
      ...meetings.map((item) => [
        item.inviteeName,
        item.inviteeEmail,
        item.eventTypeName,
        item.date,
        item.startTime,
        item.endTime,
        item.status,
      ]),
    ];

    const csv = rows.map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `meetings-${tab}.csv`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  };

  const getColor = (name) => eventTypes.find((item) => item.name === name)?.color || "#0069ff";

  return (
    <div className="flex h-screen md:h-auto flex-col">
      <Header
        title={STRINGS.meetingsTitle}
        subtitle={PROJECT_TAGLINE}
        actions={
          <Button variant="secondary" onClick={exportCsv} disabled={meetings.length === 0} size="sm">
            Export CSV
          </Button>
        }
      />
      <main className="flex-1 overflow-auto space-y-4 p-4 pb-20 md:p-8 md:pb-8">
        <MeetingTabs
          activeTab={tab}
          onChange={setTab}
          counts={{
            upcoming: upcomingMeetings.length,
            past: pastMeetings.length,
            cancelled: cancelledMeetings.length,
          }}
        />

        <div className="glass-panel rounded-xl p-3 md:p-4">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search invitee, email, or event type"
            className="h-10 md:h-11 w-full rounded-lg border border-[var(--brand-border)] bg-[var(--brand-bg)] px-3 text-sm text-[var(--brand-ink)] placeholder-[var(--brand-muted)] outline-none transition focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-[var(--brand-primary)]/10"
          />
        </div>

        {loading && <Loader />}

        {!loading && error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && meetings.length === 0 && (
          <div className="rounded-lg border border-dashed border-[var(--brand-border)] bg-[var(--brand-bg)] p-8 md:p-12 text-center text-[var(--brand-muted)]">
            {tab === "upcoming"
              ? STRINGS.noUpcomingMeetings
              : tab === "past"
                ? STRINGS.noPastMeetings
                : STRINGS.noCancelledMeetings}
          </div>
        )}

        {!loading && !error && meetings.length > 0 && (
          <div className="space-y-3 md:space-y-4">
            {meetings.map((meeting) => (
              <MeetingCard
                key={meeting.id}
                meeting={meeting}
                color={getColor(meeting.eventTypeName)}
                onCancel={setSelectedId}
              />
            ))}
          </div>
        )}
      </main>

      <Modal isOpen={Boolean(selectedId)} onClose={() => setSelectedId("")} title="Cancel meeting?" size="sm">
        <p className="text-sm text-[var(--brand-muted)]">This action cannot be undone.</p>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setSelectedId("")} size="sm">Keep</Button>
          <Button
            variant="danger"
            onClick={async () => {
              try {
                await cancelMeeting(selectedId);
                setSelectedId("");
              } catch {
                // keep modal open so user can retry
              }
            }}
            size="sm"
          >
            Confirm Cancel
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default MeetingsPage;
