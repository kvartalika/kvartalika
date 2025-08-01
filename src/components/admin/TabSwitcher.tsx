import {type FC} from "react";
import {type Tab, TABS} from "../../services";

const TabSwitcher: FC<{
  activeTab: Tab;
  setActiveTab: (t: Tab) => void
}> = ({activeTab, setActiveTab}) => (
  <div className="border-b border-gray-200">
    <nav className="-mb-px flex space-x-8">
      {TABS.map(tab => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`py-2 px-1 border-b-2 font-medium text-sm ${
            activeTab === tab
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          {tab.charAt(0).toUpperCase() + tab.slice(1)}
        </button>
      ))}
    </nav>
  </div>
);

export default TabSwitcher;