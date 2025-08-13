import {
  type FormEvent,
  useEffect,
  useState,
  useCallback,
  type FC, type ChangeEvent,
} from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdminStore } from '../../store/admin.store.ts'
import type { Tab, UserDto } from '../../services'
import TabSwitcher from './TabSwitcher.tsx'
import Panel from './Panel.tsx'
import UserForm from './UserForm.tsx'
import UserList from './UserList.tsx'
import Alert from './Alert.tsx'
import UnifiedFileManager from '../file-explorer/UnifiedFileManager.tsx'
import { useAuthStore } from '../../store/auth.store.ts'
import { useUIStore } from '../../store/ui.store.ts'

const AdminPage: FC = () => {
  const { role, isAuthenticated } = useAuthStore()
  const navigate = useNavigate()
  const { addNotification } = useUIStore()

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
    currentDirectoryDirs,
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
  } = useAdminStore()

  const [activeTab, setActiveTab] = useState<Tab>('files')
  const [formData, setFormData] = useState<UserDto>(() => ({
    name: '',
    surname: '',
    patronymic: '',
    email: '',
    phone: '',
    password: '',
    role: 'CONTENT_MANAGER',
    telegramId: '',
  }))
  const [editingType, setEditingType] = useState<'manager' | 'admin'>('manager')
  const [isEditMode, setIsEditMode] = useState(false)
  const [newDirectoryName, setNewDirectoryName] = useState('')

  useEffect(() => {
    if (!isAuthenticated || !['ADMIN', 'CONTENT_MANAGER'].includes(role || '')) {
      navigate('/auth')
      return
    }
  }, [isAuthenticated, role, navigate])

  const [prevTab, setPrevTab] = useState<Tab | null>(null)

  const [pendingFile, setPendingFile] = useState<File | null>(null)

  useEffect(() => {
    if (activeTab === 'files') {
      void listDirectories()
      void listFilesInDir(currentPath)
      void getDirectory(currentPath)
    }

    if (activeTab === 'managers') {
      void loadContentManagers()
    }

    if (activeTab === 'admins') {
      void loadAdmins()
    }

    setPrevTab(activeTab)
  }, [activeTab, currentPath, listDirectories, getDirectory, listFilesInDir, setCurrentPath, prevTab, loadContentManagers, loadAdmins])

  const resetForm = useCallback(() => {
    setFormData({
      name: '',
      surname: '',
      patronymic: '',
      email: '',
      phone: '',
      password: '',
      role: editingType === 'admin' ? 'ADMIN' : 'CONTENT_MANAGER',
      telegramId: '',
    })
    setIsEditMode(false)
    setEditingType('manager')
  }, [editingType])

  const handleSubmitManager = async (e: FormEvent) => {
    e.preventDefault()
    clearError()
    try {
      if (isEditMode && editingType === 'manager') {
        await editContentManager(formData.email, formData)
        addNotification({
          type: 'success',
          title: 'Обновлено',
          message: 'Content-менеджер обновлён'
        })
      } else {
        await addContentManager(formData)
        addNotification({
          type: 'success',
          title: 'Создано',
          message: 'Content-менеджер добавлен'
        })
      }
      resetForm()
    } catch {
      // store shows error
    }
  }

  const handleSubmitAdmin = async (e: FormEvent) => {
    e.preventDefault()
    clearError()
    try {
      if (isEditMode && editingType === 'admin') {
        await editAdmin(formData.email, formData)
        addNotification({
          type: 'success',
          title: 'Обновлено',
          message: 'Админ обновлён'
        })
      } else {
        await addAdmin(formData)
        addNotification({
          type: 'success',
          title: 'Создано',
          message: 'Админ добавлен'
        })
      }
      resetForm()
    } catch {
      // store shows error
    }
  }

  const startEdit = (item: UserDto, type: 'manager' | 'admin') => {
    setEditingType(type)
    setFormData({
      name: item.name || '',
      surname: item.surname || '',
      patronymic: item.patronymic || '',
      email: item.email,
      phone: item.phone || '',
      password: '',
      role: type === 'manager' ? 'CONTENT_MANAGER' : 'ADMIN',
      telegramId: item.telegramId || '',
    })
    setIsEditMode(true)
  }

  const handleDelete = async (email: string, type: 'manager' | 'admin') => {
    if (!window.confirm('Вы уверены?')) return
    try {
      if (type === 'manager') {
        await removeContentManager(email)
        addNotification({
          type: 'success',
          title: 'Удалено',
          message: 'Content-менеджер удалён'
        })
      } else {
        await removeAdmin(email)
        addNotification({
          type: 'success',
          title: 'Удалено',
          message: 'Админ удалён'
        })
      }
    } catch {
      // error from store
    }
  }

  const handleCreateDirectory = async () => {
    if (!newDirectoryName.trim()) return
    try {
      await createDirectory([...currentPath, newDirectoryName.trim()])
      setNewDirectoryName('')
      await getDirectory(currentPath)
    } catch {
      // handled in store
    }
  }

  const handleNavigateDirectory = async (nextPath: string[]) => {
    setCurrentPath(nextPath)
    await getDirectory(nextPath)
    await listFilesInDir(nextPath)
  }

  const handleUploadClick = async () => {
    if (!pendingFile) return
    await uploadFile(currentPath, pendingFile)
    setPendingFile(null)
    await listFilesInDir(currentPath)
  }

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null
    setPendingFile(f)
    e.currentTarget.value = ''
  }

  const handleDownload = async (path: string[]) => {
    try {
      const blob = await downloadFile(path)
      if (!blob) return
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = path[path.length - 1]
      a.click()
      setTimeout(() => URL.revokeObjectURL(url), 1000)
    } catch (e) {
      console.error('Download failed', e)
    }
  }


  const handleDeleteFile = async (path: string[]) => {
    if (!window.confirm('Вы уверены?')) return
    await deleteFile(path)
    await listFilesInDir(currentPath)
  }

  if (!isAuthenticated || !['ADMIN', 'CONTENT_MANAGER'].includes(role || '')) return null

  return (
    <div className="min-h-screen bg-gray-100 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <TabSwitcher
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          role={role || 'CLIENT'}
        />

        {(error) && (
          <div className="space-y-2">
            {error && <Alert type="error">{error}</Alert>}
          </div>
        )}

        {(isLoadingContentManagers || isLoadingAdmins) ? (
          <div className="mt-8 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Content Managers */}
            {activeTab === 'managers' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Panel title={isEditMode && editingType === 'manager' ? 'Изменить Content Менеджера' : 'Создать Content Менеджера'}>
                  <UserForm
                    formData={formData}
                    setFormData={setFormData}
                    onSubmit={handleSubmitManager}
                    onCancel={resetForm}
                    submitLabel={isEditMode && editingType === 'manager' ? 'Изменить' : 'Создать'}
                    requirePassword={!isEditMode}
                  />
                </Panel>
                <Panel title="Content Менеджеры">
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
                <Panel title={isEditMode && editingType === 'admin' ? 'Изменить Админа' : 'Создать Админа'}>
                  <UserForm
                    formData={formData}
                    setFormData={setFormData}
                    onSubmit={handleSubmitAdmin}
                    onCancel={resetForm}
                    submitLabel={isEditMode && editingType === 'admin' ? 'Изменить' : 'Создать'}
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
                <UnifiedFileManager
                  currentPath={currentPath}
                  directories={currentDirectoryDirs}
                  files={currentDirectoryFiles}
                  isLoadingDirectories={isLoadingDirectories}
                  isLoadingFiles={isLoadingFiles}
                  newDirectoryName={newDirectoryName}
                  setNewDirectoryName={setNewDirectoryName}
                  onNavigate={handleNavigateDirectory}
                  onCreateDirectory={handleCreateDirectory}
                  onDeleteDirectory={async (name: string) => {
                    if (!window.confirm('Вы уверены?')) return
                    await deleteDirectory([name])
                    await getDirectory(currentPath)
                    await listDirectories()
                  }}

                  pendingFile={pendingFile}
                  setPendingFile={setPendingFile}
                  handleUploadClick={handleUploadClick}
                  handleFileSelect={handleFileSelect}

                  onDownload={handleDownload}
                  onDeleteFile={handleDeleteFile}
                  onRefresh={async () => {
                    await listDirectories()
                    await listFilesInDir(currentPath)
                    await getDirectory(currentPath)
                  }}
                />
              </Panel>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminPage