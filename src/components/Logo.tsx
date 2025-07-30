import React from 'react';

interface LogoProps {
  className?: string;
  onClick?: () => void;
}

const Logo: React.FC<LogoProps> = ({ className = '', onClick }) => {
  return (
    <div
      className={`flex items-center cursor-pointer ${className}`}
      onClick={onClick}
    >
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        className="mr-2"
      >
        <rect
          width="40"
          height="40"
          rx="8"
          fill="currentColor"
          fillOpacity="0.1"
        />
        <path
          d="M12 28V16L20 12L28 16V28H24V20H16V28H12Z"
          fill="currentColor"
        />
        <circle
          cx="20"
          cy="24"
          r="2"
          fill="currentColor"
          fillOpacity="0.7"
        />
      </svg>
      <span className="text-xl font-bold">
        Кварталика
      </span>
    </div>
  );
};

export default Logo;