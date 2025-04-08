import React from 'react';

interface TabItem {
  id: string;
  label: string;
}

interface DashboardTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
}

const DashboardTabs: React.FC<DashboardTabsProps> = ({ tabs, activeTab, onChange }) => {
  return (
    <div className="flex rounded-lg bg-tertiary-dark p-1 mb-6">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`
            flex-1 rounded-md py-2 px-4 text-sm font-medium
            ${
              activeTab === tab.id
                ? 'bg-secondary-dark text-white'
                : 'text-gray-400 hover:text-white'
            }
          `}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default DashboardTabs;