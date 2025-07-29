import React from 'react';
import './ViewAllButton.css';

interface ViewAllButtonProps {
    onClick?: () => void;
    text?: string;
    variant?: 'default' | 'outline' | 'gradient';
    size?: 'sm' | 'md' | 'lg';
}

const ViewAllButton: React.FC<ViewAllButtonProps> = ({
                                                         onClick,
                                                         text = "Посмотреть все",
                                                         variant = 'default',
                                                         size = 'md'
                                                     }) => {
    return (
        <button
            className={`view-all-btn view-all-btn--${variant} view-all-btn--${size}`}
            onClick={onClick}
        >
            <span className="view-all-btn__text">{text}</span>
            <span className="view-all-btn__icon">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
              d="M6 12L10 8L6 4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
          />
        </svg>
      </span>
        </button>
    );
};

export default ViewAllButton;