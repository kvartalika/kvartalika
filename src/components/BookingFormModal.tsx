import React, { useState } from 'react';
import './BookingFormModal.css';

interface FormData {
    lastName: string;
    firstName: string;
    middleName: string;
    phone: string;
    email: string;
}

interface BookingFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (formData: FormData) => void;
}

const BookingFormModal: React.FC<BookingFormModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [formData, setFormData] = useState<FormData>({
        lastName: '',
        firstName: '',
        middleName: '',
        phone: '',
        email: ''
    });

    const handleInputChange = (field: keyof FormData, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = () => {
        // Валидация (базовая)
        if (!formData.lastName || !formData.firstName || !formData.phone || !formData.email) {
            alert('Пожалуйста, заполните все обязательные поля');
            return;
        }

        // Отправка данных родительскому компоненту
        onSubmit(formData);

        // Очистка формы
        setFormData({
            lastName: '',
            firstName: '',
            middleName: '',
            phone: '',
            email: ''
        });
    };

    const handleClose = () => {
        setFormData({
            lastName: '',
            firstName: '',
            middleName: '',
            phone: '',
            email: ''
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="booking-modal-overlay" onClick={handleClose}>
            <div className="booking-modal" onClick={(e) => e.stopPropagation()}>
                <button className="booking-modal-close" onClick={handleClose}>
                    ✕
                </button>

                <div className="booking-form">
                    <h2 className="booking-title">Ваши данные</h2>

                    <div className="booking-fields">
                        <input
                            type="text"
                            placeholder="Фамилия"
                            value={formData.lastName}
                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                            className="booking-input"
                        />

                        <input
                            type="text"
                            placeholder="Имя"
                            value={formData.firstName}
                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                            className="booking-input"
                        />

                        <input
                            type="text"
                            placeholder="Отчество"
                            value={formData.middleName}
                            onChange={(e) => handleInputChange('middleName', e.target.value)}
                            className="booking-input"
                        />

                        <input
                            type="tel"
                            placeholder="Номер телефона"
                            value={formData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            className="booking-input"
                        />

                        <input
                            type="email"
                            placeholder="Электронная почта"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className="booking-input"
                        />
                    </div>

                    <div className="booking-disclaimer">
                        <p>
                            Нажимая кнопку "Оставить заявку" Вы даёте своё согласие на обработку введённой персональной информации в соответствии с Федеральным Законом №152-ФЗ от 27.07.2006 *о персональных данных.
                        </p>
                    </div>

                    <button className="booking-submit" onClick={handleSubmit}>
                        Оставить заявку
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookingFormModal;