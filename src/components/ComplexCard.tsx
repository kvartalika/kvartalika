import { Link, useNavigate } from "react-router-dom";
import type { ResolvedHome } from "../services";
import { safeImage } from "../utils/safeImage.ts";

interface ComplexCardProps {
  complex: ResolvedHome;
}

const ComplexCard = ({ complex }: ComplexCardProps) => {
  const navigate = useNavigate();

  let images = safeImage(complex.imagesResolved, "home");
  images = Array.isArray(images) ? images : [images];

  const handleCardClick = () => {
    navigate(`/complex/${complex.id}`);
  };

  function formatFloors(count: number): string {
    if (count === -1) return "—";
    const abs = Math.abs(count);
    const mod100 = abs % 100;
    if (mod100 >= 11 && mod100 <= 14) {
      return `${count} этажей`;
    }
    const mod10 = abs % 10;
    if (mod10 === 1) return `${count} этаж`;
    if (mod10 >= 2 && mod10 <= 4) return `${count} этажа`;
    return `${count} этажей`;
  }

  return (
    <div
      onClick={handleCardClick}
      className="flex flex-col h-full group relative bg-surface-50 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-surface-200 hover:border-surface-300"
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        <img
          src={images[0]}
          alt={complex.name || "Изображение ЖК"}
          className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-surface-900/20 via-transparent to-transparent"></div>

        <div className="absolute top-4 right-4 bg-primary-600 text-surface-50 px-4 py-2 rounded-xl font-bold shadow-lg text-sm backdrop-blur-sm bg-opacity-95">
          {complex.numberOfFloors ?? "—"} этажей
        </div>

        <div className="absolute inset-0 bg-surface-900/0 group-hover:bg-surface-900/10 transition-all duration-300"></div>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-xl font-bold text-surface-900 mb-3 group-hover:text-primary-600 transition-colors">
          {complex.name || "Без названия"}
        </h3>

        <div className="grid grid-cols-1 gap-3 mb-6">
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
            <span className="truncate">
              {complex.address || "Адрес уточняется"}
            </span>
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
                d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
              />
            </svg>
            {formatFloors(complex.numberOfFloors ?? -1)}
          </div>
        </div>

        <div className="mb-6">
          <p className="text-surface-600 text-sm line-clamp-3">
            {complex.description || "Описание отсутствует"}
          </p>
        </div>

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

        <div className="mt-auto space-y-3">
          <Link
            to={`/complex/${complex.id}`}
            className="block w-full bg-surface-100 hover:bg-surface-200 text-surface-800 py-3 px-4 rounded-xl text-center font-semibold transition-all duration-200 border border-surface-200 hover:border-surface-300 hover:shadow-md"
          >
            Подробнее
          </Link>

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
