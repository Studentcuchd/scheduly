import { useState } from "react";
import { Copy, EllipsisVertical, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { EVENT_COLOR_CLASS } from "../../constants";

const EventTypeCard = ({
  eventType,
  onEdit,
  onDelete,
  onToggle,
  onCopy,
  onDuplicate,
  onViewBookings,
  publicUsername = "parag",
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const colorClass = EVENT_COLOR_CLASS[eventType.color] || "bg-[#0069ff] border-[#0069ff]";
  const publicPath = `/${publicUsername}/${eventType.slug}`;
  const bookingCount = Number(eventType.bookingCount || 0);

  return (
    <article className="rounded-lg border border-[#e4e7ec] bg-white shadow-sm transition hover:shadow-md">
      <div className="flex items-stretch">
        <div className={`w-1 rounded-l-lg ${colorClass}`} />
        <div className="flex-1 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${colorClass.split(" ")[0]}`} />
                <h3 className="font-semibold text-[#1a1a2e]">{eventType.name}</h3>
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-[#667085]">
                  {eventType.duration}m
                </span>
                {bookingCount > 0 && (
                  <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">
                    {bookingCount} booked
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-[#667085]">{eventType.description}</p>
            </div>

            <div className="relative flex items-center gap-1">
              <button
                type="button"
                className="rounded-md p-2 text-[#667085] hover:bg-gray-100"
                onClick={() => setMenuOpen((prev) => !prev)}
                aria-label="Open event options"
              >
                <EllipsisVertical className="h-4 w-4" />
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-10 z-10 w-28 rounded-md border border-[#e4e7ec] bg-white p-1 shadow-sm">
                  <button
                    type="button"
                    className="block min-h-[44px] w-full rounded-md px-3 text-left text-sm text-[#1a1a2e] hover:bg-gray-50"
                    onClick={() => {
                      setMenuOpen(false);
                      onEdit(eventType);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="block min-h-[44px] w-full rounded-md px-3 text-left text-sm text-[#1a1a2e] hover:bg-gray-50"
                    onClick={() => {
                      setMenuOpen(false);
                      onDuplicate?.(eventType);
                    }}
                  >
                    Duplicate
                  </button>
                  <button
                    type="button"
                    className="block min-h-[44px] w-full rounded-md px-3 text-left text-sm text-red-600 hover:bg-red-50"
                    onClick={() => {
                      setMenuOpen(false);
                      onDelete(eventType.id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              )}

              <button
                type="button"
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${eventType.isActive ? "bg-[#0069ff]" : "bg-gray-300"}`}
                onClick={() => onToggle(eventType.id)}
                aria-label="Toggle event type"
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${eventType.isActive ? "translate-x-5" : "translate-x-1"}`}
                />
              </button>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => onCopy(eventType.slug)}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-md border border-[#e4e7ec] px-3 text-sm text-[#667085] hover:bg-gray-50"
              >
                <Copy className="h-4 w-4" /> {publicPath}
              </button>

              {bookingCount > 0 && (
                <button
                  type="button"
                  onClick={() => onViewBookings?.(eventType.slug)}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-md border border-green-200 bg-green-50 px-3 text-sm font-medium text-green-700 hover:bg-green-100"
                >
                  View Bookings
                </button>
              )}
            </div>

            <Link
              to={publicPath}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-md border border-[#e4e7ec] px-3 text-sm text-[#1a1a2e] hover:bg-gray-50"
            >
              <ExternalLink className="h-4 w-4" /> Book
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
};

export default EventTypeCard;
