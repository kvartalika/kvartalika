import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from './Logo';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

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
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <Logo className={`h-8 lg:h-10 ${
              isScrolled || !isHomePage ? 'text-blue-600' : 'text-white'
            }`} />
          </Link>

          {/* Desktop Navigation */}
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
            <Link
              to="/about"
              className={`font-medium transition-colors hover:text-blue-600 ${
                isScrolled || !isHomePage
                  ? 'text-gray-700'
                  : 'text-white hover:text-blue-200'
              }`}
            >
              О нас
            </Link>
          </nav>

          {/* Contact Info */}
          <div className="hidden lg:flex items-center space-x-4">
            <a
              href="tel:+74951234567"
              className={`font-semibold transition-colors hover:text-blue-600 ${
                isScrolled || !isHomePage
                  ? 'text-gray-900'
                  : 'text-white hover:text-blue-200'
              }`}
            >
              +7 (495) 123-45-67
            </a>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              onClick={() => {/* TODO: Open callback modal */}}
            >
              Обратный звонок
            </button>
          </div>

          {/* Mobile Menu Button */}
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

        {/* Mobile Menu */}
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
              <Link
                to="/about"
                className="text-gray-700 hover:text-blue-600 font-medium px-4 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                О нас
              </Link>
              <div className="px-4 py-2 border-t border-gray-200">
                <a
                  href="tel:+74951234567"
                  className="text-gray-900 font-semibold block mb-2"
                >
                  +7 (495) 123-45-67
                </a>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium w-full">
                  Обратный звонок
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