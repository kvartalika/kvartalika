import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {
  useContentStore,
  useContentManagers,
  useContentLoading,
  useContentErrors
} from '../store/content.store.ts';
import {useAuthStore} from "../store/auth.store.ts";

const AdminPage = () => {
  const {role, isAuthenticated, logout} = useAuthStore();
  const navigate = useNavigate();

  const contentManagers = useContentManagers();
  const loading = useContentLoading();
  const errors = useContentErrors();

  const loadContentManagers = useContentStore(state => state.loadContentManagers);
  const saveContentManager = useContentStore(state => state.saveContentManager);
  const removeContentManager = useContentStore(state => state.removeContentManager);
  const editContentManager = useContentStore(state => state.editContentManager);
  const contentManagerForm = useContentStore(state => state.contentManagerForm);
  const setContentManagerForm = useContentStore(state => state.setContentManagerForm);
  const ui = useContentStore(state => state.ui);
  const setShowForm = useContentStore(state => state.setShowForm);
  const setEditMode = useContentStore(state => state.setEditMode);
  const clearErrors = useContentStore(state => state.clearErrors);

  const [activeTab, setActiveTab] = useState<'managers' | 'files' | 'directories'>('managers');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [newDirectoryName, setNewDirectoryName] = useState('');
  const [files, setFiles] = useState<FileItem[]>([]);
  const [directories, setDirectories] = useState<Directory[]>([]);
  const [currentDirectory, setCurrentDirectory] = useState('/');
  const [isLoadingLocal, setIsLoadingLocal] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated || role !== 'ADMIN') {
      navigate('/auth');
      return;
    }
    void loadContentManagers();
    // TODO: load files/directories if real API exists
  }, [isAuthenticated, role, navigate, loadContentManagers]);

  const handleLogout = async () => {
    await logout();
    navigate('/auth');
  };

  const handleCreateOrUpdateManager = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();
    const success = await saveContentManager(contentManagerForm as any);
    if (success) {
      setShowForm(false);
      setEditMode(false);
    }
  };

  const handleEdit = (id: string) => {
    const manager = contentManagers.find(m => m.id === id);
    if (manager) {
      editContentManager(manager);
    }
  };

  const handleDeleteManager = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить этого контент-менеджера?')) return;
    await removeContentManager(id);
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
            {['managers', 'files', 'directories'].map(tab => (
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

        {(errors && Object.values(errors).some(Boolean)) && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {Object.entries(errors)
              .filter(([, v]) => v)
              .map(([k, v]) => (
                <div key={k}>
                  <strong>{k}:</strong> {v}
                </div>
              ))}
          </div>
        )}

        {localError && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {localError}
          </div>
        )}

        {(loading.contentManagers || isLoadingLocal) ? (
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
                      {ui.editMode ? 'Edit Content Manager' : 'Create Content Manager'}
                    </h3>
                    <button
                      onClick={() => {
                        setShowForm(true);
                        setEditMode(false);
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
                          Username
                        </label>
                        <input
                          type="text"
                          value={(contentManagerForm as any).username || ''}
                          onChange={(e) => setContentManagerForm({username: e.target.value})}
                          className="w-full border rounded px-3 py-2"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          value={(contentManagerForm as any).email || ''}
                          onChange={(e) => setContentManagerForm({email: e.target.value})}
                          className="w-full border rounded px-3 py-2"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Role
                        </label>
                        <select
                          value={(contentManagerForm as any).role || ''}
                          onChange={(e) => setContentManagerForm({role: e.target.value as any})}
                          className="w-full border rounded px-3 py-2"
                        >
                          <option value="content_manager">Content Manager</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Password {ui.editMode ? '(оставьте пустым чтобы не менять)' : ''}
                        </label>
                        <input
                          type="password"
                          value={(contentManagerForm as any).password || ''}
                          onChange={(e) => setContentManagerForm({password: e.target.value})}
                          className="w-full border rounded px-3 py-2"
                          {...(ui.editMode ? {} : {required: true})}
                        />
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4 border-t">
                      <button
                        type="button"
                        onClick={() => {
                          setShowForm(false);
                          setEditMode(false);
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                      >
                        Отмена
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        {ui.editMode ? 'Сохранить' : 'Создать'}
                      </button>
                    </div>
                  </form>
                </div>

                <div className="bg-white shadow rounded-lg overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-900">Content Managers</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Username
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Email
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Role
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {contentManagers.map((mgr) => (
                          <tr key={mgr.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {mgr.username}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {mgr.email}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              {mgr.role}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
                              <button
                                onClick={() => handleEdit(mgr.id)}
                                className="text-blue-600 hover:underline"
                              >
                                Редактировать
                              </button>
                              <button
                                onClick={() => handleDeleteManager(mgr.id)}
                                className="text-red-600 hover:underline"
                              >
                                Удалить
                              </button>
                            </td>
                          </tr>
                        ))}
                        {contentManagers.length === 0 && (
                          <tr>
                            <td
                              colSpan={4}
                              className="px-6 py-4 text-center text-sm text-gray-500"
                            >
                              Нет контент-менеджеров
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Files Tab - заглушка */}
            {activeTab === 'files' && (
              <div>
                <div className="bg-white shadow rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Upload File (заглушка)</h3>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      alert('Загрузка файлов пока не реализована');
                    }}
                    className="flex items-center space-x-4"
                  >
                    <input
                      type="file"
                      onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                      className="border rounded px-3 py-2"
                      required
                    />
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      Upload
                    </button>
                  </form>
                </div>

                <div className="bg-white shadow rounded-lg">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Files in {currentDirectory}</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <p className="p-4 text-sm text-gray-500">Файловая система пока не подключена.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Directories Tab - заглушка */}
            {activeTab === 'directories' && (
              <div>
                <div className="bg-white shadow rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Create Directory (заглушка)</h3>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      alert('Создание папок пока не реализовано');
                    }}
                    className="flex items-center space-x-4"
                  >
                    <input
                      type="text"
                      placeholder="Directory name"
                      value={newDirectoryName}
                      onChange={(e) => setNewDirectoryName(e.target.value)}
                      className="border rounded px-3 py-2"
                      required
                    />
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      Create
                    </button>
                  </form>
                </div>

                <div className="bg-white shadow rounded-lg">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Directories</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <p className="p-4 text-sm text-gray-500">Файловая система пока не подключена.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;