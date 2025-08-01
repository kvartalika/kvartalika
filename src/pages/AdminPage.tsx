import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useAdminStore, useAuthStore} from "../store";
import type {UserDto} from '../services';

const AdminPage = () => {
  const {role, isAuthenticated, logout} = useAuthStore();
  const navigate = useNavigate();

  const {
    contentManagers,
    admins,
    isLoadingContentManagers,
    isLoadingAdmins,
    error,
    loadContentManagers,
    addContentManager,
    editContentManager,
    removeContentManager,
    loadAdmins,
    addAdmin,
    editAdmin,
    removeAdmin,
    clearError,
  } = useAdminStore();

  const [activeTab, setActiveTab] = useState<'managers' | 'admins' | 'files' | 'directories'>('managers');

  // Form states
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<UserDto>({
    name: '',
    surname: '',
    patronymic: '',
    email: '',
    phone: '',
    password: '',
    role: 'CONTENT_MANAGER',
    telegramId: '',
  });

  useEffect(() => {
    if (!isAuthenticated || role !== 'ADMIN') {
      navigate('/auth');
      return;
    }
    void loadContentManagers();
    void loadAdmins();
    // TODO: load files/directories if real API exists
  }, [isAuthenticated, role, navigate, loadContentManagers, loadAdmins]);

  const handleLogout = async () => {
    await logout();
    navigate('/auth');
  };

  const handleCreateOrUpdateManager = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    try {
      if (editMode) {
        await editContentManager(formData.email, formData);
      } else {
        await addContentManager(formData);
      }
      setEditMode(false);
      resetForm();
    } catch (error) {
      // Error is handled by the store
    }
  };

  const handleCreateOrUpdateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    try {
      if (editMode) {
        await editAdmin(formData.email, formData);
      } else {
        await addAdmin(formData);
      }
      setEditMode(false);
      resetForm();
    } catch (error) {
      // Error is handled by the store
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      surname: '',
      patronymic: '',
      email: '',
      phone: '',
      password: '',
      role: 'CONTENT_MANAGER',
      telegramId: '',
    });
  };

  const handleEdit = (item: any, type: 'manager' | 'admin') => {
    setFormData({
      name: item.name || '',
      surname: item.surname || '',
      patronymic: item.patronymic || '',
      email: item.email,
      phone: item.phone || '',
      password: '', // Don't populate password for security
      role: type === 'manager' ? 'CONTENT_MANAGER' : 'ADMIN',
      telegramId: item.telegramId || '',
    });
    setEditMode(true);
  };

  const handleDeleteManager = async (email: string) => {
    if (!confirm('Вы уверены, что хотите удалить этого контент-менеджера?')) return;
    await removeContentManager(email);
  };

  const handleDeleteAdmin = async (email: string) => {
    if (!confirm('Вы уверены, что хотите удалить этого администратора?')) return;
    await removeAdmin(email);
  };

  if (!isAuthenticated || role !== 'ADMIN') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {role}</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {['managers', 'admins', 'files', 'directories'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
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

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {(isLoadingContentManagers || isLoadingAdmins) ? (
          <div className="mt-8 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="mt-8 space-y-8">
            {/* Content Managers Tab */}
            {activeTab === 'managers' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white shadow rounded-lg p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      {editMode ? 'Edit Content Manager' : 'Create Content Manager'}
                    </h3>
                    <button
                      onClick={() => {
                        setEditMode(false);
                        resetForm();
                      }}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Новая запись
                    </button>
                  </div>

                  <form
                    onSubmit={handleCreateOrUpdateManager}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Name
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({
                            ...formData,
                            name: e.target.value
                          })}
                          className="w-full border rounded px-3 py-2"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Surname
                        </label>
                        <input
                          type="text"
                          value={formData.surname}
                          onChange={(e) => setFormData({
                            ...formData,
                            surname: e.target.value
                          })}
                          className="w-full border rounded px-3 py-2"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Patronymic
                        </label>
                        <input
                          type="text"
                          value={formData.patronymic || ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            patronymic: e.target.value
                          })}
                          className="w-full border rounded px-3 py-2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({
                            ...formData,
                            email: e.target.value
                          })}
                          className="w-full border rounded px-3 py-2"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone
                        </label>
                        <input
                          type="tel"
                          value={formData.phone || ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            phone: e.target.value
                          })}
                          className="w-full border rounded px-3 py-2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Password
                        </label>
                        <input
                          type="password"
                          value={formData.password}
                          onChange={(e) => setFormData({
                            ...formData,
                            password: e.target.value
                          })}
                          className="w-full border rounded px-3 py-2"
                          required={!editMode}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Telegram ID
                        </label>
                        <input
                          type="text"
                          value={formData.telegramId || ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            telegramId: e.target.value
                          })}
                          className="w-full border rounded px-3 py-2"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => {
                          
                          setEditMode(false);
                          resetForm();
                        }}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        {editMode ? 'Update' : 'Create'}
                      </button>
                    </div>
                  </form>
                </div>

                <div className="bg-white shadow rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Content Managers</h3>
                  <div className="space-y-3">
                    {contentManagers.map((manager) => (
                      <div
                        key={manager.email}
                        className="flex justify-between items-center p-3 border rounded"
                      >
                        <div>
                          <div className="font-medium">{manager.email}</div>
                          <div className="text-sm text-gray-500">{manager.role}</div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(manager, 'manager')}
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteManager(manager.email)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                    {contentManagers.length === 0 && (
                      <div className="text-gray-500 text-center py-4">No content managers found</div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Admins Tab */}
            {activeTab === 'admins' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white shadow rounded-lg p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      {editMode ? 'Edit Admin' : 'Create Admin'}
                    </h3>
                    <button
                      onClick={() => {
                        setEditMode(false);
                        resetForm();
                        setFormData({...formData, role: 'ADMIN'});
                      }}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Новая запись
                    </button>
                  </div>

                  <form
                    onSubmit={handleCreateOrUpdateAdmin}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Name
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({
                            ...formData,
                            name: e.target.value
                          })}
                          className="w-full border rounded px-3 py-2"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Surname
                        </label>
                        <input
                          type="text"
                          value={formData.surname}
                          onChange={(e) => setFormData({
                            ...formData,
                            surname: e.target.value
                          })}
                          className="w-full border rounded px-3 py-2"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Patronymic
                        </label>
                        <input
                          type="text"
                          value={formData.patronymic || ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            patronymic: e.target.value
                          })}
                          className="w-full border rounded px-3 py-2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({
                            ...formData,
                            email: e.target.value
                          })}
                          className="w-full border rounded px-3 py-2"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone
                        </label>
                        <input
                          type="tel"
                          value={formData.phone || ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            phone: e.target.value
                          })}
                          className="w-full border rounded px-3 py-2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Password
                        </label>
                        <input
                          type="password"
                          value={formData.password}
                          onChange={(e) => setFormData({
                            ...formData,
                            password: e.target.value
                          })}
                          className="w-full border rounded px-3 py-2"
                          required={!editMode}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Telegram ID
                        </label>
                        <input
                          type="text"
                          value={formData.telegramId || ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            telegramId: e.target.value
                          })}
                          className="w-full border rounded px-3 py-2"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => {
                          
                          setEditMode(false);
                          resetForm();
                        }}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        {editMode ? 'Update' : 'Create'}
                      </button>
                    </div>
                  </form>
                </div>

                <div className="bg-white shadow rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Admins</h3>
                  <div className="space-y-3">
                    {admins.map((admin) => (
                      <div
                        key={admin.email}
                        className="flex justify-between items-center p-3 border rounded"
                      >
                        <div>
                          <div className="font-medium">{admin.email}</div>
                          <div className="text-sm text-gray-500">{admin.role}</div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(admin, 'admin')}
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteAdmin(admin.email)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                    {admins.length === 0 && (
                      <div className="text-gray-500 text-center py-4">No admins found</div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Files and Directories tabs remain the same for now */}
            {activeTab === 'files' && (
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">File Management</h3>
                <p className="text-gray-500">File management functionality will be implemented here.</p>
              </div>
            )}

            {activeTab === 'directories' && (
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Directory Management</h3>
                <p className="text-gray-500">Directory management functionality will be implemented here.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};



export default AdminPage;