import {Link} from 'react-router-dom';
import type {ResolvedHome} from "../services";

interface ComplexCardProps {
  complex: ResolvedHome;
}

const ComplexCard = ({complex}: ComplexCardProps) => {
  let images = complex.imagesResolved || [];
  images = Array.isArray(images) ? images : [images];

  return (
    <div className="group relative bg-surface-50 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-surface-200 hover:border-surface-300">
      {/* Image Section */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={images[0] || '/placeholder-home.jpg'}
          alt={complex.name || 'Изображение ЖК'}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        
        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-surface-900/20 via-transparent to-transparent"></div>

        {/* Floors Badge */}
        <div className="absolute top-4 right-4 bg-primary-600 text-surface-50 px-4 py-2 rounded-xl font-bold shadow-lg text-sm backdrop-blur-sm bg-opacity-95">
          {complex.numberOfFloors ?? "—"} этажей
        </div>

        {/* Hot Offer Badge */}
        {complex.features?.some(f => f.toLowerCase().includes('горячее предложение')) && (
          <div className="absolute bottom-4 left-4 bg-error-500 text-surface-50 px-3 py-2 rounded-xl text-sm font-bold shadow-lg flex items-center gap-2 backdrop-blur-sm">
            <span className="text-lg">🔥</span>
            <span>Горячее предложение</span>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-surface-900/0 group-hover:bg-surface-900/10 transition-all duration-300"></div>
      </div>

      {/* Content Section */}
      <div className="p-6 flex flex-col flex-1">
        {/* Complex Name */}
        <h3 className="text-xl font-bold text-surface-900 mb-3 group-hover:text-primary-600 transition-colors">
          {complex.name || 'Без названия'}
        </h3>

        {/* Key Features Grid */}
        <div className="grid grid-cols-1 gap-3 mb-6">
          {/* Address */}
          <div className="flex items-center text-sm text-surface-700 bg-surface-100 rounded-xl p-3 font-medium border border-surface-200">
            <svg className="w-4 h-4 mr-2 text-surface-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="truncate">{complex.address || 'Адрес уточняется'}</span>
          </div>

          {/* Floors */}
          <div className="flex items-center text-sm text-surface-700 bg-surface-100 rounded-xl p-3 font-medium border border-surface-200">
            <svg className="w-4 h-4 mr-2 text-surface-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
            {complex.numberOfFloors ? `${complex.numberOfFloors} этажей` : '— этажей'}
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <p className="text-surface-600 text-sm line-clamp-3">
            {complex.description || 'Описание отсутствует'}
          </p>
        </div>

        {/* Features */}
        {complex.features && complex.features.length > 0 && (
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {complex.features.slice(0, 3).map((feat, idx) => (
                <span
                  key={idx}
                  className="text-xs bg-surface-100 text-surface-700 px-3 py-1 rounded-xl border border-surface-200"
                >
                  {feat}
                </span>
              ))}
              {complex.features.length > 3 && (
                <span className="text-xs text-surface-500 px-3 py-1">
                  +{complex.features.length - 3} еще
                </span>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-auto space-y-3">
          {/* Details Button */}
          <Link
            to={`/complex/${complex.id}`}
            className="block w-full bg-surface-100 hover:bg-surface-200 text-surface-800 py-3 px-4 rounded-xl text-center font-semibold transition-all duration-200 border border-surface-200 hover:border-surface-300 hover:shadow-md"
          >
            Подробнее
          </Link>

          {/* View Apartments Button */}
          <Link
            to={`/apartments?homeId=${complex.id}`}
            className="block w-full bg-primary-600 hover:bg-primary-700 text-surface-50 py-3 px-4 rounded-xl text-center font-bold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Посмотреть квартиры
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ComplexCard;