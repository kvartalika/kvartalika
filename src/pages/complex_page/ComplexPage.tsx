import React from 'react';
import type { Apartment } from '../../types';
import ApartmentCard from '../../components/ApartmentCard.tsx';
import ViewAllButton from '../../components/ViewAllButton.tsx';
import './ComplexPage.css';
import Logo from "../../components/Logo.tsx";

interface ComplexPageProps {
    onNavigateToApartment?: () => void;
}

const mockApartments: Apartment[] = [
    {
        id: 1,
        complex: 'ЖК "Нижний"',
        address: 'пер Нижний, дом 51',
        rooms: 1,
        floor: 1,
        bathroom: '1 санузел',
        finishing: 'Без отделки',
        isHot: true,
        image: '',
        detailsUrl: '#'
    },
    {
        id: 2,
        complex: 'ЖК "Нижний"',
        address: 'пер Нижний, дом 51',
        rooms: 1,
        floor: 1,
        bathroom: '1 санузел',
        finishing: 'Без отделки',
        isHot: true,
        image: '',
        detailsUrl: '#'
    },
    {
        id: 3,
        complex: 'ЖК "Нижний"',
        address: 'пер Нижний, дом 51',
        rooms: 1,
        floor: 1,
        bathroom: '1 санузел',
        finishing: 'Без отделки',
        isHot: true,
        image: '',
        detailsUrl: '#'
    },
    {
        id: 4,
        complex: 'ЖК "Нижний"',
        address: 'пер Нижний, дом 51',
        rooms: 2,
        floor: 1,
        bathroom: '1 санузел',
        finishing: 'Без отделки',
        isHot: false,
        image: '',
        detailsUrl: '#'
    },
    {
        id: 5,
        complex: 'ЖК "Нижний"',
        address: 'пер Нижний, дом 51',
        rooms: 3,
        floor: 1,
        bathroom: '1 санузел',
        finishing: 'Без отделки',
        isHot: false,
        image: '',
        detailsUrl: '#'
    },
    {
        id: 6,
        complex: 'ЖК "Нижний"',
        address: 'пер Нижний, дом 51',
        rooms: 3,
        floor: 1,
        bathroom: '1 санузел',
        finishing: 'Без отделки',
        isHot: false,
        image: '',
        detailsUrl: '#'
    }
];

interface SectionTitleProps {
    text: string;
    showViewAll?: boolean;
    onViewAll?: () => void;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ text, showViewAll = false, onViewAll }) => {
    return (
        <div className="section-header">
            <h2 className="section-title">{text}</h2>
            {showViewAll && (
                <ViewAllButton
                    onClick={onViewAll}
                    variant="outline"
                    size="md"
                />
            )}
        </div>
    );
};

const ComplexBanner: React.FC = () => {
    return (
        <section className="complex-banner">
            <div className="complex-banner-content">
                <div className="complex-banner-left">
                    <Logo
                        size="md"
                        color="white"
                        className="complex-logo"
                    />
                    <h1 className="complex-title">ЖК "Нижний"</h1>
                    <p className="complex-description">
                        Насладитесь удивительным и комфортом, став частью этого исключительного сообщества в самом сердце города.
                    </p>
                </div>
                <div className="complex-banner-right">
                    {/* Убрал всю иллюстрацию домов */}
                </div>
            </div>
            <div className="complex-wave">
                <svg viewBox="0 0 1200 200" className="wave-svg">
                    <path d="M0,100 C300,150 600,50 900,100 C1050,125 1150,75 1200,100 L1200,200 L0,200 Z" fill="white" opacity="0.8"/>
                    <path d="M0,120 C400,80 800,160 1200,120 L1200,200 L0,200 Z" fill="white" opacity="0.6"/>
                    <path d="M0,160 C600,120 800,180 1200,160 L1200,200 L0,200 Z" fill="white"/>
                </svg>
            </div>
        </section>
    );
};

const ComfortBanner: React.FC = () => {
    return (
        <section className="comfort-banner">
            <div className="comfort-banner-content">
                <div className="comfort-banner-left">
                    <h2 className="comfort-title">В окружении тишины и комфорта</h2>
                    <div className="comfort-description">
                        <p>
                            Это жилой комплекс с современными квартирами, зонами отдыха, развлечений для детей и взрослых.
                        </p>
                        <p>
                            Насладитесь удивительным и комфортом, став частью этого исключительного сообщества в самом сердце города.
                        </p>
                    </div>
                </div>
                <div className="comfort-banner-right">
                    <div className="comfort-image-placeholder">
                        <div className="comfort-illustration">
                            <div className="comfort-elements">
                                <div className="element park">
                                    <div className="element-icon">🌳</div>
                                    <span>Парк</span>
                                </div>
                                <div className="element playground">
                                    <div className="element-icon">🎪</div>
                                    <span>Детская площадка</span>
                                </div>
                                <div className="element fitness">
                                    <div className="element-icon">🏃‍♂️</div>
                                    <span>Спорт зона</span>
                                </div>
                                <div className="element security">
                                    <div className="element-icon">🛡️</div>
                                    <span>Безопасность</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const ConstructionHistory: React.FC = () => {
    return (
        <section className="construction-history">
            <div className="construction-content">
                <div className="construction-left">
                    <h2 className="construction-title">ИСТОРИЯ СТРОИТЕЛЬСТВА</h2>
                    <div className="construction-text">
                        <div className="construction-timeline">
                            <div className="timeline-item">
                                <div className="timeline-year">2023</div>
                                <div className="timeline-description">
                                    Начало строительства жилого комплекса. Получение всех необходимых разрешений и лицензий.
                                </div>
                            </div>
                            <div className="timeline-item">
                                <div className="timeline-year">2024</div>
                                <div className="timeline-description">
                                    Завершение фундаментных работ и возведение несущих конструкций первых корпусов.
                                </div>
                            </div>
                            <div className="timeline-item">
                                <div className="timeline-year">2025</div>
                                <div className="timeline-description">
                                    Окончание строительства и сдача первой очереди. Благоустройство территории и инфраструктуры.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="construction-right">
                    <div className="construction-gallery-placeholder">
                        <div className="gallery-grid-preview">
                            <div className="gallery-item-preview">
                                <div className="progress-indicator">
                                    <div className="progress-bar" style={{width: '100%'}}></div>
                                </div>
                                <span>Фундамент</span>
                            </div>
                            <div className="gallery-item-preview">
                                <div className="progress-indicator">
                                    <div className="progress-bar" style={{width: '85%'}}></div>
                                </div>
                                <span>Стены</span>
                            </div>
                            <div className="gallery-item-preview">
                                <div className="progress-indicator">
                                    <div className="progress-bar" style={{width: '70%'}}></div>
                                </div>
                                <span>Кровля</span>
                            </div>
                            <div className="gallery-item-preview">
                                <div className="progress-indicator">
                                    <div className="progress-bar" style={{width: '45%'}}></div>
                                </div>
                                <span>Отделка</span>
                            </div>
                        </div>
                        <div className="gallery-title">
                            <span className="gallery-icon">📸</span>
                            <span>Галерея строительства</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const ComplexPage: React.FC<ComplexPageProps> = ({ onNavigateToApartment }) => {
    const handleViewAllApartments = () => {
        console.log('View all apartments');
    };

    const renderApartmentCards = () => {
        return mockApartments.map((apartment) => (
            <ApartmentCard
                key={apartment.id}
                apartment={apartment}
                onNavigateToApartment={onNavigateToApartment}
            />
        ));
    };

    return (
        <main className="complex-page">
            <ComplexBanner />

            <section className="apartments-section">
                <div className="container">
                    <SectionTitle
                        text="Список квартир"
                        showViewAll={true}
                        onViewAll={handleViewAllApartments}
                    />
                    <div className="apartments-grid">
                        {renderApartmentCards()}
                    </div>
                </div>
            </section>

            <ComfortBanner />

            <ConstructionHistory />
        </main>
    );
};


export default ComplexPage;