import { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';

const ManagerDashboardPage = () => {
  const { user, logout, apartments, complexes, setApartments, setComplexes } = useAppStore();
  const [activeTab, setActiveTab] = useState<'apartments' | 'complexes'>('apartments');
  const [editingItem, setEditingItem] = useState<any>(null);

  const handleLogout = () => {
    logout();
  };

  const handleEditApartment = (apartment: any) => {
    setEditingItem({ ...apartment, type: 'apartment' });
  };

  const handleEditComplex = (complex: any) => {
    setEditingItem({ ...complex, type: 'complex' });
  };

  const handleSaveChanges = () => {
    if (!editingItem) return;

    if (editingItem.type === 'apartment') {
      const updatedApartments = apartments.map(apt =>
        apt.id === editingItem.id ? { ...editingItem } : apt
      );
      setApartments(updatedApartments);
    } else if (editingItem.type === 'complex') {
      const updatedComplexes = complexes.map(complex =>
        complex.id === editingItem.id ? { ...editingItem } : complex
      );
      setComplexes(updatedComplexes);
    }

    setEditingItem(null);
    alert('Изменения сохранены!');
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Панель менеджера
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Добро пожаловать, {user?.username}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Выйти
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('apartments')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'apartments'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Квартиры ({apartments.length})
              </button>
              <button
                onClick={() => setActiveTab('complexes')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'complexes'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Комплексы ({complexes.length})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'apartments' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Управление квартирами
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {apartments.map((apartment) => (
                    <div key={apartment.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <img
                        src={apartment.image}
                        alt={`${apartment.rooms}-комн. квартира`}
                        className="w-full h-32 object-cover rounded-lg mb-3"
                        onError={(e) => {
                          e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDIwMCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTI4IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik04NyA1NEgxMTNWODBIODdWNTRaIiBzdHJva2U9IiM5Q0EzQUYiIHN0cm9rZS13aWR0aD0iMiIgZmlsbD0ibm9uZSIvPgo8L3N2Zz4K';
                        }}
                      />
                      <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                        {apartment.rooms}-комн. в {apartment.complex}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {apartment.address}
                      </p>
                      <p className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-3">
                        {apartment.price.toLocaleString('ru-RU')} ₽
                      </p>
                      <button
                        onClick={() => handleEditApartment(apartment)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm transition-colors"
                      >
                        Редактировать
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'complexes' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Управление комплексами
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {complexes.map((complex) => (
                    <div key={complex.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <img
                        src={complex.image}
                        alt={complex.name}
                        className="w-full h-32 object-cover rounded-lg mb-3"
                        onError={(e) => {
                          e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDIwMCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTI4IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik04NyA1NEgxMTNWODBIODdWNTRaIiBzdHJva2U9IiM5Q0EzQUYiIHN0cm9rZS13aWR0aD0iMiIgZmlsbD0ibm9uZSIvPgo8L3N2Zz4K';
                        }}
                      />
                      <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                        {complex.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {complex.address}
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 line-clamp-2">
                        {complex.description}
                      </p>
                      <button
                        onClick={() => handleEditComplex(complex)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm transition-colors"
                      >
                        Редактировать
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {editingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Редактирование {editingItem.type === 'apartment' ? 'квартиры' : 'комплекса'}
              </h3>
              
              <div className="space-y-4">
                {editingItem.type === 'apartment' ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Описание
                      </label>
                      <textarea
                        value={editingItem.description || ''}
                        onChange={(e) => setEditingItem({...editingItem, description: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        rows={3}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Цена
                      </label>
                      <input
                        type="number"
                        value={editingItem.price}
                        onChange={(e) => setEditingItem({...editingItem, price: Number(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        URL изображения
                      </label>
                      <input
                        type="text"
                        value={editingItem.image}
                        onChange={(e) => setEditingItem({...editingItem, image: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Название
                      </label>
                      <input
                        type="text"
                        value={editingItem.name}
                        onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Описание
                      </label>
                      <textarea
                        value={editingItem.description}
                        onChange={(e) => setEditingItem({...editingItem, description: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        rows={3}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        URL изображения
                      </label>
                      <input
                        type="text"
                        value={editingItem.image}
                        onChange={(e) => setEditingItem({...editingItem, image: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={handleCancelEdit}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Отмена
                </button>
                <button
                  onClick={handleSaveChanges}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Сохранить
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerDashboardPage;