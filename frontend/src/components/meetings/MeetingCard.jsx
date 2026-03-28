import { CalendarDays, Clock3, Mail, User } from "lucide-react";
import Badge from "../common/Badge";
import Button from "../common/Button";
import { EVENT_COLOR_CLASS, USER } from "../../constants";
import { formatMeetingDate, formatTimeRange } from "../../utils/dateUtils";

const MeetingCard = ({ meeting, color = "#0069ff", onCancel }) => {
  const isPast = meeting.status !== "upcoming";
  const colorClass = EVENT_COLOR_CLASS[color] || "bg-[#0069ff] border-[#0069ff]";

  return (
    <article className={`rounded-lg border border-[#e4e7ec] bg-white shadow-sm ${isPast ? "opacity-75" : ""}`}>
      <div className="flex items-stretch">
        <div className={`w-1 rounded-l-lg ${colorClass}`} />
        <div className="flex-1 p-4">
          <div className="mb-3 flex items-start justify-between gap-3">
            <div>
              <h3 className="text-base font-semibold text-[#1a1a2e]">{meeting.inviteeName}</h3>
              <p className="text-sm text-[#667085]">{meeting.eventTypeName}</p>
            </div>
            <Badge variant={meeting.status} label={meeting.status} />
          </div>

          <div className="grid gap-2 text-sm text-[#667085]">
            <p className="flex items-center gap-2"><Mail className="h-4 w-4" /> {meeting.inviteeEmail}</p>
            <p className="flex items-center gap-2"><CalendarDays className="h-4 w-4" /> {formatMeetingDate(meeting.date)}</p>
            <p className="flex items-center gap-2"><Clock3 className="h-4 w-4" /> {formatTimeRange(meeting.startTime, meeting.endTime)}</p>
            <p className="flex items-center gap-2"><User className="h-4 w-4" /> {USER.name}</p>
          </div>

          {!isPast && (
            <div className="mt-4 flex justify-end">
              <Button variant="danger" onClick={() => onCancel(meeting.id)}>
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

export default MeetingCard;
