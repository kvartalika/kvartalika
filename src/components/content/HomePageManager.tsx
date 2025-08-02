import {useAuthStore} from "../../store";
import type {ReactNode} from "react";

interface HomePageManagerProps {
  onCancel: () => void;
  children: ReactNode;
}

const HomePageManager = ({onCancel, children}: HomePageManagerProps) => {
  const {role, isAuthenticated} = useAuthStore();

  if (!isAuthenticated || !role || role === "CLIENT") {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Редактировать главную страницу</h2>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6">
          {children}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Отмена
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePageManager;