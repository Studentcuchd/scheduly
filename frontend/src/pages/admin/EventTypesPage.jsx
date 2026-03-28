import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Header from "../../components/common/Header";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import EventTypeList from "../../components/event-types/EventTypeList";
import EventTypeForm from "../../components/event-types/EventTypeForm";
import { PROJECT_TAGLINE, ROUTES, STRINGS, USER } from "../../constants";
import { useEventTypes } from "../../hooks/useEventTypes";

const EventTypesPage = () => {
  const navigate = useNavigate();
  const { eventTypes, loading, fetchEventTypes, createEventType, updateEventType, deleteEventType, toggleEventType } =
    useEventTypes();
  const publicUsername = USER.username || "parag";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchEventTypes();
  }, [fetchEventTypes]);

  const existingSlugs = useMemo(() => eventTypes.map((item) => item.slug), [eventTypes]);

  const filteredEventTypes = useMemo(() => {
    return eventTypes.filter((item) => {
      const matchesQuery =
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.slug.toLowerCase().includes(query.toLowerCase());
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && item.isActive) ||
        (statusFilter === "inactive" && !item.isActive);

      return matchesQuery && matchesStatus;
    });
  }, [eventTypes, query, statusFilter]);

  const stats = useMemo(
    () => ({
      total: eventTypes.length,
      active: eventTypes.filter((item) => item.isActive).length,
      inactive: eventTypes.filter((item) => !item.isActive).length,
    }),
    [eventTypes]
  );

  const handleSave = async (form) => {
    if (editing) {
      await updateEventType(editing.id, form);
    } else {
      await createEventType(form);
    }
    setEditing(null);
    setIsModalOpen(false);
  };

  const handleCopy = async (slug) => {
    await navigator.clipboard.writeText(ROUTES.PUBLIC_BOOKING(publicUsername, slug));
    toast.success("Link copied");
  };

  const handleToggle = async (id) => {
    const target = eventTypes.find((item) => item.id === id);
    if (!target) {
      return;
    }
    await toggleEventType(id, { isActive: !target.isActive });
  };

  const handleDuplicate = async (item) => {
    const baseSlug = `${item.slug}-copy`;
    let nextSlug = baseSlug;
    let i = 2;

    while (existingSlugs.includes(nextSlug)) {
      nextSlug = `${baseSlug}-${i}`;
      i += 1;
    }

    await createEventType({
      name: `${item.name} (Copy)`,
      duration: item.duration,
      slug: nextSlug,
      color: item.color,
      description: item.description,
    });
  };

  const addTemplateEvent = async () => {
    const templateSlug = "portfolio-review-45";
    if (existingSlugs.includes(templateSlug)) {
      toast.error("Template already exists");
      return;
    }

    await createEventType({
      name: "Portfolio Review",
      duration: 45,
      slug: templateSlug,
      color: "#f79009",
      description: "Structured portfolio and project walkthrough.",
    });
  };

  const handleViewBookings = (slug) => {
    navigate(`${ROUTES.MEETINGS}?eventSlug=${encodeURIComponent(slug)}`);
  };

  return (
    <div className="flex h-screen md:h-auto flex-col">
      <Header
        title={STRINGS.eventTypesTitle}
        subtitle={PROJECT_TAGLINE}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="secondary" onClick={addTemplateEvent} size="sm">Add Template</Button>
            <Button onClick={() => setIsModalOpen(true)} size="sm">{STRINGS.newEventType}</Button>
          </div>
        }
      />

      <main className="flex-1 overflow-auto space-y-4 p-4 pb-20 md:p-8 md:pb-8">
        {/* Stats Cards */}
        <section className="glass-panel grid grid-cols-1 gap-3 rounded-xl p-4 md:grid-cols-3">
          <article className="rounded-lg bg-[var(--brand-bg)] p-3 md:p-4 transition-colors">
            <p className="text-xs uppercase tracking-wide text-[var(--brand-muted)]">Total Types</p>
            <p className="mt-1 text-2xl md:text-3xl font-semibold text-[var(--brand-ink)]">{stats.total}</p>
          </article>
          <article className="rounded-lg bg-[var(--brand-bg)] p-3 md:p-4 transition-colors">
            <p className="text-xs uppercase tracking-wide text-[var(--brand-muted)]">Active</p>
            <p className="mt-1 text-2xl md:text-3xl font-semibold text-[var(--brand-primary)]">{stats.active}</p>
          </article>
          <article className="rounded-lg bg-[var(--brand-bg)] p-3 md:p-4 transition-colors">
            <p className="text-xs uppercase tracking-wide text-[var(--brand-muted)]">Inactive</p>
            <p className="mt-1 text-2xl md:text-3xl font-semibold text-[var(--brand-warning)]">{stats.inactive}</p>
          </article>
        </section>

        {/* Search and Filters */}
        <section className="glass-panel rounded-xl p-4 md:p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by name or slug"
              className="h-10 md:h-11 w-full rounded-lg border border-[var(--brand-border)] bg-[var(--brand-bg)] px-3 text-sm text-[var(--brand-ink)] placeholder-[var(--brand-muted)] outline-none transition focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-[var(--brand-primary)]/10"
            />
            <div className="grid grid-cols-3 gap-2 md:w-auto">
              {[
                { label: "All", value: "all" },
                { label: "Active", value: "active" },
                { label: "Inactive", value: "inactive" },
              ].map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setStatusFilter(item.value)}
                  className={`min-h-[40px] md:min-h-[44px] rounded-lg border px-2 md:px-3 text-xs font-semibold transition-colors ${
                    statusFilter === item.value
                      ? "border-[var(--brand-primary)] bg-[var(--brand-primary)]/10 text-[var(--brand-primary)]"
                      : "border-[var(--brand-border)] bg-[var(--brand-bg)] text-[var(--brand-muted)]"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {loading ? (
          <Loader />
        ) : (
          <EventTypeList
            eventTypes={filteredEventTypes}
            onEdit={(item) => {
              setEditing(item);
              setIsModalOpen(true);
            }}
            onDelete={deleteEventType}
            onToggle={handleToggle}
            onCopy={handleCopy}
            onDuplicate={handleDuplicate}
            onViewBookings={handleViewBookings}
            publicUsername={publicUsername}
          />
        )}
      </main>

      {isModalOpen && (
        <EventTypeForm
          key={editing?.id || "new"}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditing(null);
          }}
          initialData={editing}
          existingSlugs={existingSlugs}
          publicUsername={publicUsername}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default EventTypesPage;
