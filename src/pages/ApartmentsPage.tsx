import {useEffect, useMemo} from 'react';
import {Link, useNavigate, useSearchParams} from 'react-router-dom';
import ApartmentCard from '../components/ApartmentCard';
import SearchBar from '../components/SearchBar';
import {type SearchFilters, useSearchStore, useUIStore} from "../store";

const ApartmentsPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const openModal = useUIStore(state => state.openModal);

  const {
    filters,
    searchResultsFlats,
    isSearching,
    currentPage,
    totalPages,
    totalResults,
    limit,
    searchError,
    performSearch,
    setFilters,
    setPage,
    setLimit,
    resetFilters,
  } = useSearchStore();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const raw = Object.fromEntries([...searchParams]);

    const parsed: Partial<SearchFilters> = {};

    if (raw.query) {
      parsed.query = String(raw.query);
    }

    if (raw.minPrice) {
      const v = parseInt(String(raw.minPrice), 10);
      if (!isNaN(v)) parsed.minPrice = v;
    }
    if (raw.maxPrice) {
      const v = parseInt(String(raw.maxPrice), 10);
      if (!isNaN(v)) parsed.maxPrice = v;
    }

    if (raw.rooms) {
      const v = parseInt(String(raw.rooms), 10);
      if (!isNaN(v)) parsed.rooms = v;
    }

    if (raw.bathrooms) {
      const v = parseInt(String(raw.bathrooms), 10);
      if (!isNaN(v)) parsed.bathrooms = v;
    }

    if (raw.isDecorated !== undefined) {
      parsed.isDecorated = String(raw.isDecorated).toLowerCase() === 'true';
    }

    if (raw.homeId) {
      const v = parseInt(String(raw.homeId), 10);
      if (!isNaN(v)) parsed.homeId = v;
    }

    if (raw.hasParks !== undefined) {
      parsed.hasParks = String(raw.hasParks).toLowerCase() === 'true';
    }
    if (raw.hasSchools !== undefined) {
      parsed.hasSchools = String(raw.hasSchools).toLowerCase() === 'true';
    }
    if (raw.hasShops !== undefined) {
      parsed.hasShops = String(raw.hasShops).toLowerCase() === 'true';
    }

    const categoriesParam = searchParams.get('categoriesId') || searchParams.get('category');
    if (categoriesParam) {
      const arr = categoriesParam
        .split(',')
        .map(s => parseInt(s.trim(), 10))
        .filter(n => !isNaN(n));
      if (arr.length) parsed.categoriesId = arr;
    }

    const sortBy = searchParams.get('sortBy');
    if (sortBy && ['price', 'rooms', 'area', 'location'].includes(sortBy)) {
      parsed.sortBy = sortBy as SearchFilters['sortBy'];
    }
    const sortOrder = searchParams.get('sortOrder');
    if (sortOrder && ['asc', 'desc'].includes(sortOrder)) {
      parsed.sortOrder = sortOrder as SearchFilters['sortOrder'];
    }

    setFilters(parsed);
  }, [performSearch, searchParams, setFilters]);

  const pagedFlats = useMemo(() => {
    const start = (currentPage - 1) * limit;
    return searchResultsFlats.slice(start, start + limit);
  }, [searchResultsFlats, currentPage, limit]);

  const getPageTitle = () => {
    if (filters.categoriesId && filters.categoriesId.length === 1) {
      return `Квартиры категории ${filters.categoriesId[0]}`;
    }
    if (filters.rooms) {
      return `${filters.rooms}-комнатные квартиры`;
    }
    if (filters.homeId) {
      return `Квартиры в комплексе ${filters.homeId}`;
    }
    return 'Все квартиры';
  };

  const getPageDescription = () => {
    if (filters.categoriesId && filters.categoriesId.length === 1) {
      return `Подборка квартир из категории ${filters.categoriesId[0]}`;
    }
    if (filters.rooms) {
      return `Подберите идеальную ${filters.rooms}-комнатную квартиру`;
    }
    if (filters.homeId) {
      return `Большой выбор квартир в выбранном комплексе`;
    }
    return 'Большой выбор квартир в лучших жилых комплексах города';
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
  };
  return (
    <div className="min-h-screen pt-20">

      <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center text-white mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{getPageTitle()}</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">{getPageDescription()}</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <SearchBar />
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <nav className="mb-8">
          <div className="flex items-center text-sm text-gray-600">
            <Link
              to="/"
              className="text-blue-600 hover:text-blue-700"
            >
              Главная
            </Link>
            <span className="mx-2">›</span>
            <span className="text-gray-900">Квартиры</span>
          </div>
        </nav>

        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-gray-600">
              Найдено квартир:{' '}
              <span className="font-semibold text-gray-900">{totalResults}</span>
            </p>
          </div>
          <div className="flex gap-4">
            <div>
              <label className="text-sm text-gray-500 mr-2">На странице:</label>
              <select
                value={limit}
                onChange={(e) => handleLimitChange(Number(e.target.value))}
                className="rounded border px-2 py-1"
              >
                {[10, 20, 50].map(n => (
                  <option
                    key={n}
                    value={n}
                  >{n}</option>
                ))}
              </select>
            </div>
            <div>
              <span className="text-sm text-gray-500">
                Страница {currentPage} из {totalPages}
              </span>
            </div>
          </div>
        </div>

        {isSearching && (
          <div className="mb-6 text-gray-500 font-medium">Загрузка квартир...</div>
        )}

        {searchError && (
          <div className="mb-6 text-red-600 font-medium">{searchError}</div>
        )}

        {!isSearching && searchResultsFlats.length === 0 && !searchError && (
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
              Квартиры не найдены
            </h3>
            <p className="text-gray-600 mb-6">
              Попробуйте изменить параметры поиска или{' '}
              <button
                onClick={() => {
                  resetFilters();
                  navigate('/apartments');
                }}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                посмотреть все квартиры
              </button>
            </p>
          </div>
        )}

        {pagedFlats.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {pagedFlats.map((apartment) => (
              <ApartmentCard
                key={apartment.id}
                apartment={apartment}
                onBookingClick={() => openModal('bid')}
              />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              disabled={currentPage === 1 || isSearching}
              onClick={() => handlePageChange(currentPage - 1)}
              className="px-4 py-2 bg-gray-100 rounded disabled:opacity-50"
            >
              Назад
            </button>
            <span>
              {currentPage} / {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages || isSearching}
              onClick={() => handlePageChange(currentPage + 1)}
              className="px-4 py-2 bg-gray-100 rounded disabled:opacity-50"
            >
              Вперед
            </button>
          </div>
        )}

        <section className="mt-16 bg-blue-600 rounded-2xl p-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Не нашли подходящую квартиру?
            </h2>
            <p className="text-blue-100 mb-6">
              Наши специалисты помогут подобрать идеальный вариант под ваши требования и бюджет
            </p>
            <button
              onClick={() => openModal('bid')}
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-medium transition-colors"
            >
              Получить персональную подборку
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ApartmentsPage;