import {type FC} from "react";

const Header: FC<{ role: string; onLogout: () => void }> = ({
                                                              role,
                                                              onLogout
                                                            }) => (
  <div className="bg-white shadow">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center py-6">
        <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
        <div className="flex items-center space-x-4">
          <span className="text-gray-700">Welcome, {role}</span>
          <button
            onClick={onLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default Header;