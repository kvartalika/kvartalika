import {useCallback, type FormEvent, useRef, useState} from 'react';
import {useNavigate, createSearchParams} from 'react-router-dom';
import {useSearchStore, useUIStore, usePropertiesStore, type SearchFilters} from "../store";
import {useClickOutside} from "../hooks/useClickOutside.ts";

const serializeFiltersToParams = (filters: SearchFilters): Record<string, string> => {
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

const SearchBar = () => {
  const {
    filters,
    setFilters,
    resetFilters,
    performSearch,
  } = useSearchStore();

  const openModal = useUIStore(state => state.openModal);
  const modals = useUIStore(state => state.modals);
  const closeModal = useUIStore(state => state.closeModal);

  const categories = usePropertiesStore(state => state.categories);

  const [isCatOpen, setIsCatOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  useClickOutside(dropdownRef, () => setIsCatOpen(false));

  const homes = usePropertiesStore(state => state.homes);

  const [isHomeOpen, setIsHomeOpen] = useState(false);
  const homeRef = useRef<HTMLDivElement | null>(null);
  useClickOutside(homeRef, () => setIsHomeOpen(false));

  const toggleCategory = (id: number) => {
    const current = filters.categoriesId || [];
    const updated = current.includes(id)
      ? current.filter(c => c !== id)
      : [...current, id];
    handleFilterChange('categoriesId', updated.length > 0 ? updated : undefined);
  };

  const selectHome = (homeId?: number) => {
    handleFilterChange('homeId', homeId);
  };

  const navigate = useNavigate();

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    closeModal('filters');

    const params = serializeFiltersToParams(filters);
    const search = createSearchParams(params).toString();

    navigate({pathname: '/apartments', search}, {replace: true});
    performSearch(1);
  };

  const handleFilterChange = useCallback(
    (key: keyof SearchFilters, value: unknown) => {
      setFilters({[key]: value} as Partial<SearchFilters>);
    },
    [setFilters]
  );

  const toggleRoomFilter = (rooms: number) => {
    const current = filters.rooms ?? 0;
    handleFilterChange('rooms', current === rooms ? undefined : rooms);
  };

  const toggleBathroomFilter = (bathrooms: number) => {
    const current = filters.bathrooms ?? 0;
    handleFilterChange('bathrooms', current === bathrooms ? undefined : bathrooms);
  };

  const clearAll = () => {
    resetFilters();
    closeModal('filters');
  };

  const anyActive =
    Boolean(filters.query) ||
    filters.minPrice !== undefined ||
    filters.maxPrice !== undefined ||
    filters.rooms !== undefined ||
    filters.bathrooms !== undefined ||
    filters.isDecorated !== undefined ||
    filters.homeId !== undefined ||
    filters.hasParks !== undefined ||
    filters.hasSchools !== undefined ||
    filters.hasShops !== undefined ||
    (filters.categoriesId && filters.categoriesId.length > 0) ||
    Boolean(filters.sortBy) ||
    Boolean(filters.sortOrder);

  return (
    <div className="w-full">
      <form
        onSubmit={handleSearchSubmit}
        className="bg-white rounded-2xl shadow-xl p-2"
      >
        <div className="flex flex-col lg:flex-row gap-2">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Поиск по названию ЖК или адресу..."
              value={filters.query || ''}
              onChange={(e) => handleFilterChange('query', e.target.value)}
              className="input-field border-0 rounded-xl w-full px-4 py-3"
            />
          </div>

          <button
            type="button"
            onClick={() => {
              return (modals.filters) ? closeModal('filters') : openModal('filters');
            }}
            className={`px-6 py-3 rounded-xl font-medium transition-colors flex items-center gap-2 ${
              modals.filters || anyActive
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <svg
              className="w-5 h-5 inline"
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
          </button>

          <button
            type="submit"
            className="btn-primary px-8 py-3 rounded-xl flex items-center gap-2"
          >
            <svg
              className="w-5 h-5 inline"
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
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 mt-4 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Расширенные фильтры</h3>
            <button
              onClick={clearAll}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Очистить все
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 text-gray-700 ">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Цена, ₽</label>
              <div className="space-y-2">
                <input
                  type="number"
                  placeholder="От"
                  value={filters.minPrice ?? ''}
                  onChange={(e) =>
                    handleFilterChange('minPrice', e.target.value ? Number(e.target.value) : undefined)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
                <input
                  type="number"
                  placeholder="До"
                  value={filters.maxPrice ?? ''}
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
                      filters.rooms === r ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
                      filters.bathrooms === b
                        ? 'bg-blue-600 text-white'
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
                  checked={filters.isDecorated || false}
                  onChange={(e) => handleFilterChange('isDecorated', e.target.checked || undefined)}
                  className="w-4 h-4"
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
                  {homes.find(h => h.id === filters.homeId)?.name || 'Выбрать ЖК'}
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
                        {filters.homeId === home.id &&
                          <span className="text-blue-600 text-xs">✓</span>}
                      </div>
                    ))}
                    {homes.length === 0 && (
                      <div className="p-3 text-xs text-gray-500">Жилые комплексы не найдены</div>
                    )}
                    {filters.homeId != null && (
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
                  {filters.categoriesId && filters.categoriesId.length > 0
                    ? `Выбрано: ${filters.categoriesId.length}`
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
                          checked={filters.categoriesId?.includes(cat.id) || false}
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
                  value={filters.sortBy || 'price'}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="price">По цене</option>
                  <option value="rooms">По комнатам</option>
                  <option value="area">По площади</option>
                  <option value="location">По удалённости</option>
                </select>
                <select
                  value={filters.sortOrder || 'asc'}
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
                    checked={filters.hasParks || false}
                    onChange={(e) => handleFilterChange('hasParks', e.target.checked || undefined)}
                    className="w-4 h-4"
                  />
                  <span className="ml-2 text-sm">Парки</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.hasSchools || false}
                    onChange={(e) => handleFilterChange('hasSchools', e.target.checked || undefined)}
                    className="w-4 h-4"
                  />
                  <span className="ml-2 text-sm">Школы</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.hasShops || false}
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
              onClick={() => closeModal('filters')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Применить фильтры
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
