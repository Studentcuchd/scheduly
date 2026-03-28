import { Save, Bell, Clock, Mail, Globe } from "lucide-react";
import { useState } from "react";
import Header from "../../components/common/Header";
import Button from "../../components/common/Button";
import { USER } from "../../constants";
import toast from "react-hot-toast";

const SettingGroup = ({ icon, title, description, children }) => {
  const IconComponent = icon;

  return (
  <div className="glass-panel rounded-lg p-4 md:p-6 mb-4">
    <div className="flex gap-4 items-start">
      <div className="rounded-lg bg-[var(--brand-primary)]/10 p-3 flex-shrink-0">
        <IconComponent className="h-5 w-5 md:h-6 md:w-6 text-[var(--brand-primary)]" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-[var(--brand-ink)] text-base md:text-lg">
          {title}
        </h3>
        <p className="text-xs md:text-sm text-[var(--brand-muted)] mt-1">
          {description}
        </p>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  </div>
  );
};

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    timezone: "UTC",
    emailNotifications: true,
    meetingReminders: true,
    weekStartDay: "Monday",
    weeklyDigest: true,
    showAvailabilityPublicly: true,
  });

  const handleChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    localStorage.setItem("appSettings", JSON.stringify(settings));
    toast.success("Settings saved successfully!");
  };

  const timezones = [
    "UTC",
    "America/New_York",
    "America/Chicago",
    "America/Denver",
    "America/Los_Angeles",
    "Europe/London",
    "Europe/Paris",
    "Asia/Tokyo",
    "Asia/Shanghai",
    "Australia/Sydney",
  ];

  return (
    <div className="flex flex-col h-screen md:h-auto">
      <Header
        title="Settings"
        subtitle="Manage your preferences and account settings"
      />
      <div className="flex-1 overflow-auto p-4 md:p-8 pb-20 md:pb-8">
        {/* Profile Section */}
        <SettingGroup
          icon={Mail}
          title="Profile Information"
          description="Your account details and preferences"
        >
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-[var(--brand-ink)]">
                Name
              </label>
              <input
                type="text"
                defaultValue={USER.name}
                className="mt-2 w-full px-3 py-2 border border-[var(--brand-border)] rounded-lg bg-[var(--brand-bg)] text-[var(--brand-ink)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[var(--brand-ink)]">
                Email
              </label>
              <input
                type="email"
                defaultValue={USER.email}
                className="mt-2 w-full px-3 py-2 border border-[var(--brand-border)] rounded-lg bg-[var(--brand-bg)] text-[var(--brand-ink)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
              />
            </div>
          </div>
        </SettingGroup>

        {/* Timezone Settings */}
        <SettingGroup
          icon={Globe}
          title="Timezone"
          description="Set your default timezone for scheduling"
        >
          <select
            value={settings.timezone}
            onChange={(e) => handleChange("timezone", e.target.value)}
            className="w-full px-3 py-2 border border-[var(--brand-border)] rounded-lg bg-[var(--brand-bg)] text-[var(--brand-ink)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
          >
            {timezones.map((tz) => (
              <option key={tz} value={tz}>
                {tz}
              </option>
            ))}
          </select>
        </SettingGroup>

        {/* Notification Settings */}
        <SettingGroup
          icon={Bell}
          title="Notifications"
          description="Control how you receive notifications"
        >
          <div className="space-y-3">
            <label className="flex items-center cursor-pointer hover:bg-[var(--brand-bg)] -mx-2 px-2 py-2 rounded transition">
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) =>
                  handleChange("emailNotifications", e.target.checked)
                }
                className="w-4 h-4 accent-[var(--brand-primary)] rounded"
              />
              <span className="ml-3 text-sm text-[var(--brand-ink)]">
                Email notifications for new meetings
              </span>
            </label>
            <label className="flex items-center cursor-pointer hover:bg-[var(--brand-bg)] -mx-2 px-2 py-2 rounded transition">
              <input
                type="checkbox"
                checked={settings.meetingReminders}
                onChange={(e) =>
                  handleChange("meetingReminders", e.target.checked)
                }
                className="w-4 h-4 accent-[var(--brand-primary)] rounded"
              />
              <span className="ml-3 text-sm text-[var(--brand-ink)]">
                Reminders before scheduled meetings
              </span>
            </label>
            <label className="flex items-center cursor-pointer hover:bg-[var(--brand-bg)] -mx-2 px-2 py-2 rounded transition">
              <input
                type="checkbox"
                checked={settings.weeklyDigest}
                onChange={(e) => handleChange("weeklyDigest", e.target.checked)}
                className="w-4 h-4 accent-[var(--brand-primary)] rounded"
              />
              <span className="ml-3 text-sm text-[var(--brand-ink)]">
                Weekly digest of your meetings
              </span>
            </label>
          </div>
        </SettingGroup>

        {/* Calendar Settings */}
        <SettingGroup
          icon={Clock}
          title="Calendar Preferences"
          description="Customize your calendar display"
        >
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-[var(--brand-ink)]">
                Week Starts On
              </label>
              <select
                value={settings.weekStartDay}
                onChange={(e) => handleChange("weekStartDay", e.target.value)}
                className="mt-2 w-full px-3 py-2 border border-[var(--brand-border)] rounded-lg bg-[var(--brand-bg)] text-[var(--brand-ink)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
              >
                <option>Monday</option>
                <option>Sunday</option>
                <option>Saturday</option>
              </select>
            </div>
            <label className="flex items-center cursor-pointer hover:bg-[var(--brand-bg)] -mx-2 px-2 py-2 rounded transition">
              <input
                type="checkbox"
                checked={settings.showAvailabilityPublicly}
                onChange={(e) =>
                  handleChange("showAvailabilityPublicly", e.target.checked)
                }
                className="w-4 h-4 accent-[var(--brand-primary)] rounded"
              />
              <span className="ml-3 text-sm text-[var(--brand-ink)]">
                Show availability publicly on booking page
              </span>
            </label>
          </div>
        </SettingGroup>

        {/* Save Button */}
        <div className="flex justify-end gap-3 mt-8">
          <button className="px-4 py-2 border border-[var(--brand-border)] rounded-lg text-[var(--brand-ink)] hover:bg-[var(--brand-bg)] transition-colors">
            Cancel
          </button>
          <Button
            onClick={handleSave}
            icon={Save}
            className="flex items-center gap-2"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
