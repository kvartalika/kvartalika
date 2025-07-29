import React from 'react';
import './BookingSuccessModal.css';

interface BookingSuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const BookingSuccessModal: React.FC<BookingSuccessModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="success-modal-overlay" onClick={onClose}>
            <div className="success-modal" onClick={(e) => e.stopPropagation()}>
                <button className="success-modal-close" onClick={onClose}>
                    ✕
                </button>

                <div className="booking-success">
                    <h2 className="success-title">Заявка принята</h2>
                    <p className="success-subtitle">
                        С вами свяжутся в течение<br />
                        2-х рабочих дней
                    </p>

                    <div className="success-icon">
                        <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                            <circle cx="40" cy="40" r="40" fill="#4CAF50"/>
                            <path
                                d="M25 40L35 50L55 30"
                                stroke="white"
                                strokeWidth="4"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingSuccessModal;