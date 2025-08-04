import {
  type FormEvent,
  memo,
  useCallback,
  useMemo,
  useRef,
  useState
} from 'react';
import {createSearchParams, useNavigate} from 'react-router-dom';
import {useClickOutside} from "../hooks/useClickOutside.ts";
import type {SearchRequest} from "../services";
import {useFlatsStore} from "../store/flats.store.ts";
import {useUIStore} from "../store/ui.store.ts";

const serializeFiltersToParams = (filters: SearchRequest): Record<string, string> => {
  const params: Record<string, string> = {};

  if (filters.query) params.query = filters.query;
  if (filters.minPrice !== undefined) params.minPrice = String(filters.minPrice);
  if (filters.maxPrice !== undefined) params.maxPrice = String(filters.maxPrice);
  if (filters.rooms !== undefined) params.rooms = String(filters.rooms);
  if (filters.bathrooms !== undefined) params.bathrooms = String(filters.bathrooms);
  if (filters.isDecorated !== undefined) params.isDecorated = String(filters.isDecorated);
  if (filters.homeId !== undefined) params.homeId = String(filters.homeId);
  if (filters.hasParks !== undefined) params.hasParks = String(filters.hasParks);
  if (filters.hasSchools !== undefined) params.hasSchools = String(filters.hasSchools);
  if (filters.hasShops !== undefined) params.hasShops = String(filters.hasShops);
  if (filters.categoriesId && filters.categoriesId.length > 0) {
    params.categoriesId = filters.categoriesId.join(',');
  }
  if (filters.sortBy) params.sortBy = filters.sortBy;
  if (filters.sortOrder) params.sortOrder = filters.sortOrder;

  return params;
};

const SearchBar = memo(() => {
  const {
    currentSearchParams,
    setFilters,
    clearSearch,
    searchFlats,
    categories,
    homes
  } = useFlatsStore();

  const openModal = useUIStore(state => state.openModal);
  const modals = useUIStore(state => state.modals);
  const closeModal = useUIStore(state => state.closeModal);

  const [isCatOpen, setIsCatOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  useClickOutside(dropdownRef, () => setIsCatOpen(false));

  const [isHomeOpen, setIsHomeOpen] = useState(false);
  const homeRef = useRef<HTMLDivElement | null>(null);
  useClickOutside(homeRef, () => setIsHomeOpen(false));

  const navigate = useNavigate();

  const handleFilterChange = useCallback(
    (key: keyof SearchRequest, value: unknown) => {
      setFilters({[key]: value} as Partial<SearchRequest>);
    },
    [setFilters]
  );

  const toggleCategory = useCallback((id: number) => {
    const current = currentSearchParams.categoriesId || [];
    const updated = current.includes(id)
      ? current.filter(c => c !== id)
      : [...current, id];
    handleFilterChange('categoriesId', updated.length > 0 ? updated : undefined);
  }, [currentSearchParams.categoriesId, handleFilterChange]);

  const selectHome = useCallback((homeId?: number) => {
    handleFilterChange('homeId', homeId);
  }, [handleFilterChange]);

  const handleSearchSubmit = useCallback((e: FormEvent) => {
    e.preventDefault();
    closeModal('filters');

    const params = serializeFiltersToParams(currentSearchParams);
    const search = createSearchParams(params).toString();

    navigate({pathname: '/apartments', search}, {replace: true});
    void searchFlats(1);
  }, [currentSearchParams, closeModal, searchFlats]);

  const toggleRoomFilter = useCallback((rooms: number) => {
    const current = currentSearchParams.rooms ?? 0;
    handleFilterChange('rooms', current === rooms ? undefined : rooms);
  }, [currentSearchParams.rooms, handleFilterChange]);

  const toggleBathroomFilter = useCallback((bathrooms: number) => {
    const current = currentSearchParams.bathrooms ?? 0;
    handleFilterChange('bathrooms', current === bathrooms ? undefined : bathrooms);
  }, [currentSearchParams.bathrooms, handleFilterChange]);

  const clearAll = useCallback(() => {
    clearSearch();
    closeModal('filters');
  }, [navigate, clearSearch, closeModal]);

  const anyActive = useMemo(() =>
      Boolean(currentSearchParams.query) ||
      currentSearchParams.minPrice !== undefined ||
      currentSearchParams.maxPrice !== undefined ||
      currentSearchParams.rooms !== undefined ||
      currentSearchParams.bathrooms !== undefined ||
      currentSearchParams.isDecorated !== undefined ||
      currentSearchParams.homeId !== undefined ||
      currentSearchParams.hasParks !== undefined ||
      currentSearchParams.hasSchools !== undefined ||
      currentSearchParams.hasShops !== undefined ||
      (currentSearchParams.categoriesId && currentSearchParams.categoriesId.length > 0) ||
      Boolean(currentSearchParams.sortBy) ||
      Boolean(currentSearchParams.sortOrder),
    [currentSearchParams]);

  const activeFiltersCount = useMemo(() =>
      Object.keys(currentSearchParams).filter(key =>
        currentSearchParams[key as keyof typeof currentSearchParams] !== undefined &&
        currentSearchParams[key as keyof typeof currentSearchParams] !== '' &&
        key !== 'sortBy' && key !== 'sortOrder'
      ).length,
    [currentSearchParams]
  );

  return (
    <div className="w-full">
      <form
        onSubmit={handleSearchSubmit}
        className="bg-white rounded-2xl shadow-xl p-4"
      >
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
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
            <input
              type="text"
              placeholder="Поиск по названию ЖК или адресу..."
              value={currentSearchParams.query || ''}
              onChange={(e) => handleFilterChange('query', e.target.value)}
              className="input-field border-0 rounded-xl w-full pl-10 pr-4 py-3 bg-gray-50 focus:bg-white transition-colors"
            />
          </div>

          <button
            type="button"
            onClick={() => {
              return (modals.filters) ? closeModal('filters') : openModal('filters');
            }}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 ${
              modals.filters || anyActive
                ? 'bg-accent-500 text-surface-50 shadow-lg shadow-accent-500/25'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
            }`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10h18M3 16h18M3 22h18"
              />
            </svg>
            Фильтры
            {anyActive && (
              <span className="bg-white text-primary-600 text-xs px-2 py-1 rounded-full font-bold">
                {activeFiltersCount}
              </span>
            )}
          </button>

          <button
            type="submit"
            className="btn-primary px-8 py-3 rounded-xl flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
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
            Найти
          </button>
        </div>
      </form>

      {modals.filters && (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 mt-4 p-6 animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Расширенные фильтры</h3>
            <div className="flex items-center gap-3">
              {activeFiltersCount > 0 && (
                <span className="text-sm text-gray-500">
                  Активных фильтров: {activeFiltersCount}
                </span>
              )}
              <button
                onClick={clearAll}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium hover:underline transition-colors"
              >
                Очистить все
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 text-gray-700 ">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Цена, ₽</label>
              <div className="space-y-2">
                <input
                  type="number"
                  placeholder="От"
                  value={currentSearchParams.minPrice ?? ''}
                  onChange={(e) =>
                    handleFilterChange('minPrice', e.target.value ? Number(e.target.value) : undefined)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm "
                />
                <input
                  type="number"
                  placeholder="До"
                  value={currentSearchParams.maxPrice ?? ''}
                  onChange={(e) =>
                    handleFilterChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Количество комнат</label>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4].map(r => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => toggleRoomFilter(r)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      currentSearchParams.rooms === r ? 'bg-accent-500 text-surface-50' : 'bg-surface-100 text-surface-700 hover:bg-surface-200'
                    }`}
                  >
                    {r === 4 ? '4+' : r}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Санузлы</label>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3].map(b => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => toggleBathroomFilter(b)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      currentSearchParams.bathrooms === b
                        ? 'bg-accent-500 text-surface-50'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {b === 3 ? '3+' : b}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Отделка</label>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={currentSearchParams.isDecorated || false}
                  onChange={(e) => handleFilterChange('isDecorated', e.target.checked || undefined)}
                  className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  id="decorated-checkbox"
                />
                <label
                  htmlFor="decorated-checkbox"
                  className="ml-2 text-sm"
                >
                  С отделкой
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Жилой комплекс</label>
              <div
                className="relative"
                ref={homeRef}
              >
                <button
                  type="button"
                  onClick={() => {
                    setIsHomeOpen(o => !o);
                  }}
                  className="w-full flex justify-between items-center px-4 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  {homes.find(h => h.id === currentSearchParams.homeId)?.name || 'Выбрать ЖК'}
                  <span className="ml-2">▾</span>
                </button>

                {isHomeOpen && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded shadow max-h-60 overflow-auto">
                    {homes.map(home => (
                      <div
                        key={home.id}
                        className="px-3 py-2 hover:bg-gray-50 cursor-pointer flex justify-between items-center"
                        onClick={() => {
                          selectHome(home.id);
                          setIsHomeOpen(false);
                        }}
                      >
                        <span className="text-sm">{home.name}</span>
                        {currentSearchParams.homeId === home.id &&
                          <span className="text-primary-600 text-xs">✓</span>}
                      </div>
                    ))}
                    {homes.length === 0 && (
                      <div className="p-3 text-xs text-gray-500">Жилые комплексы не найдены</div>
                    )}
                    {currentSearchParams.homeId != null && (
                      <div className="border-t mt-1">
                        <button
                          type="button"
                          onClick={() => {
                            selectHome(undefined);
                            setIsHomeOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-gray-50"
                        >
                          Сбросить выбор
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Категории</label>
              <div
                className="relative"
                ref={dropdownRef}
              >
                <button
                  type="button"
                  onClick={() => setIsCatOpen(o => !o)}
                  className="w-full flex justify-between items-center px-4 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  {currentSearchParams.categoriesId && currentSearchParams.categoriesId.length > 0
                    ? `Выбрано: ${currentSearchParams.categoriesId.length}`
                    : 'Выбрать категории'}
                  <span className="ml-2">▾</span>
                </button>

                {isCatOpen && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded shadow max-h-60 overflow-auto">
                    {categories.map(cat => (
                      <label
                        key={cat.id}
                        className="flex items-center px-3 py-2 hover:bg-gray-50"
                      >
                        <input
                          type="checkbox"
                          checked={currentSearchParams.categoriesId?.includes(cat.id) || false}
                          onChange={() => toggleCategory(cat.id)}
                          className="mr-2"
                        />
                        <span className="text-sm">{cat.name}</span>
                      </label>
                    ))}

                    {categories.length === 0 && (
                      <div className="p-3 text-xs text-gray-500">Категории не найдены</div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Sorting */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Сортировка</label>
              <div className="space-y-2">
                <select
                  value={currentSearchParams.sortBy || 'price'}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="price">По цене</option>
                  <option value="rooms">По комнатам</option>
                  <option value="area">По площади</option>
                  <option value="location">По удалённости</option>
                </select>
                <select
                  value={currentSearchParams.sortOrder || 'asc'}
                  onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="asc">По возрастанию</option>
                  <option value="desc">По убыванию</option>
                </select>
              </div>
            </div>

            {/* Infrastructure */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Инфраструктура</label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={currentSearchParams.hasParks || false}
                    onChange={(e) => handleFilterChange('hasParks', e.target.checked || undefined)}
                    className="w-4 h-4"
                  />
                  <span className="ml-2 text-sm">Парки</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={currentSearchParams.hasSchools || false}
                    onChange={(e) => handleFilterChange('hasSchools', e.target.checked || undefined)}
                    className="w-4 h-4"
                  />
                  <span className="ml-2 text-sm">Школы</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={currentSearchParams.hasShops || false}
                    onChange={(e) => handleFilterChange('hasShops', e.target.checked || undefined)}
                    className="w-4 h-4"
                  />
                  <span className="ml-2 text-sm">Магазины</span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={(e) => handleSearchSubmit(e)}
              className="px-6 py-2 bg-accent-500 text-surface-50 rounded-xl font-medium hover:bg-accent-600 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Применить фильтры
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

SearchBar.displayName = 'SearchBar';

export default SearchBar;