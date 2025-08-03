import { type FC, memo } from 'react';
import { Link } from 'react-router-dom';
import type { ResolvedFlat } from '../services';

interface ApartmentCardProps {
  apartment: ResolvedFlat;
  homeName: string;
  onBookingClick: () => void;
}

const ApartmentCard: FC<ApartmentCardProps> = memo(({ apartment, homeName, onBookingClick }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price);
  };

  const formatArea = (area: number) => {
    return `${area} м²`;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      <div className="relative">
        {apartment.imagesResolved && apartment.imagesResolved.length > 0 ? (
          <img
            src={apartment.imagesResolved[0]}
            alt={apartment.flat.name}
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
          </div>
        )}
        
        <div className="absolute top-2 right-2">
          <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
            {apartment.flat.numberOfRooms || 1} комн.
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="mb-2">
          <h3 className="font-semibold text-gray-900 mb-1 truncate">
            {apartment.flat.name}
          </h3>
          <p className="text-sm text-gray-600 mb-2">{homeName}</p>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Площадь:</span>
            <span className="font-medium">{formatArea(apartment.flat.area || 0)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Этаж:</span>
            <span className="font-medium">{apartment.flat.floor || 0}</span>
          </div>
          {apartment.flat.numberOfBathrooms && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Санузлы:</span>
              <span className="font-medium">{apartment.flat.numberOfBathrooms}</span>
            </div>
          )}
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-3">
            <span className="text-2xl font-bold text-gray-900">
              {formatPrice(apartment.flat.price || 0)} ₽
            </span>
            {apartment.flat.hasDecoration && (
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                С отделкой
              </span>
            )}
          </div>

          <div className="flex gap-2">
            <Link
              to={`/apartment/${apartment.flat.id}`}
              className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200 px-4 py-2 rounded-lg text-center font-medium transition-colors"
            >
              Подробнее
            </Link>
            <button
              onClick={onBookingClick}
              className="flex-1 bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Забронировать
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

ApartmentCard.displayName = 'ApartmentCard';

export default ApartmentCard;