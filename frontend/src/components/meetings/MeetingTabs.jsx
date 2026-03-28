const MeetingTabs = ({ activeTab, onChange, counts = {} }) => {
  const tabs = [
    { key: "upcoming", label: "Upcoming" },
    { key: "past", label: "Past" },
    { key: "cancelled", label: "Cancelled" },
  ];

  return (
    <div className="inline-flex rounded-lg border border-[#e4e7ec] bg-white p-1">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          type="button"
          onClick={() => onChange(tab.key)}
          className={`min-h-[44px] rounded-md px-4 text-sm font-medium ${
            activeTab === tab.key ? "bg-[#0069ff] text-white" : "text-[#667085]"
          }`}
        >
          {tab.label} ({counts[tab.key] || 0})
        </button>
      ))}
    </div>
  );
};

export default MeetingTabs;
