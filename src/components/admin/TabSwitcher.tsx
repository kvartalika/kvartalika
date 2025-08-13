import { type FC } from 'react'
import { type Tab, TABS } from '../../services'
import type { UserRole } from '../../store/auth.store.ts'

const TabSwitcher: FC<{
  activeTab: Tab;
  setActiveTab: (t: Tab) => void
  role: UserRole;
}> = ({ activeTab, setActiveTab, role }) => (
  <div className="border-b border-gray-200">
    <nav className="-mb-px flex space-x-8">
      {TABS.filter(tab => role === 'ADMIN' || tab === 'files').map(tab => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`py-2 px-1 border-b-2 font-medium text-sm ${
            activeTab === tab
              ? 'border-primary-500 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          {tab.charAt(0).toUpperCase() + tab.slice(1)}
        </button>
      ))}
    </nav>
  </div>
)

export default TabSwitcher