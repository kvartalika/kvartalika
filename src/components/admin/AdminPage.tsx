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
    if (activeTab === 'directories') {
      void listDirectories();


      if (prevTab !== 'directories') {
        void setCurrentPath([]);
        void getDirectory([]);
        void listFilesInDir([]);
      }
    }

    if (activeTab === 'files') {
      void listFilesInDir(currentPath);
      void getDirectory(currentPath);
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

  if (!isAuthenticated || role !== 'ADMIN') return null;

  return (
    <div className="min-h-screen bg-gray-100 pt-16">
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
              <Panel title="File Management">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-wrap gap-4 items-center mb-4">
                    <div className="flex gap-2">
                      <input
                        type="file"
                        onChange={handleUpload}
                        className="border rounded px-2 py-1"
                      />
                    </div>
                    <div>
                      <strong>Current directory:</strong> /{currentPath.join('/')}
                    </div>
                    <div className="ml-auto flex gap-2">
                      <button
                        onClick={() => void listFilesInDir(currentPath)}
                        className="px-3 py-1 bg-gray-200 rounded"
                      >
                        Refresh files
                      </button>
                      <button
                        onClick={() => void getDirectory(currentPath)}
                        className="px-3 py-1 bg-gray-200 rounded"
                      >
                        Refresh dir
                      </button>
                    </div>
                  </div>

                  <FileExplorer
                    currentDirectory={currentPath}
                    files={currentDirectoryFiles}
                    loading={isLoadingFiles}
                    onRefresh={async () => {
                      await listFilesInDir(currentPath);
                    }}
                    onDownload={handleDownload}
                    onDelete={async (path) => {
                      await handleDeleteFile(path);
                    }}
                  />
                </div>
              </Panel>
            )}

            {activeTab === 'directories' && (
              <Panel title="Directory Management">
                <DirectoryBrowser
                  segments={currentPath}
                  directories={directories}
                  loading={isLoadingDirectories}
                  onNavigate={handleNavigateDirectory}
                  newDirName={newDirectoryName}
                  setNewDirName={setNewDirectoryName}
                  onCreate={handleCreateDirectory}
                  onDelete={async (name) => {
                    await deleteDirectory([...currentPath, name]);
                    await getDirectory(currentPath);
                  }}
                />
              </Panel>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;