import {Link} from 'react-router-dom';
import type {Apartment} from '../store/useAppStore';

interface ApartmentCardProps {
  apartment: Apartment;
  onBookingClick?: () => void;
}

const ApartmentCard = ({apartment, onBookingClick}: ApartmentCardProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price);
  };

  return (
    <div className="card card-hover">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={apartment.image || '/images/apartment-placeholder.jpg'}
          alt={`${apartment.rooms}-комнатная квартира в ${apartment.complex}`}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />

        {/* Hot Deal Badge */}
        {apartment.isHot && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-semibold">
            🔥 Горячее предложение
          </div>
        )}

        {/* Price Badge */}
        <div className="absolute bottom-3 right-3 bg-black bg-opacity-70 text-white px-3 py-1 rounded-lg font-semibold">
          {formatPrice(apartment.price)} ₽
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Complex Name */}
        <Link
          to={`/complex/${encodeURIComponent(apartment.complex)}`}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium mb-1 block"
        >
          {apartment.complex}
        </Link>

        {/* Address */}
        <p className="text-gray-600 text-sm mb-3">{apartment.address}</p>

        {/* Apartment Details */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center text-sm text-gray-700">
            <svg
              className="w-4 h-4 mr-2 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            {apartment.rooms} комн.
          </div>

          <div className="flex items-center text-sm text-gray-700">
            <svg
              className="w-4 h-4 mr-2 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
              />
            </svg>
            {apartment.area} м²
          </div>

          <div className="flex items-center text-sm text-gray-700">
            <svg
              className="w-4 h-4 mr-2 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
              />
            </svg>
            {apartment.floor} этаж
          </div>

          <div className="flex items-center text-sm text-gray-700">
            <svg
              className="w-4 h-4 mr-2 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
            {apartment.finishing}
          </div>
        </div>

        {/* Bathroom Info */}
        <div className="flex items-center text-sm text-gray-600 mb-4">
          <svg
            className="w-4 h-4 mr-2 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"
            />
          </svg>
          {apartment.bathroom}
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          <Link
            to={`/apartment/${apartment.id}`}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-lg text-center font-medium transition-colors text-sm"
          >
            Подробнее
          </Link>

          {onBookingClick && (
            <button
              onClick={onBookingClick}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors text-sm"
            >
              Записаться
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApartmentCard;