import React from 'react';
import type { ApartmentCardProps } from '../types';
import './ApartmentCard.css';

const ApartmentCard: React.FC<ApartmentCardProps> = ({ apartment, onNavigateToApartment }) => {
    return (
        <article className="apartment-card">
            <div className="card-image">
                <img
                    src="/api/placeholder/350/200"
                    alt={`${apartment.rooms}-комнатная квартира в ${apartment.complex}`}
                    className="apartment-image"
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzUwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDM1MCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzNTAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjE3NSIgY3k9IjEwMCIgcj0iNDAiIGZpbGw9IiNEMUQ1REIiLz4KPHBhdGggZD0iTTE1NSA4NUgxOTVWMTE1SDE1NVY4NVoiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0xNjUgOTVIMTg1VjEwNUgxNjVWOTVaIiBmaWxsPSIjRDFENURCIi8+Cjx0ZXh0IHg9IjE3NSIgeT0iMTQwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNjc3ODhBIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiPtCk0L7RgtC+INC60LLQsNGA0YLQuNGA0Ys8L3RleHQ+Cjwvc3ZnPgo=';
                    }}
                />
                <div className="complex-badge">
                    {apartment.complex}<br />
                    <span className="badge-subtitle">{apartment.address}</span>
                </div>
            </div>

            <div className="card-content">
                <h3 className="apartment-title">{apartment.rooms}-комнатная квартира</h3>

                <ul className="apartment-features">
                    <li>Первый этаж</li>
                    <li>{apartment.bathroom}</li>
                    <li>{apartment.finishing}</li>
                </ul>

                <button className="details-button" onClick={onNavigateToApartment}>
                    Посмотреть подробнее
                </button>
            </div>
        </article>
    );
};

export default ApartmentCard;