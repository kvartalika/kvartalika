import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  useAuthStore, 
  useContentStore, 
  useUIStore,
  useIsAuthenticated,
  useAuthUser,
  useAuthRole 
} from '../store';

const AdminPage = () => {
  const isAuthenticated = useIsAuthenticated();
  const user = useAuthUser();
  const role = useAuthRole();
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const { addNotification } = useUIStore();
  
  const {
    contentManagers,
    stats,
    ui,
    loading,
    errors,
    loadContentManagers,
    saveContentManager,
    removeContentManager,
    editContentManager,
    setActiveTab,
    setShowForm,
    setContentManagerForm,
    contentManagerForm,
    refreshAll,
  } = useContentStore();

  useEffect(() => {
    if (!isAuthenticated || role !== 'admin') {
      navigate('/auth');
      return;
    }

    // Load admin data
    loadContentManagers();
    refreshAll();
  }, [isAuthenticated, role, navigate]);

  const handleCreateContentManager = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const success = await saveContentManager({
        username: contentManagerForm.username!,
        email: contentManagerForm.email!,
        password: contentManagerForm.password!,
        role: 'content_manager',
      });

      if (success) {
        addNotification({
          type: 'success',
          title: 'Менеджер создан',
          message: 'Контент-менеджер успешно создан',
        });
      }
    } catch (error: any) {
      addNotification({
        type: 'error',
        title: 'Ошибка создания',
        message: error.message || 'Не удалось создать контент-менеджера',
      });
    }
  };

  const handleDeleteContentManager = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить этого контент-менеджера?')) {
      return;
    }

    try {
      const success = await removeContentManager(id);
      if (success) {
        addNotification({
          type: 'success',
          title: 'Менеджер удален',
          message: 'Контент-менеджер успешно удален',
        });
      }
    } catch (error: any) {
      addNotification({
        type: 'error',
        title: 'Ошибка удаления',
        message: error.message || 'Не удалось удалить контент-менеджера',
      });
    }
  };

  const handleLogout = async () => {
    try {
      logout();
      navigate('/');
      addNotification({
        type: 'success',
        title: 'Выход выполнен',
        message: 'Вы успешно вышли из системы',
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (!isAuthenticated || role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Доступ запрещен</h1>
          <p className="text-gray-600 mb-4">У вас нет прав для доступа к этой странице</p>
          <button
            onClick={() => navigate('/auth')}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Войти в систему
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Панель администратора</h1>
              <p className="text-gray-600">Добро пожаловать, {user?.username}!</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Выйти
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                      <span className="text-white font-semibold">🏠</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Всего домов</dt>
                      <dd className="text-lg font-medium text-gray-900">{stats.totalHomes}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                      <span className="text-white font-semibold">🏢</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Всего квартир</dt>
                      <dd className="text-lg font-medium text-gray-900">{stats.totalFlats}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                      <span className="text-white font-semibold">📁</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Категории</dt>
                      <dd className="text-lg font-medium text-gray-900">{stats.totalCategories}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                      <span className="text-white font-semibold">📷</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Фотографии</dt>
                      <dd className="text-lg font-medium text-gray-900">{stats.totalPhotos}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="mb-8">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('managers')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  ui.activeTab === 'managers'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Контент-менеджеры
              </button>
              <button
                onClick={() => setActiveTab('flats')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  ui.activeTab === 'flats'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Квартиры
              </button>
              <button
                onClick={() => setActiveTab('homes')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  ui.activeTab === 'homes'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Дома
              </button>
              <button
                onClick={() => setActiveTab('photos')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  ui.activeTab === 'photos'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Фотографии
              </button>
            </nav>
          </div>

          {/* Content Area */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              
              {/* Content Managers Tab */}
              {ui.activeTab === 'managers' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-medium text-gray-900">Контент-менеджеры</h2>
                    <button
                      onClick={() => setShowForm(true)}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                      Добавить менеджера
                    </button>
                  </div>

                  {/* Content Manager Form */}
                  {ui.showForm && (
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">
                        {ui.editMode ? 'Редактировать менеджера' : 'Создать нового менеджера'}
                      </h3>
                      <form onSubmit={handleCreateContentManager} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Имя пользователя
                          </label>
                          <input
                            type="text"
                            value={contentManagerForm.username || ''}
                            onChange={(e) => setContentManagerForm({ username: e.target.value })}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Email
                          </label>
                          <input
                            type="email"
                            value={contentManagerForm.email || ''}
                            onChange={(e) => setContentManagerForm({ email: e.target.value })}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Пароль
                          </label>
                          <input
                            type="password"
                            value={contentManagerForm.password || ''}
                            onChange={(e) => setContentManagerForm({ password: e.target.value })}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            required={!ui.editMode}
                          />
                        </div>
                        <div className="flex space-x-4">
                          <button
                            type="submit"
                            disabled={loading.saving}
                            className="bg-blue-500 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded"
                          >
                            {loading.saving ? 'Сохранение...' : (ui.editMode ? 'Обновить' : 'Создать')}
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowForm(false)}
                            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                          >
                            Отмена
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Content Managers List */}
                  {loading.contentManagers ? (
                    <div className="text-center py-4">Загрузка...</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Пользователь
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Email
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Статус
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Создан
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Действия
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {contentManagers.map((manager) => (
                            <tr key={manager.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                  {manager.username}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{manager.email}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  manager.isActive 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {manager.isActive ? 'Активен' : 'Неактивен'}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(manager.createdAt).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button
                                  onClick={() => editContentManager(manager)}
                                  className="text-blue-600 hover:text-blue-900 mr-4"
                                >
                                  Редактировать
                                </button>
                                <button
                                  onClick={() => handleDeleteContentManager(manager.id)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  Удалить
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      
                      {contentManagers.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          Контент-менеджеры не найдены
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Other tabs can be implemented similarly */}
              {ui.activeTab !== 'managers' && (
                <div className="text-center py-8 text-gray-500">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {ui.activeTab === 'flats' && 'Управление квартирами'}
                    {ui.activeTab === 'homes' && 'Управление домами'}
                    {ui.activeTab === 'photos' && 'Управление фотографиями'}
                  </h3>
                  <p>Эта функция будет доступна в следующих версиях.</p>
                  <p className="text-sm mt-2">
                    Используйте панель контент-менеджера для управления содержимым.
                  </p>
                </div>
              )}

              {/* Error Display */}
              {Object.keys(errors).length > 0 && (
                <div className="mt-4 p-4 bg-red-50 rounded-lg">
                  <h4 className="text-red-800 font-medium">Ошибки:</h4>
                  <ul className="text-red-700 text-sm mt-2">
                    {Object.entries(errors).map(([key, error]) => (
                      error && <li key={key}>{key}: {error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPage;