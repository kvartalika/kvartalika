import {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import type {ResolvedHome} from "../services";
import {useFlatsStore} from "../store/flats.store.ts";
import {safeImage} from "../utils/safeImage.ts";

const ComplexesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const {isLoadingHomes, error, loadHomes, homes} = useFlatsStore();

  const [filteredComplexes, setFilteredComplexes] = useState<ResolvedHome[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        await loadHomes(true);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, [loadHomes]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredComplexes(homes);
    } else {
      const filtered = homes.filter(complex =>
        complex?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        complex?.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        complex?.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredComplexes(filtered);
    }
  }, [searchQuery, homes]);

  return (
    <div className="min-h-screen pt-16">
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center text-secondary-100">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Жилые комплексы
            </h1>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              Выберите идеальный жилой комплекс из нашего широкого портфолио современных проектов
            </p>
          </div>
          <div className="max-w-2xl mx-auto mt-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Поиск по названию, адресу или описанию..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 text-lg border border-gray-300 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent pl-14 bg-white"
              />
              <svg
                className="w-6 h-6 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">

        <div className="mb-8">
          <p className="text-gray-600">
            Найдено комплексов: <span className="font-semibold text-gray-900">{filteredComplexes.length}</span>
          </p>
        </div>

        {isLoadingHomes && (
          <div className="mb-6 text-gray-500 font-medium">Загрузка ЖК...</div>
        )}

        {!isLoadingHomes && error && (
          <div className="mb-6 text-red-600 font-medium">{error}</div>
        )}

        {filteredComplexes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredComplexes.map(complex => {
              let images = safeImage(complex.imagesResolved, 'home');
              images = Array.isArray(images) ? images : [images];

              return (
                <Link
                  key={complex.id}
                  to={`/complex/${complex.id}`}
                  className="group flex flex-col bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                  aria-label={complex.name ? `ЖК ${complex.name}` : 'ЖК'}
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={images[0]}
                      alt={complex.name || 'Изображение ЖК'}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute top-4 right-4 bg-primary-600 text-secondary-100 px-3 py-1 rounded-full text-sm font-medium shadow">
                      {complex.numberOfFloors ?? "–"} этажей
                    </div>
                    {complex.features?.some(f => f.toLowerCase().includes('горячее предложение')) && (
                      <div className="absolute bottom-3 left-3 bg-red-600 text-secondary-100 px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1">
                        <span>🔥</span> Горячее предложение
                      </div>
                    )}
                  </div>

                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                      {complex.name || 'Без названия'}
                    </h3>

                    <div className="flex items-start gap-4 mb-3 flex-wrap">
                      <div className="flex items-center text-sm text-gray-700 bg-gray-100 rounded-lg p-2 gap-2 flex-1 min-w-[150px]">
                        <svg
                          className="w-4 h-4 flex-shrink-0 text-gray-500"
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
                        <span className="truncate">{complex.address || 'Адрес уточняется'}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-700 bg-gray-100 rounded-lg p-2 gap-2 min-w-[120px]">
                        <svg
                          className="w-4 h-4 flex-shrink-0 text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7h8M8 11h5m-5 4h8"
                          />
                        </svg>
                        <span>{complex.numberOfFloors ? `${complex.numberOfFloors} этажей` : '– этажей'}</span>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">
                      {complex.description || 'Описание отсутствует'}
                    </p>

                    {complex.features && complex.features.length > 0 && (
                      <div className="mt-auto">
                        <div className="flex flex-wrap gap-2 mb-2">
                          {complex.features.slice(0, 3).map((feat, idx) => (
                            <span
                              key={idx}
                              className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded inline-flex items-center"
                            >
                  {feat}
                </span>
                          ))}
                          {complex.features.length > 3 && (
                            <span className="text-xs text-gray-500 inline-flex items-center">
                  +{complex.features.length - 3} еще
                </span>
                          )}
                        </div>
                        <div className="flex gap-2 mt-2">
                          <div className="flex-1">
                <span className="inline-block bg-primary-50 text-primary-700 px-3 py-2 rounded-4xl text-xs font-medium">
                  Подробнее
                </span>
                          </div>
                          <div>
                            <svg
                              className="w-5 h-5 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-12 h-12 text-gray-400"
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
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Комплексы не найдены
            </h3>
            <p className="text-gray-600 mb-6">
              Попробуйте изменить параметры поиска или{' '}
              <button
                onClick={() => setSearchQuery('')}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                сбросить фильтры
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplexesPage;