import React from 'react';
import Logo from './Logo';
import './PageLoader.css';

const PageLoader = () => {
  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <div className="text-center">
        {/* Logo */}
        <div className="mb-8">
          <div className="w-16 h-16 mx-auto bg-blue-600 rounded-xl flex items-center justify-center mb-4">
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              className="text-white"
            >
              <path
                d="M8 22V12L16 8L24 12V22H20V16H12V22H8Z"
                fill="currentColor"
              />
              <circle
                cx="16"
                cy="18"
                r="2"
                fill="currentColor"
                fillOpacity="0.7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Кварталика</h2>
          <p className="text-gray-600">Загружаем для вас лучшие предложения</p>
        </div>

        {/* Loading Animation */}
        <div className="flex justify-center space-x-1">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default PageLoader;