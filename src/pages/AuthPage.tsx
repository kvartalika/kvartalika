import {type FormEvent, useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useAuthStore, type UserRole} from "../store/auth.store.ts";
import type {LoginRequest} from "../services";

const AuthPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [currentRole, setCurrentRole] = useState<UserRole>('ADMIN');

  const {
    loginAsAdmin,
    loginAsContentManager,
    role,
    isAuthenticated,
    isLoading: authLoading,
    error,
  } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && role) {
      if (role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
  }, [isAuthenticated, role, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const req: LoginRequest = {email, password};

    try {
      if (currentRole === 'ADMIN') {
        await loginAsAdmin(req);
      } else if (currentRole === 'CONTENT_MANAGER') {
        await loginAsContentManager(req);
      }
    } catch (err) {
      console.log(err);
    }
  };

  if (authLoading || isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Войти в систему
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Введите ваши учетные данные
          </p>
        </div>
        <form
          className="mt-8 space-y-6"
          onSubmit={handleSubmit}
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Роль</label>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={currentRole === 'ADMIN'}
                onChange={() => {
                  setCurrentRole(currentRole === 'ADMIN' ? 'CONTENT_MANAGER' : 'ADMIN');
                }}
                className="w-4 h-4"
                id="admin-checkbox"
              />
              <label
                htmlFor="admin-checkbox"
                className="ml-2 text-sm"
              >
                Админ
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={currentRole === 'CONTENT_MANAGER'}
                onChange={() => {
                  setCurrentRole(currentRole === 'CONTENT_MANAGER' ? 'ADMIN' : 'CONTENT_MANAGER');
                }}
                className="w-4 h-4"
                id="cm-checkbox"
              />
              <label
                htmlFor='cm-checkbox'
                className="ml-2 text-sm"
              >
                Контент Менеджер
              </label>
            </div>
          </div>

          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label
                htmlFor="email"
                className="sr-only"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="sr-only"
              >
                Пароль
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={authLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {authLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                'Войти'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;