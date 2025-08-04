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
      className="group relative bg-surface-50 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-surface-200 hover:border-surface-300"
      onClick={handleCardClick}
      role="button"
      aria-label={`Квартира ${apartment.flat.id}`}
    >

      <div className="relative">
        <div onClick={(e) => e.stopPropagation()}>
          <ImageSlider
            images={apartment.imagesResolved || []}
            className="w-full h-full"
            showThumbnails={false}
            autoPlay={false}
          />
        </div>


        <div className="absolute inset-0 bg-gradient-to-t from-surface-900/20 via-transparent to-transparent"></div>


        <div className="absolute top-4 right-4 bg-primary-600 text-surface-50 px-4 py-2 rounded-xl font-bold shadow-lg text-lg backdrop-blur-sm bg-opacity-95">
          {formatPrice(apartment.flat.price || 0)} ₽
        </div>


        <div className="absolute top-4 left-4 bg-surface-50/90 backdrop-blur-sm text-surface-800 px-3 py-2 rounded-xl font-semibold text-sm border border-surface-200/50">
          {apartment.flat.numberOfRooms || 1} комн.
        </div>


        {apartment.categories?.some(el =>
          el.name?.toLowerCase().includes('горячее предложение')
        ) && (
          <div className="absolute bottom-4 left-4 bg-error-500 text-surface-50 px-3 py-2 rounded-xl text-sm font-bold shadow-lg flex items-center gap-2 backdrop-blur-sm">
            <span className="text-lg">🔥</span>
            <span>Горячее предложение</span>
          </div>
        )}

        <div className="absolute inset-0 bg-surface-900/0 group-hover:bg-surface-900/10 transition-all duration-300"></div>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <Link
          to={`/complex/${apartment.flat.homeId}`}
          className="text-sm text-primary-600 hover:text-primary-700 font-semibold mb-3 transition-colors duration-200 flex items-center gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          <svg
            className="w-4 h-4"
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
          {homeName}
        </Link>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="flex items-center text-sm text-surface-700 bg-surface-100 rounded-xl p-3 font-medium border border-surface-200">
            <svg
              className="w-4 h-4 mr-2 text-surface-500 flex-shrink-0"
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
            <span className="truncate">{apartment.flat.address ?? 'Адрес уточняется'}</span>
          </div>

          <div className="flex items-center text-sm text-surface-700 bg-surface-100 rounded-xl p-3 font-medium border border-surface-200">
            <svg
              className="w-4 h-4 mr-2 text-surface-500 flex-shrink-0"
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

          <div className="flex items-center text-sm text-surface-700 bg-surface-100 rounded-xl p-3 font-medium border border-surface-200">
            <svg
              className="w-4 h-4 mr-2 text-surface-500 flex-shrink-0"
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
            {apartment.flat.area ?? '—'} м²
          </div>

          <div className="flex items-center text-sm text-surface-700 bg-surface-100 rounded-xl p-3 font-medium border border-surface-200">
            <svg
              className="w-4 h-4 mr-2 text-surface-500 flex-shrink-0"
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

          <div className="flex text-sm text-surface-700 bg-surface-100 rounded-xl p-3 font-medium border border-surface-200">
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
            {apartment.flat.floor ?? '—'} этаж
          </div>

          {apartment.flat.hasDecoration ? (
            <div className="flex p-3 bg-success-50 border border-success-200 rounded-xl text-success-700 font-medium">
              <svg
                className="w-4 h-4 mr-2 text-success-500 flex-shrink-0"
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
              Есть отделка
            </div>
          ) : (
            <div className="flex items-center p-3 bg-warning-50 border border-warning-200 rounded-xl text-warning-700 font-medium">
              <svg
                className="w-4 h-4 mr-2 text-warning-500 flex-shrink-0"
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
              Отделки нет
            </div>
          )}
        </div>

        <div className="mt-auto space-y-3">
          <Link
            to={`/apartment/${apartment.flat.id ?? ''}`}
            className="block w-full bg-surface-100 hover:bg-surface-200 text-surface-800 py-3 px-4 rounded-xl text-center font-semibold transition-all duration-200 border border-surface-200 hover:border-surface-300 hover:shadow-md"
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
              className="w-full bg-primary-600 hover:bg-primary-700 text-surface-50 py-3 px-4 rounded-xl font-bold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              type="button"
            >
              Записаться на осмотр
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApartmentCard;