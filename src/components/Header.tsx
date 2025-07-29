import React from 'react';
import Logo from './Logo';
import './Header.css';

interface HeaderProps {
    showOnHomePage?: boolean;
    onNavigateToHome?: () => void;
    currentPage?: string;
    isScrolled?: boolean;
}

const Header: React.FC<HeaderProps> = ({
                                           showOnHomePage = true,
                                           onNavigateToHome,
                                           currentPage = 'home',
                                           isScrolled = false
                                       }) => {
    if (!showOnHomePage) return null;

    return (
        <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
            <div className="header-container">
                <Logo
                    size="xl"
                    color="white"
                    onClick={onNavigateToHome}
                    className="header-logo"
                />

                <nav className="header-nav">
                    {currentPage !== 'home' && (
                        <div className="breadcrumbs">
              <span
                  className={`breadcrumb-item ${currentPage === 'home' ? 'active' : ''}`}
                  onClick={onNavigateToHome}
              >
                Главная
              </span>
                            {currentPage !== 'home' && (
                                <>
                                    <span className="breadcrumb-separator">›</span>
                                    <span className={`breadcrumb-item ${currentPage === 'complex' ? 'active' : ''}`}>
                    {currentPage === 'complex' ? 'ЖК "Нижний"' : 'ЖК "Нижний"'}
                  </span>
                                </>
                            )}
                            {currentPage === 'apartment' && (
                                <>
                                    <span className="breadcrumb-separator">›</span>
                                    <span className="breadcrumb-item active">
                    Квартира
                  </span>
                                </>
                            )}
                        </div>
                    )}

                    {currentPage === 'home' && (
                        <div className="main-nav">
                            <a href="#apartments" className="nav-link">Квартиры</a>
                            <a href="#about" className="nav-link">О проекте</a>
                            <a href="#contacts" className="nav-link">Контакты</a>
                        </div>
                    )}
                </nav>

                <div className="header-actions">
                    <button className="contact-btn">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path
                                d="M2 3C2 2.45 2.45 2 3 2H5.153C5.592 2 5.964 2.32 6.033 2.757L6.7 6.68C6.767 7.11 6.533 7.526 6.133 7.733L4.867 8.367C5.533 10.033 6.967 11.467 8.633 12.133L9.267 10.867C9.474 10.467 9.89 10.233 10.32 10.3L14.243 10.967C14.68 11.036 15 11.408 15 11.847V14C15 14.55 14.55 15 14 15H13C7.477 15 3 10.523 3 5V3H2Z"
                                fill="currentColor"
                            />
                        </svg>
                        Связаться
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;