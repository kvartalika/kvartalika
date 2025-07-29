import React from 'react';
import Logo from './Logo';
import './PageLoader.css';

const PageLoader: React.FC = () => {
    return (
        <div className="page-loader">
            <div className="loader-content">
                <div className="loader-logo">
                    <Logo
                        size="xl"
                        color="default"
                        showText={true}
                        className="loading-logo"
                    />
                </div>
                <div className="loader-spinner">
                    <div className="spinner"></div>
                </div>
                <p className="loader-text">Загрузка...</p>
            </div>
        </div>
    );
};

export default PageLoader;