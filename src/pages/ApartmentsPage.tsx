import {useEffect, useMemo, useCallback} from 'react';
import {Link, useNavigate, useSearchParams} from 'react-router-dom';
import ApartmentCard from '../components/ApartmentCard';
import SearchBar from '../components/SearchBar';
import type {SearchRequest} from "../services";
import {useUIStore} from "../store/ui.store.ts";
import {useFlatsStore} from "../store/flats.store.ts";


const ApartmentsPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const openModal = useUIStore(state => state.openModal);

  const {
    currentSearchParams,
    searchResults,
    isSearching,
    currentPage,
    totalPages,
    totalResults,
    limit,
    searchError,
    setFilters,
    setPage,
    setLimit,
    resetFilters,
    searchFlats,
    homes,
    categories
  } = useFlatsStore();

  useEffect(() => {
    window.scrollTo(0, 0);

    const raw = Object.fromEntries([...searchParams]);
    const parsed: Partial<SearchRequest> = {};

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

    const categoriesParam = searchParams.get('categoriesId');
    if (categoriesParam) {
      const arr = categoriesParam
        .split(',')
        .map(s => parseInt(s.trim(), 10))
        .filter(n => !isNaN(n));
      if (arr.length) parsed.categoriesId = arr;
    }

    const sortBy = searchParams.get('sortBy');
    if (sortBy && ['price', 'rooms', 'area', 'location'].includes(sortBy)) {
      parsed.sortBy = sortBy as SearchRequest['sortBy'];
    }
    const sortOrder = searchParams.get('sortOrder');
    if (sortOrder && ['asc', 'desc'].includes(sortOrder)) {
      parsed.sortOrder = sortOrder as SearchRequest['sortOrder'];
    }

    setFilters(parsed);
    void searchFlats(1);
  }, [searchParams, setFilters, searchFlats]);

  useEffect(() => {
    return () => {
      resetFilters();
    };
  }, [resetFilters]);

  const pagedFlats = useMemo(() => {
    const start = (currentPage - 1) * limit;
    return searchResults.slice(start, start + limit);
  }, [searchResults, currentPage, limit]);

  const getPageTitle = useCallback(() => {
    const curCat = currentSearchParams.categoriesId;
    if (curCat && curCat.length === 1) {
      const cat = categories?.find((c) => c.id === curCat[0])
      if (cat)
        return `Квартиры категории ${cat.name}`;
    }
    if (currentSearchParams.rooms) {
      return `${currentSearchParams.rooms}-комнатные квартиры`;
    }
    if (currentSearchParams.homeId) {
      const curHome = homes.find((c) => c.id === currentSearchParams.homeId);
      if (curHome)
        return `Квартиры в комплексе ${curHome.name}`;
    }
    return 'Квартиры на любой вкус';
  }, [currentSearchParams, categories, homes]);

  const getPageDescription = useCallback(() => {
    if (currentSearchParams.categoriesId && currentSearchParams.categoriesId.length === 1) {
      const curCat = currentSearchParams.categoriesId;
      const cat = categories?.find((c) => c.id === curCat[0])
      if (cat)
        return `Подборка квартир из категории ${cat.name}`;
    }
    if (currentSearchParams.rooms) {
      return `Подберите идеальную ${currentSearchParams.rooms}-комнатную квартиру`;
    }
    if (currentSearchParams.homeId) {
      return `Большой выбор квартир в выбранном комплексе`;
    }
    return 'Большой выбор квартир в лучших жилых комплексах города';
  }, [currentSearchParams, categories]);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, [setPage]);

  const handleLimitChange = useCallback((newLimit: number) => {
    setLimit(newLimit);
  }, [setLimit]);

  const handleBookingClick = useCallback(() => {
    openModal('bid');
  }, [openModal]);

  const handleClearSearch = useCallback(() => {
    resetFilters();
    navigate('/apartments');
  }, [resetFilters, navigate]);

  const pageTitle = useMemo(() => getPageTitle(), [getPageTitle]);
  const pageDescription = useMemo(() => getPageDescription(), [getPageDescription]);

  return (
    <div className="min-h-screen pt-16">

      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-indigo-800 py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 to-indigo-600/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center text-white mb-12">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">{pageTitle}</h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto animate-slide-up">{pageDescription}</p>
          </div>

          <div className="max-w-4xl mx-auto animate-slide-up">
            <SearchBar />
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <nav className="mb-8">
          <div className="flex items-center text-sm text-gray-600">
            <Link
              to="/"
              className="text-primary-600 hover:text-primary-700"
            >
              Главная
            </Link>
            <span className="mx-2">›</span>
            <span className="text-gray-900">Квартиры</span>
          </div>
        </nav>

        <div className="flex items-center justify-between mb-8 p-6 bg-white rounded-2xl shadow-lg">
          <div>
            <p className="text-gray-600">
              Найдено квартир:{' '}
              <span className="font-semibold text-gray-900 text-lg">{totalResults}</span>
            </p>
          </div>
          <div className="flex gap-4 items-center">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-500">На странице:</label>
              <select
                value={limit}
                onChange={(e) => handleLimitChange(Number(e.target.value))}
                className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {[10, 20, 50].map(n => (
                  <option
                    key={n}
                    value={n}
                  >{n}</option>
                ))}
              </select>
            </div>
            <div className="text-sm text-gray-500">
              Страница <span className="font-semibold">{currentPage}</span> из <span className="font-semibold">{totalPages}</span>
            </div>
          </div>
        </div>

        {isSearching && (
          <div className="mb-6 text-gray-500 font-medium">Загрузка квартир...</div>
        )}

        {searchError && (
          <div className="mb-6 text-red-600 font-medium">{searchError}</div>
        )}

        {!isSearching && searchResults.length === 0 && !searchError && (
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
                onClick={handleClearSearch}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                посмотреть все квартиры
              </button>
            </p>
          </div>
        )}

        {pagedFlats.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {pagedFlats.map((apartment) => (
              <ApartmentCard
                homeName={homes.find(home => home.id === apartment.flat.homeId)?.name ?? '?'}
                key={apartment.flat.id}
                apartment={apartment}
                onBookingClick={handleBookingClick}
              />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-12">
            <button
              disabled={currentPage === 1 || isSearching}
              onClick={() => handlePageChange(currentPage - 1)}
              className="px-6 py-3 bg-white border border-gray-200 rounded-xl disabled:opacity-50 hover:bg-gray-50 transition-colors font-medium"
            >
              ← Назад
            </button>
            <div className="flex items-center gap-2">
              {Array.from({length: Math.min(5, totalPages)}, (_, i) => {
                const page = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                if (page > totalPages) return null;
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                                          className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                        page === currentPage
                          ? 'bg-primary-600 text-surface-50'
                          : 'bg-surface-50 border border-surface-200 text-surface-700 hover:bg-surface-100'
                      }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>
            <button
              disabled={currentPage === totalPages || isSearching}
              onClick={() => handlePageChange(currentPage + 1)}
              className="px-6 py-3 bg-white border border-gray-200 rounded-xl disabled:opacity-50 hover:bg-gray-50 transition-colors font-medium"
            >
              Вперед →
            </button>
          </div>
        )}

        <section className="mt-20 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 rounded-3xl p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 to-indigo-600/20"></div>
          <div className="max-w-3xl mx-auto text-center relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Не нашли подходящую квартиру?
            </h2>
            <p className="text-gray-200 mb-8 text-lg">
              Наши специалисты помогут подобрать идеальный вариант под ваши требования и бюджет
            </p>
            <button
              onClick={handleBookingClick}
              className="bg-white text-primary-600 hover:bg-gray-100 px-10 py-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
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