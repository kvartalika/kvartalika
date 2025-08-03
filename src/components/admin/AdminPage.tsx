import {
  type FormEvent,
  useEffect,
  useState,
  useCallback,
  type FC,
} from 'react';
import {useNavigate} from 'react-router-dom';
import {useAdminStore, useAuthStore, useUIStore} from '../../store';
import type {Tab, UserDto} from '../../services';
import TabSwitcher from './TabSwitcher.tsx';
import Panel from './Panel.tsx';
import UserForm from './UserForm.tsx';
import FileExplorer from '../file-explorer/FileExplorer.tsx';
import DirectoryBrowser from '../file-explorer/DirectoryBrowser.tsx';
import UserList from "./UserList.tsx";
import Alert from './Alert.tsx';

const AdminPage: FC = () => {
  const {role, isAuthenticated} = useAuthStore();
  const navigate = useNavigate();
  const {addNotification} = useUIStore();

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

    currentPath,
    setCurrentPath,
    directories,
    currentDirectoryFiles,
    isLoadingDirectories,
    isLoadingFiles,
    listDirectories,
    getDirectory,
    listFilesInDir,
    createDirectory,
    deleteDirectory,
    uploadFile,
    downloadFile,
    deleteFile,
  } = useAdminStore();

  const [activeTab, setActiveTab] = useState<Tab>('managers');
  const [formData, setFormData] = useState<UserDto>(() => ({
    name: '',
    surname: '',
    patronymic: '',
    email: '',
    phone: '',
    password: '',
    role: "CONTENT_MANAGER",
    telegramId: '',
  }));
  const [editingType, setEditingType] = useState<'manager' | 'admin'>('manager');
  const [isEditMode, setIsEditMode] = useState(false);
  const [newDirectoryName, setNewDirectoryName] = useState('');

  useEffect(() => {
    if (!isAuthenticated || role !== 'ADMIN') {
      navigate('/auth');
      return;
    }
    void loadContentManagers();
    void loadAdmins();
  }, [isAuthenticated, role, navigate, loadContentManagers, loadAdmins]);

  const [prevTab, setPrevTab] = useState<Tab | null>(null);

  useEffect(() => {
    if (activeTab === 'files') {
      void listDirectories();
      void listFilesInDir(currentPath);
      void getDirectory(currentPath);

      if (prevTab !== 'files') {
        void setCurrentPath([]);
        void getDirectory([]);
        void listFilesInDir([]);
      }
    }

    setPrevTab(activeTab);
  }, [
    activeTab,
    currentPath,
    listDirectories,
    getDirectory,
    listFilesInDir,
    setCurrentPath,
    prevTab,
  ]);

  const resetForm = useCallback(() => {
    setFormData({
      name: '',
      surname: '',
      patronymic: '',
      email: '',
      phone: '',
      password: '',
      role: editingType === "admin" ? "ADMIN" : "CONTENT_MANAGER",
      telegramId: '',
    });
    setIsEditMode(false);
    setEditingType('manager');
  }, [editingType]);

  const handleSubmitManager = async (e: FormEvent) => {
    e.preventDefault();
    clearError();
    try {
      if (isEditMode && editingType === 'manager') {
        await editContentManager(formData.email, formData);
        addNotification({
          type: 'success',
          title: 'Обновлено',
          message: 'Контент-менеджер обновлён'
        });
      } else {
        await addContentManager(formData);
        addNotification({
          type: 'success',
          title: 'Создано',
          message: 'Контент-менеджер добавлен'
        });
      }
      resetForm();
    } catch {
      // store shows error
    }
  };

  const handleSubmitAdmin = async (e: FormEvent) => {
    e.preventDefault();
    clearError();
    try {
      if (isEditMode && editingType === 'admin') {
        await editAdmin(formData.email, formData);
        addNotification({
          type: 'success',
          title: 'Обновлено',
          message: 'Админ обновлён'
        });
      } else {
        await addAdmin(formData);
        addNotification({
          type: 'success',
          title: 'Создано',
          message: 'Админ добавлен'
        });
      }
      resetForm();
    } catch {
      // store shows error
    }
  };

  const startEdit = (item: UserDto, type: 'manager' | 'admin') => {
    setEditingType(type);
    setFormData({
      name: item.name || '',
      surname: item.surname || '',
      patronymic: item.patronymic || '',
      email: item.email,
      phone: item.phone || '',
      password: '',
      role: type === 'manager' ? 'CONTENT_MANAGER' : 'ADMIN',
      telegramId: item.telegramId || '',
    });
    setIsEditMode(true);
  };

  const handleDelete = async (email: string, type: 'manager' | 'admin') => {
    if (!window.confirm('Вы уверены?')) return;
    try {
      if (type === 'manager') {
        await removeContentManager(email);
        addNotification({
          type: 'success',
          title: 'Удалено',
          message: 'Контент-менеджер удалён'
        });
      } else {
        await removeAdmin(email);
        addNotification({
          type: 'success',
          title: 'Удалено',
          message: 'Админ удалён'
        });
      }
    } catch {
      // error from store
    }
  };

  const handleCreateDirectory = async () => {
    if (!newDirectoryName.trim()) return;
    try {
      await createDirectory([...currentPath, newDirectoryName.trim()]);
      setNewDirectoryName('');
      await getDirectory(currentPath);
      await listFilesInDir(currentPath);
    } catch {
      // handled in store
    }
  };

  const handleNavigateDirectory = async (nextPath: string[]) => {
    setCurrentPath(nextPath);
    await getDirectory(nextPath);
    await listFilesInDir(nextPath);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    await uploadFile(currentPath, f);
    await listFilesInDir(currentPath);
  };

  const handleDownload = async (path: string[]) => {
    try {
      const blob = await downloadFile(path);
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = path[path.length - 1];
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (e) {
      console.error("Download failed", e);
    }
  };

  const handleDeleteFile = async (path: string[]) => {
    await deleteFile(path);
    await listFilesInDir(currentPath);
  };

  const handleDeleteDirectory = async (name: string) => {
    await deleteDirectory([...currentPath, name]);
    await getDirectory(currentPath);
    await listFilesInDir(currentPath);
  };

  if (!isAuthenticated || role !== 'ADMIN') return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <TabSwitcher
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        {(error) && (
          <div className="space-y-2">
            {error && <Alert type="error">{error}</Alert>}
          </div>
        )}

        {(isLoadingContentManagers || isLoadingAdmins) ? (
          <div className="mt-8 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Content Managers */}
            {activeTab === 'managers' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Panel title={isEditMode && editingType === 'manager' ? 'Edit Content Manager' : 'Create Content Manager'}>
                  <UserForm
                    formData={formData}
                    setFormData={setFormData}
                    onSubmit={handleSubmitManager}
                    onCancel={resetForm}
                    submitLabel={isEditMode && editingType === 'manager' ? 'Update' : 'Create'}
                    requirePassword={!isEditMode}
                  />
                </Panel>
                <Panel title="Content Managers">
                  <UserList
                    items={contentManagers}
                    onEdit={(u) => startEdit(u, 'manager')}
                    onDelete={(u) => handleDelete(u.email, 'manager')}
                  />
                </Panel>
              </div>
            )}

            {activeTab === 'admins' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Panel title={isEditMode && editingType === 'admin' ? 'Edit Admin' : 'Create Admin'}>
                  <UserForm
                    formData={formData}
                    setFormData={setFormData}
                    onSubmit={handleSubmitAdmin}
                    onCancel={resetForm}
                    submitLabel={isEditMode && editingType === 'admin' ? 'Update' : 'Create'}
                    requirePassword={!isEditMode}
                  />
                </Panel>
                <Panel title="Admins">
                  <UserList
                    items={admins}
                    onEdit={(u) => startEdit(u, 'admin')}
                    onDelete={(u) => handleDelete(u.email, 'admin')}
                  />
                </Panel>
              </div>
            )}

            {activeTab === 'files' && (
              <Panel title="File & Directory Management">
                <div className="flex flex-col gap-6">
                  {/* Breadcrumb and Controls */}
                  <div className="flex flex-wrap gap-4 items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="flex gap-2">
                        <input
                          type="file"
                          onChange={handleUpload}
                          className="border rounded px-3 py-2 text-sm"
                        />
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="New directory name"
                          value={newDirectoryName}
                          onChange={(e) => setNewDirectoryName(e.target.value)}
                          className="border rounded px-3 py-2 text-sm"
                        />
                        <button
                          onClick={handleCreateDirectory}
                          disabled={!newDirectoryName.trim()}
                          className="px-3 py-2 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700 disabled:opacity-50"
                        >
                          Create Dir
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-medium">
                        Current: /{currentPath.join('/')}
                      </div>
                      <button
                        onClick={() => void listFilesInDir(currentPath)}
                        className="px-3 py-2 bg-gray-200 rounded text-sm hover:bg-gray-300"
                      >
                        Refresh
                      </button>
                    </div>
                  </div>

                  {/* Breadcrumb Navigation */}
                  <div className="flex items-center gap-2 text-sm">
                    <button
                      onClick={() => handleNavigateDirectory([])}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      root
                    </button>
                    {currentPath.map((segment, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <span className="text-gray-400">/</span>
                        <button
                          onClick={() => handleNavigateDirectory(currentPath.slice(0, index + 1))}
                          className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                          {segment}
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Combined File and Directory View */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {/* Directories */}
                    {!isLoadingDirectories && directories.map(dir => (
                      <div
                        key={dir}
                        className="border rounded-lg p-4 bg-white hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => handleNavigateDirectory([...currentPath, dir])}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-5l-2-2H5a2 2 0 00-2 2z" />
                            </svg>
                            <span className="font-medium text-gray-900">{dir}</span>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteDirectory(dir);
                            }}
                            className="text-red-500 hover:text-red-700 text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* Files */}
                    {!isLoadingFiles && currentDirectoryFiles.map(({ name }) => {
                      const isImage = /\.(jpe?g|png|webp|gif)$/i.test(name);
                      const baseUrl = import.meta.env.VITE_API_BASE_URL + '/files';
                      const getFileUrl = (currentDirectory: string[], fileName: string) => {
                        if (fileName.includes('/')) {
                          return `${baseUrl}/${encodeURIComponent(fileName)}`;
                        }
                        const fullPath = [...currentDirectory, fileName].map(encodeURIComponent).join('/');
                        return `${baseUrl}/${fullPath}`;
                      };
                      const previewUrl = isImage ? getFileUrl(currentPath, name) : null;

                      return (
                        <div key={name} className="border rounded-lg p-4 bg-white hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              <span className="font-medium text-gray-900 truncate">{name}</span>
                            </div>
                          </div>
                          {previewUrl && (
                            <img
                              src={previewUrl}
                              alt={name}
                              className="h-20 w-full object-cover rounded mb-2"
                            />
                          )}
                          <div className="flex gap-2 text-xs">
                            <button
                              onClick={() => handleDownload(name.includes('/') ? [name] : [...currentPath, name])}
                              className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                              Download
                            </button>
                            <button
                              onClick={() => handleDeleteFile(name.includes('/') ? [name] : [...currentPath, name])}
                              className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      );
                    })}

                    {/* Loading States */}
                    {(isLoadingDirectories || isLoadingFiles) && (
                      <div className="col-span-full flex justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                      </div>
                    )}

                    {/* Empty State */}
                    {!isLoadingDirectories && !isLoadingFiles && directories.length === 0 && currentDirectoryFiles.length === 0 && (
                      <div className="col-span-full text-center py-8 text-gray-500">
                        No files or directories in this location
                      </div>
                    )}
                  </div>
                </div>
              </Panel>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;