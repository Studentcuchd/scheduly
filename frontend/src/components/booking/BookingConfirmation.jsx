import { CheckCircle2 } from "lucide-react";
import { COMPANY, USER } from "../../constants";
import { formatMeetingDate, formatTimeRange } from "../../utils/dateUtils";

const BookingConfirmation = ({ bookingData }) => {
  const recipientEmail = bookingData.email || bookingData.inviteeEmail;

  return (
    <div className="mx-auto w-full max-w-lg rounded-xl border border-[#d0d5dd] bg-white p-6 shadow-sm">
      <div className="mb-4 flex justify-center">
        <CheckCircle2 className="h-14 w-14 text-[#00a86b]" />
      </div>
      <h1 className="text-center text-2xl font-semibold text-[#1a1a2e]">You are scheduled!</h1>
      <p className="mt-2 text-center text-sm text-[#667085]">
        A calendar invitation has been sent to <span className="font-medium text-[#344054]">{recipientEmail}</span>
      </p>

      <div className="mt-6 space-y-2 rounded-lg border border-[#d0d5dd] bg-[#f8fafc] p-4 text-sm text-[#344054]">
        <p>
          <span className="font-semibold text-[#101828]">Event:</span>{" "}
          <span className="font-medium text-[#344054]">{bookingData.eventName}</span>
        </p>
        <p>
          <span className="font-semibold text-[#101828]">Date:</span>{" "}
          <span className="font-medium text-[#344054]">{formatMeetingDate(bookingData.date)}</span>
        </p>
        <p>
          <span className="font-semibold text-[#101828]">Time:</span>{" "}
          <span className="font-medium text-[#344054]">{formatTimeRange(bookingData.startTime, bookingData.endTime)}</span>
        </p>
        <p>
          <span className="font-semibold text-[#101828]">Format:</span>{" "}
          <span className="font-medium text-[#344054]">{bookingData.sessionMode || "Google Meet"}</span>
        </p>
        <p>
          <span className="font-semibold text-[#101828]">Host:</span>{" "}
          <span className="font-medium text-[#344054]">{USER.name}</span>
        </p>
      </div>

      <p className="mt-3 text-center text-xs text-[#667085]">Scheduled via {COMPANY}</p>
      <p className="mt-1 text-center text-xs text-[#667085]">Redirecting to Event Types page...</p>
    </div>
  );
};

export default BookingConfirmation;
