import {useEffect, useState} from 'react';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import Logo from './Logo';
import {useAuthStore} from "../store/auth.store.ts";
import {useUIStore} from "../store/ui.store.ts";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const {isAuthenticated, logout} = useAuthStore();

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
      className={`fixed top-0 left-0 right-0 z-25 transition-all duration-300 ${
        isScrolled || !isHomePage
          ? 'bg-primary-100 shadow-lg'
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
                isScrolled || !isHomePage ? 'text-primary-600' : 'text-primary-100'
              }`}
            />
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`font-medium transition-colors hover:text-primary-600 ${
                isScrolled || !isHomePage
                  ? 'text-gray-700'
                  : 'text-primary-100 hover:text-gray-200'
              }`}
            >
              Главная
            </Link>
            <Link
              to="/complexes"
              className={`font-medium transition-colors hover:text-primary-600 ${
                isScrolled || !isHomePage
                  ? 'text-gray-700'
                  : 'text-primary-100 hover:text-gray-200'
              }`}
            >
              Жилые комплексы
            </Link>
            <Link
              to="/apartments"
              className={`font-medium transition-colors hover:text-primary-600 ${
                isScrolled || !isHomePage
                  ? 'text-gray-700'
                  : 'text-primary-100 hover:text-gray-200'
              }`}
            >
              Квартиры
            </Link>
            {!isAuthenticated
              ? <button
                onClick={handleAboutClick}
                className={`font-medium transition-colors hover:text-primary-600 ${
                  isScrolled || !isHomePage
                    ? "text-gray-700"
                    : "text-primary-100 hover:text-gray-200"
                }`}
              >
                О нас
              </button>
              :
              <div
                className='rounded-md p-2 z-30 bg-red-600'
                onClick={() => {
                  logout();
                }}
              >
                <p className='text-white'>Выйти</p>
              </div>
            }
          </nav>

          <div className="hidden lg:flex items-center space-x-4">
            <button
              className="bg-primary-600 hover:bg-primary-700 text-surface-50 px-6 py-2 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              onClick={() => {
                openModal("bid");
              }}
            >
              Найти квартиру
            </button>
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center">
              <span
                className={`w-6 h-0.5 transition-all duration-300 ${
                  isScrolled || !isHomePage ? 'bg-gray-900' : 'bg-primary-100'
                } ${
                  isMobileMenuOpen ? 'rotate-45 translate-y-0.5' : ''
                }`}
              />
              <span
                className={`w-6 h-0.5 mt-1 transition-all duration-300 ${
                  isScrolled || !isHomePage ? 'bg-gray-900' : 'bg-primary-100'
                } ${
                  isMobileMenuOpen ? 'opacity-0' : ''
                }`}
              />
              <span
                className={`w-6 h-0.5 mt-1 transition-all duration-300 ${
                  isScrolled || !isHomePage ? 'bg-gray-900' : 'bg-primary-100'
                } ${
                  isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''
                }`}
              />
            </div>
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden primary-100 border-t border-gray-200 py-4 bg-primary-100 rounded-lg">
            <nav className="flex flex-col space-y-4">
              <Link
                to="/"
                className="text-gray-700 hover:text-primary-600 font-medium px-4 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Главная
              </Link>
              <Link
                to="/complexes"
                className="text-gray-700 hover:text-primary-600 font-medium px-4 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Жилые комплексы
              </Link>
              <Link
                to="/apartments"
                className="text-gray-700 hover:text-primary-600 font-medium px-4 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Квартиры
              </Link>
              {!isAuthenticated
                ? <button
                  onClick={handleAboutClick}
                  className="text-gray-700 hover:text-primary-600 font-medium px-4 py-2"
                >
                  О нас
                </button>
                :
                <div
                  className='rounded-md p-2 z-30 bg-red-600 mx-4'
                  onClick={() => {
                    logout();
                  }}
                >
                  <p className='text-primary-100'>Выйти</p>
                </div>
              }
              <div className="px-4 py-2 border-t border-gray-200">
                <button
                  className="bg-primary-600 hover:bg-primary-700 text-surface-50 px-4 py-2 rounded-xl font-medium w-full transition-all duration-200 shadow-lg hover:shadow-xl"
                  onClick={() => {
                    openModal("bid");
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Записаться на осмотр
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;