import React, { useState } from 'react';
import type { Apartment, HomePageProps } from '../../types';
import ApartmentCard from '../../components/ApartmentCard.tsx';
import SearchBar from '../../components/SearchBar.tsx';
import ViewAllButton from '../../components/ViewAllButton.tsx';
import './HomePage.css';

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

const HomePage: React.FC<HomePageProps> = ({ onNavigateToComplex }) => {
    const [searchValue, setSearchValue] = useState('');

    const handleSearch = () => {
        console.log('Searching for:', searchValue);
    };

    const handleViewAllHotOffers = () => {
        console.log('View all hot offers');
    };

    const handleViewAllThreeRoom = () => {
        console.log('View all three room apartments');
    };

    const hotOffers = mockApartments.filter(apt => apt.isHot);
    const threeRoomApartments = mockApartments.filter(apt => apt.rooms === 3);

    const renderHotOffers = () => {
        return hotOffers.map((apartment) => (
            <ApartmentCard key={apartment.id} apartment={apartment} />
        ));
    };

    const renderThreeRoomApartments = () => {
        return threeRoomApartments.map((apartment) => (
            <ApartmentCard key={apartment.id} apartment={apartment} />
        ));
    };

    return (
        <main className="homepage">
            <section className="hero-section">
                <div className="hero-content">
                    <div className="hero-left">
                        <h1 className="hero-title">
                            Найдите квартиру<br />
                            для себя
                        </h1>

                        <div className="search-container">
                            <SearchBar
                                value={searchValue}
                                onChange={setSearchValue}
                                onSearch={handleSearch}
                            />
                        </div>
                    </div>

                    <div className="hero-right">
                        <div className="promo-card" onClick={onNavigateToComplex}>
                            <div className="promo-badge">70 Квартир</div>
                            <h3 className="promo-title">ЖК "Нижний"</h3>
                            <p className="promo-address">
                                переулок Нижний<br />
                                дом 51
                            </p>
                            <p className="promo-description">
                                Насладитесь удивительным и комфортом, став частью этого исключительного сообщества в самом сердце города.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="hero-waves">
                    <svg viewBox="0 0 1200 200" className="wave-svg">
                        <path d="M0,100 C300,150 600,50 900,100 C1050,125 1150,75 1200,100 L1200,200 L0,200 Z" fill="white" opacity="0.8"/>
                        <path d="M0,120 C400,80 800,160 1200,120 L1200,200 L0,200 Z" fill="white" opacity="0.6"/>
                        <path d="M0,160 C600,120 800,180 1200,160 L1200,200 L0,200 Z" fill="white"/>
                    </svg>
                </div>
            </section>

            <section className="apartments-section">
                <div className="container">
                    <SectionTitle
                        text="Горячие предложения"
                        showViewAll={true}
                        onViewAll={handleViewAllHotOffers}
                    />
                    <div className="apartments-grid">
                        {renderHotOffers()}
                    </div>
                </div>
            </section>

            <section className="apartments-section">
                <div className="container">
                    <SectionTitle
                        text="Трёхкомнатные квартиры"
                        showViewAll={true}
                        onViewAll={handleViewAllThreeRoom}
                    />
                    <div className="apartments-grid">
                        {renderThreeRoomApartments()}
                    </div>
                </div>
            </section>
        </main>
    );
};

export default HomePage;