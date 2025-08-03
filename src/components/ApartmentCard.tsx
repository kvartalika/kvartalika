import {Link, useNavigate} from 'react-router-dom';
import type {ResolvedFlat} from "../services";
import ImageSlider from "./ImageSlider.tsx";

interface ApartmentCardProps {
  apartment: ResolvedFlat;
  homeName: string;
  onBookingClick?: () => void;
}

const ApartmentCard = ({
                         apartment,
                         onBookingClick,
                         homeName
                       }: ApartmentCardProps) => {
  const navigate = useNavigate();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price);
  };

  const handleCardClick = () => {
    navigate(`/apartment/${apartment.flat.id}`);
  };

  function formatSanuzel(count: number): string {
    const abs = Math.abs(count);
    const mod100 = abs % 100;
    if (mod100 >= 11 && mod100 <= 14) {
      return `${count} санузлов`;
    }
    const mod10 = abs % 10;
    if (mod10 === 1) return `${count} санузел`;
    if (mod10 >= 2 && mod10 <= 4) return `${count} санузла`;
    return `${count} санузлов`;
  }

  return (
    <div
      className="card card-hover cursor-pointer hover:shadow-lg transition-shadow duration-200 flex flex-col overflow-hidden rounded-lg bg-white"
      onClick={handleCardClick}
      role="button"
      aria-label={`Квартира ${apartment.flat.id}`}
    >
      <div
        className="relative"
        onClick={(e) => e.stopPropagation()}
      >
        <ImageSlider
          images={apartment.imagesResolved || []}
          className="h-48 w-full"
          autoPlay={false}
        />

        <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg font-semibold shadow-lg text-md">
          {formatPrice(apartment.flat.price || 0)} ₽
        </div>

        <div className="absolute top-4 left-4 bg-gray-200/70 text-black px-4 py-2 rounded-lg font-medium text-sm">
          {apartment.flat.numberOfRooms || 1} комн.
        </div>

        {apartment.flat.features?.some(el =>
          el.toLowerCase().includes('горячее предложение')
        ) && (
          <div className="absolute bottom-2 left-4 bg-red-600 text-white px-2 py-2 rounded-lg text-xs font-semibold flex items-center gap-1">
            <span>🔥</span> Горячее предложение
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <Link
          to={`/complex/${apartment.flat.homeId}`}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium mb-1"
          onClick={(e) => e.stopPropagation()}
        >
          {homeName}
        </Link>

        <div
          className="grid grid-cols-2 gap-4 mb-4"
          aria-label="Информация об объекте"
        >
          <div className="flex items-center text-sm text-gray-900 bg-gray-200 rounded-lg p-2 font-semibold">
            <svg
              className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            {apartment.flat.address ?? 'Нужно уточнить адрес'}
          </div>
          <div className="flex items-center text-sm text-gray-900 bg-gray-200 rounded-lg p-2 font-semibold">
            <svg
              className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0"
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
            {formatSanuzel(apartment.flat.numberOfBathrooms || 0)}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center text-sm text-gray-900 bg-gray-200 rounded-lg p-2 font-semibold">
            <svg
              className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0"
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
            {apartment.flat.numberOfRooms ?? 1} комн.
          </div>

          <div className="flex items-center text-sm text-gray-900 bg-gray-200 rounded-lg p-2 font-semibold">
            <svg
              className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0"
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
            {apartment.flat.area ?? 'Не измерено'} м²
          </div>

          <div className="flex items-center text-sm text-gray-900 bg-gray-200 rounded-lg p-2 font-semibold">
            <svg
              className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0"
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
            {apartment.flat.floor ?? 'Нужно уточнить'} этаж
          </div>

          {apartment.flat.hasDecoration ? (
            <div className="flex items-center text-sm text-gray-900 bg-green-100 rounded-lg p-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
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
                С отделкой
              </span>
            </div>
          ) : (
            <div className="flex items-center text-sm text-gray-900 bg-rose-100 rounded-lg p-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-600">
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
                Без отделки
              </span>
            </div>
          )}
        </div>

        <div className="flex space-x-2 mt-auto">
          <Link
            to={`/apartment/${apartment.flat.id ?? ''}`}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-4 px-4 rounded-lg text-center font-semibold transition-colors text-sm"
            onClick={(e) => e.stopPropagation()}
          >
            Подробнее
          </Link>

          {onBookingClick && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onBookingClick();
              }}
              className="font-bold flex-1 bg-blue-600 hover:bg-blue-700 text-white py-4 px-4 rounded-lg transition-colors text-sm"
              type="button"
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