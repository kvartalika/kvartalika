import {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {usePropertiesStore} from "../store/properties.store.ts";
import type {Home} from "../services";

const ComplexesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const fetchHomes = usePropertiesStore(state => state.fetchHomes);
  const complexes = usePropertiesStore(state => state.homes);

  const isLoadingHomes = usePropertiesStore(state => state.isLoadingHomes);
  const error = usePropertiesStore(state => state.error);

  const [filteredComplexes, setFilteredComplexes] = useState<Home[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchHomes();
        setFilteredComplexes(complexes);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, [fetchHomes]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredComplexes(complexes);
    } else {
      const filtered = complexes.filter(complex =>
        complex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        complex.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        complex.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredComplexes(filtered);
    }
  }, [searchQuery, complexes]);

  return (
    <div className="min-h-screen pt-20">
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Жилые комплексы
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
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
                className="w-full px-6 py-4 text-lg border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-14 bg-white"
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

        {error && (
          <div className="mb-6 text-red-600 font-medium">{error}</div>
        )}

        {filteredComplexes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredComplexes.map(complex => (
              <Link
                key={complex.id}
                to={`/complex/${encodeURIComponent(complex.name)}`}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={complex.images[0] || '/images/complex-placeholder.jpg'}
                    alt={complex.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {complex.numberOfFloors} этажей
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {complex.name}
                  </h3>

                  <div className="flex items-center text-gray-600 mb-3">
                    <svg
                      className="w-4 h-4 mr-2"
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
                    <span className="text-sm">{complex.address}</span>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {complex.description}
                  </p>

                  {complex.features && complex.features.length > 0 && (
                    <div className="border-t pt-4">
                      <div className="flex flex-wrap gap-2">
                        {complex.features.slice(0, 3).map((amenity, index) => (
                          <span
                            key={index}
                            className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                          >
                            {amenity}
                          </span>
                        ))}
                        {complex.features.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{complex.features.length - 3} еще
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </Link>
            ))}
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
                className="text-blue-600 hover:text-blue-700 font-medium"
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