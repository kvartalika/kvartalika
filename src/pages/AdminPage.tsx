import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';

interface User {
  id: number;
  name: string;
  surname: string;
  patronymic: string;
  email: string;
  phone: string;
  role: 'ADMIN' | 'CM';
  createdAt: string;
  updatedAt: string;
}

interface FileItem {
  id: number;
  name: string;
  path: string;
  size: number;
  type: string;
  createdAt: string;
}

interface Directory {
  id: number;
  name: string;
  path: string;
  createdAt: string;
}

const AdminPage = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'users' | 'files' | 'directories'>('users');
  const [users, setUsers] = useState<User[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [directories, setDirectories] = useState<Directory[]>([]);
  const [currentDirectory, setCurrentDirectory] = useState('/');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Form states
  const [newUser, setNewUser] = useState({
    name: '',
    surname: '',
    patronymic: '',
    email: '',
    phone: '',
    password: '',
    role: 'CM' as 'ADMIN' | 'CM'
  });
  const [newDirectory, setNewDirectory] = useState({ name: '' });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'ADMIN') {
      navigate('/auth');
      return;
    }
    loadData();
  }, [isAuthenticated, user, navigate, activeTab, currentDirectory]);

  const loadData = async () => {
    setIsLoading(true);
    setError('');
    try {
      // For testing, use mock API
      const { mockApi } = await import('../services/mockApi');

      if (activeTab === 'users') {
        const data = await mockApi.getUsers();
        setUsers(data);
      } else if (activeTab === 'files') {
        const data = await mockApi.getFiles(currentDirectory);
        setFiles(data.files);
        setDirectories(data.directories);
      }
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // For testing, use mock API
      const { mockApi } = await import('../services/mockApi');
      await mockApi.createUser(newUser);
      
      setNewUser({
        name: '',
        surname: '',
        patronymic: '',
        email: '',
        phone: '',
        password: '',
        role: 'CM'
      });
      loadData();
    } catch (err) {
      setError('Failed to create user');
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    try {
      // For testing, use mock API
      const { mockApi } = await import('../services/mockApi');
      await mockApi.deleteUser(userId);
      loadData();
    } catch (err) {
      setError('Failed to delete user');
    }
  };

  const handleCreateDirectory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // For testing, use mock API
      const { mockApi } = await import('../services/mockApi');
      await mockApi.createDirectory(newDirectory.name, currentDirectory);
      
      setNewDirectory({ name: '' });
      loadData();
    } catch (err) {
      setError('Failed to create directory');
    }
  };

  const handleDeleteDirectory = async (dirId: number) => {
    if (!confirm('Are you sure you want to delete this directory?')) return;
    
    try {
      // For testing, use mock API
      const { mockApi } = await import('../services/mockApi');
      await mockApi.deleteDirectory(dirId);
      loadData();
    } catch (err) {
      setError('Failed to delete directory');
    }
  };

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    try {
      // For testing, use mock API
      const { mockApi } = await import('../services/mockApi');
      await mockApi.uploadFile(selectedFile, currentDirectory);
      
      setSelectedFile(null);
      loadData();
    } catch (err) {
      setError('Failed to upload file');
    }
  };

  const handleDeleteFile = async (fileId: number) => {
    if (!confirm('Are you sure you want to delete this file?')) return;
    
    try {
      // For testing, use mock API
      const { mockApi } = await import('../services/mockApi');
      await mockApi.deleteFile(fileId);
      loadData();
    } catch (err) {
      setError('Failed to delete file');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/auth');
  };

  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user.name}</span>
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
            {['users', 'files', 'directories'].map((tab) => (
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

        {isLoading ? (
          <div className="mt-8 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="mt-8">
            {/* Users Tab */}
            {activeTab === 'users' && (
              <div>
                <div className="bg-white shadow rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Create New User</h3>
                  <form onSubmit={handleCreateUser} className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Name"
                      value={newUser.name}
                      onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                      className="border rounded px-3 py-2"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Surname"
                      value={newUser.surname}
                      onChange={(e) => setNewUser({...newUser, surname: e.target.value})}
                      className="border rounded px-3 py-2"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Patronymic"
                      value={newUser.patronymic}
                      onChange={(e) => setNewUser({...newUser, patronymic: e.target.value})}
                      className="border rounded px-3 py-2"
                      required
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                      className="border rounded px-3 py-2"
                      required
                    />
                    <input
                      type="tel"
                      placeholder="Phone"
                      value={newUser.phone}
                      onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                      className="border rounded px-3 py-2"
                      required
                    />
                    <input
                      type="password"
                      placeholder="Password"
                      value={newUser.password}
                      onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                      className="border rounded px-3 py-2"
                      required
                    />
                    <select
                      value={newUser.role}
                      onChange={(e) => setNewUser({...newUser, role: e.target.value as 'ADMIN' | 'CM'})}
                      className="border rounded px-3 py-2"
                    >
                      <option value="CM">Content Manager</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      Create User
                    </button>
                  </form>
                </div>

                <div className="bg-white shadow rounded-lg">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Users</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
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
                        {users.map((user) => (
                          <tr key={user.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {user.name} {user.surname}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {user.email}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                user.role === 'ADMIN' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                              }`}>
                                {user.role}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                onClick={() => handleDeleteUser(user.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Files Tab */}
            {activeTab === 'files' && (
              <div>
                <div className="bg-white shadow rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Upload File</h3>
                  <form onSubmit={handleFileUpload} className="flex items-center space-x-4">
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
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Size
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Type
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {files.map((file) => (
                          <tr key={file.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {file.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {(file.size / 1024).toFixed(2)} KB
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {file.type}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                onClick={() => handleDeleteFile(file.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Directories Tab */}
            {activeTab === 'directories' && (
              <div>
                <div className="bg-white shadow rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Create Directory</h3>
                  <form onSubmit={handleCreateDirectory} className="flex items-center space-x-4">
                    <input
                      type="text"
                      placeholder="Directory name"
                      value={newDirectory.name}
                      onChange={(e) => setNewDirectory({name: e.target.value})}
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
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Path
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {directories.map((dir) => (
                          <tr key={dir.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {dir.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {dir.path}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                onClick={() => handleDeleteDirectory(dir.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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