import {useEffect, useState} from 'react';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import Logo from './Logo';
import {useAuthStore, useUIStore} from "../store";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const {role, isAuthenticated, logout} = useAuthStore();

  const openModal = useUIStore(state => state.openModal);

  const handleAboutClick = () => {
    if (location.pathname === '/') {
      const element = document.getElementById('about');
      if (element) {
        const headerOffset = 100;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    } else {
      navigate('/#about');
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHomePage = location.pathname === '/';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || !isHomePage
          ? 'bg-white shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link
            to="/"
            className="flex-shrink-0"
          >
            <Logo
              className={`h-8 lg:h-10 ${
                isScrolled || !isHomePage ? 'text-blue-600' : 'text-white'
              }`}
            />
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`font-medium transition-colors hover:text-blue-600 ${
                isScrolled || !isHomePage
                  ? 'text-gray-700'
                  : 'text-white hover:text-blue-200'
              }`}
            >
              Главная
            </Link>
            <Link
              to="/complexes"
              className={`font-medium transition-colors hover:text-blue-600 ${
                isScrolled || !isHomePage
                  ? 'text-gray-700'
                  : 'text-white hover:text-blue-200'
              }`}
            >
              Жилые комплексы
            </Link>
            <Link
              to="/apartments"
              className={`font-medium transition-colors hover:text-blue-600 ${
                isScrolled || !isHomePage
                  ? 'text-gray-700'
                  : 'text-white hover:text-blue-200'
              }`}
            >
              Квартиры
            </Link>
            <button
              onClick={handleAboutClick}
              className={`font-medium transition-colors hover:text-blue-600 ${
                isScrolled || !isHomePage
                  ? 'text-gray-700'
                  : 'text-white hover:text-blue-200'
              }`}
            >
              О нас
            </button>
          </nav>

          <div className="hidden lg:flex items-center space-x-4">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              onClick={() => {
                openModal('bid');
              }}
            >
              Записаться на осмотр
            </button>

            {isAuthenticated && (
              <div className="flex items-center space-x-4">
                <span
                  className={`text-sm ${
                    isScrolled || !isHomePage ? 'text-gray-700' : 'text-white'
                  }`}
                >
                  {role}
                </span>
                {role === 'ADMIN' && (
                  <Link
                    to="/admin"
                    className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                      isScrolled || !isHomePage ? 'text-gray-700' : 'text-white'
                    }`}
                  >
                    Админ панель
                  </Link>
                )}
                <button
                  onClick={async () => {
                    await logout();
                    navigate('/');
                  }}
                  className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                    isScrolled || !isHomePage ? 'text-gray-700' : 'text-white'
                  }`}
                >
                  Выйти
                </button>
              </div>
            )}
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center">
              <span
                className={`w-6 h-0.5 transition-all duration-300 ${
                  isScrolled || !isHomePage ? 'bg-gray-900' : 'bg-white'
                } ${
                  isMobileMenuOpen ? 'rotate-45 translate-y-0.5' : ''
                }`}
              />
              <span
                className={`w-6 h-0.5 mt-1 transition-all duration-300 ${
                  isScrolled || !isHomePage ? 'bg-gray-900' : 'bg-white'
                } ${
                  isMobileMenuOpen ? 'opacity-0' : ''
                }`}
              />
              <span
                className={`w-6 h-0.5 mt-1 transition-all duration-300 ${
                  isScrolled || !isHomePage ? 'bg-gray-900' : 'bg-white'
                } ${
                  isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''
                }`}
              />
            </div>
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-4">
              <Link
                to="/"
                className="text-gray-700 hover:text-blue-600 font-medium px-4 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Главная
              </Link>
              <Link
                to="/complexes"
                className="text-gray-700 hover:text-blue-600 font-medium px-4 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Жилые комплексы
              </Link>
              <Link
                to="/apartments"
                className="text-gray-700 hover:text-blue-600 font-medium px-4 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Квартиры
              </Link>
              <button
                onClick={() => {
                  handleAboutClick();
                  setIsMobileMenuOpen(false);
                }}
                className="text-gray-700 hover:text-blue-600 font-medium px-4 py-2 text-left w-full"
              >
                О нас
              </button>
              <div className="px-4 py-2 border-t border-gray-200">
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium w-full"
                  onClick={() => {
                    openModal('bid');
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Записаться на осмотр
                </button>

                {isAuthenticated && (
                  <div className="mt-4 space-y-2">
                    <div className="text-sm text-gray-600 px-4 py-2">
                      {role}
                    </div>
                    {role === 'ADMIN' && (
                      <Link
                        to="/admin"
                        className="block text-gray-700 hover:text-blue-600 font-medium px-4 py-2"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Админ панель
                      </Link>
                    )}
                    <button
                      onClick={async () => {
                        await logout();
                        navigate('/');
                        setIsMobileMenuOpen(false);
                      }}
                      className="block text-gray-700 hover:text-blue-600 font-medium px-4 py-2 w-full text-left"
                    >
                      Выйти
                    </button>
                  </div>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;