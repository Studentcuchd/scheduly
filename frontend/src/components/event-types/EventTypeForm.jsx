import { useMemo, useState } from "react";
import Modal from "../common/Modal";
import Button from "../common/Button";
import { DURATIONS, EVENT_COLORS, EVENT_COLOR_CLASS } from "../../constants";

const toSlug = (value) => value.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-");

const EventTypeForm = ({ isOpen, onClose, initialData, existingSlugs, onSave, publicUsername = "parag" }) => {
  const [form, setForm] = useState(
    initialData || { name: "", duration: 30, slug: "", color: EVENT_COLORS[0], description: "" }
  );
  const [errors, setErrors] = useState({});

  const title = useMemo(() => (initialData ? "Edit Event Type" : "Create Event Type"), [initialData]);

  const handleField = (key, value) => {
    setForm((prev) => {
      if (key === "name") {
        const autoSlug = prev.slug === "" || prev.slug === toSlug(prev.name) ? toSlug(value) : prev.slug;
        return { ...prev, name: value, slug: autoSlug };
      }
      return { ...prev, [key]: value };
    });
  };

  const validate = () => {
    const nextErrors = {};
    const slug = toSlug(form.slug);

    if (!form.name.trim()) {
      nextErrors.name = "Event name is required";
    }

    if (!slug) {
      nextErrors.slug = "Slug is required";
    } else if (!/^[a-z0-9-]+$/.test(slug)) {
      nextErrors.slug = "Slug must be URL-safe";
    } else if (existingSlugs.includes(slug) && slug !== initialData?.slug) {
      nextErrors.slug = "Slug must be unique";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const submit = (event) => {
    event.preventDefault();
    if (!validate()) {
      return;
    }

    onSave({ ...form, slug: toSlug(form.slug), duration: Number(form.duration) });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="md">
      <form className="space-y-4" onSubmit={submit}>
        <div className="form-surface space-y-4">
          <label className="block">
            <span className="ui-label">Event Name</span>
            <input
              className="ui-input"
              placeholder="e.g. Discovery Call"
              value={form.name}
              onChange={(e) => handleField("name", e.target.value)}
            />
            {errors.name && <span className="mt-1 block text-xs text-red-600">{errors.name}</span>}
          </label>

          <label className="block">
            <span className="ui-label">Duration</span>
            <select
              className="ui-select"
              value={form.duration}
              onChange={(e) => handleField("duration", e.target.value)}
            >
              {DURATIONS.map((duration) => (
                <option key={duration} value={duration}>
                  {duration} minutes
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="ui-label">URL Slug</span>
            <input
              className="ui-input"
              placeholder="your-event-slug"
              value={form.slug}
              onChange={(e) => handleField("slug", e.target.value)}
            />
            <span className="ui-helper">Public URL: /{publicUsername}/{toSlug(form.slug || "your-event")}</span>
            {errors.slug && <span className="mt-1 block text-xs text-red-600">{errors.slug}</span>}
          </label>
        </div>

        <div className="form-surface">
          <span className="ui-label">Color</span>
          <div className="mt-2 flex flex-wrap gap-2.5">
            {EVENT_COLORS.map((color) => {
              const colorToken = EVENT_COLOR_CLASS[color] || "bg-[#0069ff]";
              const dotClass = colorToken.split(" ")[0];

              return (
                <button
                  key={color}
                  type="button"
                  aria-label={`Pick ${color}`}
                  className={`h-9 w-9 rounded-full border-2 p-0.5 transition-transform hover:scale-105 ${
                    form.color === color ? "border-[var(--brand-primary)]" : "border-[var(--brand-border)]"
                  }`}
                  onClick={() => handleField("color", color)}
                >
                  <span className={`block h-full w-full rounded-full ${dotClass}`} />
                </button>
              );
            })}
          </div>
        </div>

        <div className="form-surface">
          <label className="block">
            <span className="ui-label">Description</span>
            <textarea
              className="ui-textarea"
              rows={4}
              placeholder="Tell invitees what this meeting is about"
              value={form.description}
              onChange={(e) => handleField("description", e.target.value)}
            />
            <span className="ui-helper">{(form.description || "").length}/500 characters</span>
          </label>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit">Save</Button>
        </div>
      </form>
    </Modal>
  );
};

export default EventTypeForm;
