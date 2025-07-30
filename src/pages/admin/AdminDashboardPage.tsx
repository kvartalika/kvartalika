import { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';

const AdminDashboardPage = () => {
  const { user, logout, admins, inquiries, setInquiries, setAdmins } = useAppStore();
  const [activeTab, setActiveTab] = useState<'inquiries' | 'admins' | 'managers'>('inquiries');

  const handleLogout = () => {
    logout();
  };

  const updateInquiryStatus = (inquiryId: number, status: 'new' | 'contacted' | 'closed') => {
    const updatedInquiries = inquiries.map(inquiry =>
      inquiry.id === inquiryId ? { ...inquiry, status } : inquiry
    );
    setInquiries(updatedInquiries);
  };

  const deleteAdmin = (adminId: number) => {
    if (adminId === user?.id) {
      alert('Вы не можете удалить свою собственную учетную запись');
      return;
    }
    
    if (confirm('Вы уверены, что хотите удалить этого пользователя?')) {
      const updatedAdmins = admins.filter(admin => admin.id !== adminId);
      setAdmins(updatedAdmins);
    }
  };

  const adminUsers = admins.filter(admin => admin.role === 'admin');
  const managerUsers = admins.filter(admin => admin.role === 'manager');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Панель администратора
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
                onClick={() => setActiveTab('inquiries')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'inquiries'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Заявки ({inquiries.length})
              </button>
              <button
                onClick={() => setActiveTab('admins')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'admins'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Администраторы ({adminUsers.length})
              </button>
              <button
                onClick={() => setActiveTab('managers')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'managers'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Менеджеры ({managerUsers.length})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'inquiries' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Заявки клиентов
                </h2>
                {inquiries.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400">Заявок пока нет</p>
                ) : (
                  <div className="space-y-4">
                    {inquiries.map((inquiry) => (
                      <div key={inquiry.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">
                              {inquiry.name}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {inquiry.email} • {inquiry.phone}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <select
                              value={inquiry.status}
                              onChange={(e) => updateInquiryStatus(inquiry.id, e.target.value as any)}
                              className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            >
                              <option value="new">Новая</option>
                              <option value="contacted">Связались</option>
                              <option value="closed">Закрыта</option>
                            </select>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              inquiry.status === 'new' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                              inquiry.status === 'contacted' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                              'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            }`}>
                              {inquiry.status === 'new' ? 'Новая' :
                               inquiry.status === 'contacted' ? 'Связались' : 'Закрыта'}
                            </span>
                          </div>
                        </div>
                        {inquiry.message && (
                          <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">
                            {inquiry.message}
                          </p>
                        )}
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(inquiry.createdAt).toLocaleString('ru-RU')}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'admins' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Администраторы
                </h2>
                <div className="space-y-4">
                  {adminUsers.map((admin) => (
                    <div key={admin.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {admin.username}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {admin.email}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Создан: {new Date(admin.createdAt).toLocaleString('ru-RU')}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 text-xs rounded-full">
                            Администратор
                          </span>
                          {admin.id !== user?.id && (
                            <button
                              onClick={() => deleteAdmin(admin.id)}
                              className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'managers' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Менеджеры
                </h2>
                <div className="space-y-4">
                  {managerUsers.map((manager) => (
                    <div key={manager.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {manager.username}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {manager.email}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Создан: {new Date(manager.createdAt).toLocaleString('ru-RU')}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs rounded-full">
                            Менеджер
                          </span>
                          <button
                            onClick={() => deleteAdmin(manager.id)}
                            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;