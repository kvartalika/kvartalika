import React, { useState } from 'react';
import Map from '../../components/Map.tsx';
import BookingFormModal from '../../components/BookingFormModal.tsx';
import BookingSuccessModal from '../../components/BookingSuccessModal.tsx';
import './ApartmentPage.css';

interface ApartmentFeature {
    icon: string;
    title: string;
    description: string;
    showMore?: boolean;
}

interface FormData {
    lastName: string;
    firstName: string;
    middleName: string;
    phone: string;
    email: string;
}

interface ApartmentPageProps {
    onNavigateBack?: () => void;
}

const apartmentFeatures: ApartmentFeature[] = [
    {
        icon: '🏠',
        title: 'Entire home',
        description: 'You\'ll have the apartment to yourself',
    },
    {
        icon: '🧹',
        title: 'Enhanced Clean',
        description: 'This host committed to Airbnb\'s 5-step enhanced cleaning process.',
        showMore: true
    },
    {
        icon: '🔑',
        title: 'Self check-in',
        description: 'Check yourself in with the keypad.'
    },
    {
        icon: '⭐',
        title: 'Бесплатная отмена квартиры',
        description: ''
    }
];

const ApartmentPage: React.FC<ApartmentPageProps> = () => {
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

    const handleShowAllPhotos = () => {
        console.log('Show all photos');
    };

    const handleBookingClick = () => {
        setIsFormModalOpen(true);
    };

    const handleFormSubmit = (formData: FormData) => {
        // Здесь можно добавить API вызов для отправки данных
        console.log('Заявка отправлена:', formData);

        // Закрываем форму и показываем успех
        setIsFormModalOpen(false);
        setIsSuccessModalOpen(true);
    };

    const handleCloseFormModal = () => {
        setIsFormModalOpen(false);
    };

    const handleCloseSuccessModal = () => {
        setIsSuccessModalOpen(false);
    };

    return (
        <main className="apartment-page">
            {/* Hero Section */}
            <section className="apartment-hero">
                <div className="apartment-hero-content">
                    <div className="apartment-hero-left">
                        <div className="apartment-hero-placeholder">
                            <span className="apartment-hero-icon">🏠</span>
                            <span className="apartment-hero-text">Интерьер квартиры</span>
                        </div>
                    </div>
                    <div className="apartment-hero-right">
                        <div className="apartment-logo">
                            <span className="logo-text">Кварталика</span>
                            <span className="logo-icon">🏢</span>
                        </div>
                        <div className="apartment-info">
                            <h1 className="apartment-name">Крутое название квартиры</h1>
                            <div className="apartment-price">10.000.000 рублей</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="apartment-content">
                <div className="container">
                    <div className="apartment-layout">
                        {/* Left Column - Floor Plan */}
                        <div className="apartment-left">
                            <div className="floor-plan-container">
                                <div className="floor-plan">
                                    <div className="floor-plan-placeholder">
                                        <span className="plan-placeholder-icon">📋</span>
                                        <span className="plan-placeholder-text">План квартиры</span>
                                    </div>
                                    <div className="floor-plan-labels">
                                        <div className="plan-label plan-label-forest">Лес</div>
                                        <div className="plan-label plan-label-yard">Двор</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Details */}
                        <div className="apartment-right">
                            <div className="apartment-details">
                                <h2 className="apartment-title">3х-комнатная квартира</h2>
                                <div className="apartment-specs">
                                    <span>Первый этаж</span>
                                    <span>1 санузел</span>
                                    <span>1 вход</span>
                                </div>

                                <div className="apartment-features">
                                    {apartmentFeatures.map((feature, index) => (
                                        <div key={index} className="feature-item">
                                            <div className="feature-icon">{feature.icon}</div>
                                            <div className="feature-content">
                                                <h3 className="feature-title">{feature.title}</h3>
                                                <p className="feature-description">
                                                    {feature.description}
                                                    {feature.showMore && (
                                                        <button className="show-more-btn">Show more</button>
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="apartment-description">
                                    <p>
                                        Come and stay in this superb duplex T4 in the heart of the historic center of Bordeaux.
                                    </p>
                                    <p>
                                        In the heart of the triangle of golden Bordeaux, in a 19th century building, we offer all the
                                        charms of the city thanks to its ideal location. Close to many shops, bars and
                                        restaurants, you can access the apartment by tram B and C and bus routes 27 and 44.
                                    </p>
                                </div>

                                <button className="booking-btn" onClick={handleBookingClick}>
                                    Записаться на просмотр
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Gallery Section */}
            <section className="gallery-section">
                <div className="container">
                    <h2 className="gallery-title">Галерея</h2>
                    <div className="gallery-grid">
                        {[1, 2, 3, 4].map((index) => (
                            <div key={index} className="gallery-item">
                                <div className="gallery-placeholder">
                                    <span className="gallery-placeholder-icon">🖼️</span>
                                    <span className="gallery-placeholder-text">Фото {index}</span>
                                </div>
                                {index === 4 && (
                                    <div className="gallery-overlay" onClick={handleShowAllPhotos}>
                                        <span className="gallery-count">+5</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Map Section */}
            <section className="map-section">
                <div className="container">
                    <Map />
                </div>
            </section>

            {/* Booking Modals */}
            <BookingFormModal
                isOpen={isFormModalOpen}
                onClose={handleCloseFormModal}
                onSubmit={handleFormSubmit}
            />

            <BookingSuccessModal
                isOpen={isSuccessModalOpen}
                onClose={handleCloseSuccessModal}
            />
        </main>
    );
};

export default ApartmentPage;