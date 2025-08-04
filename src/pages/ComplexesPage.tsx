import {useEffect, useState} from 'react';
import type {ResolvedHome} from "../services";
import {useFlatsStore} from "../store/flats.store.ts";
import ComplexCard from "../components/ComplexCard.tsx";

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
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Жилые комплексы
            </h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
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
            {filteredComplexes.map(complex => (
              <ComplexCard key={complex.id} complex={complex} />
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