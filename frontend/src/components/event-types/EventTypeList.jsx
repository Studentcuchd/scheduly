import EventTypeCard from "./EventTypeCard";

const EventTypeList = ({ eventTypes, onEdit, onDelete, onToggle, onCopy, onDuplicate, onViewBookings, publicUsername }) => {
  if (!eventTypes.length) {
    return (
      <div className="rounded-lg border border-dashed border-[#e4e7ec] bg-white p-10 text-center text-[#667085]">
        No event types yet. Create one to get started.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      {eventTypes.map((eventType) => (
        <EventTypeCard
          key={eventType.id}
          eventType={eventType}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggle={onToggle}
          onCopy={onCopy}
          onDuplicate={onDuplicate}
          onViewBookings={onViewBookings}
          publicUsername={publicUsername}
        />
      ))}
    </div>
  );
};

export default EventTypeList;
