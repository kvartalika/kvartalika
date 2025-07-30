import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';

const SearchBar = () => {
  const { searchFilters, setSearchFilters } = useAppStore();
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Filter functionality is handled automatically by the store
    setShowFilters(false);
  };

  const handleFilterChange = (key: string, value: any) => {
    setSearchFilters({ [key]: value });
  };

  const toggleRoomFilter = (rooms: number) => {
    const currentRooms = searchFilters.rooms || [];
    const newRooms = currentRooms.includes(rooms)
      ? currentRooms.filter(r => r !== rooms)
      : [...currentRooms, rooms];
    handleFilterChange('rooms', newRooms);
  };

  const toggleFinishingFilter = (finishing: string) => {
    const currentFinishing = searchFilters.finishing || [];
    const newFinishing = currentFinishing.includes(finishing)
      ? currentFinishing.filter(f => f !== finishing)
      : [...currentFinishing, finishing];
    handleFilterChange('finishing', newFinishing);
  };

  const clearFilters = () => {
    setSearchFilters({
      query: '',
      rooms: [],
      finishing: [],
      minPrice: undefined,
      maxPrice: undefined,
      complex: '',
      sortBy: 'price',
      sortOrder: 'asc'
    });
  };

  const finishingOptions = ['Черновая', 'Чистовая', 'Под ключ', 'Дизайнерская'];

  return (
    <div className="w-full">
      {/* Main Search Bar */}
      <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-xl p-2">
        <div className="flex flex-col lg:flex-row gap-2">
          {/* Search Input */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Поиск по названию ЖК или адресу..."
              value={searchFilters.query}
              onChange={(e) => handleFilterChange('query', e.target.value)}
              className="w-full px-4 py-3 text-gray-900 placeholder-gray-500 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Filter Toggle Button */}
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`px-6 py-3 rounded-xl font-medium transition-colors ${
              showFilters || (searchFilters.rooms && searchFilters.rooms.length > 0) || 
              (searchFilters.finishing && searchFilters.finishing.length > 0) ||
              searchFilters.minPrice || searchFilters.maxPrice
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
            </svg>
            Фильтры
          </button>

          {/* Search Button */}
          <button
            type="submit"
            className="px-8 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
          >
            <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Найти
          </button>
        </div>
      </form>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="bg-white rounded-2xl shadow-xl mt-4 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Расширенные фильтры</h3>
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Очистить все
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Цена, ₽
              </label>
              <div className="space-y-2">
                <input
                  type="number"
                  placeholder="От"
                  value={searchFilters.minPrice || ''}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
                <input
                  type="number"
                  placeholder="До"
                  value={searchFilters.maxPrice || ''}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
            </div>

            {/* Rooms */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Количество комнат
              </label>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4].map(rooms => (
                  <button
                    key={rooms}
                    type="button"
                    onClick={() => toggleRoomFilter(rooms)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      searchFilters.rooms?.includes(rooms)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {rooms === 4 ? '4+' : rooms}
                  </button>
                ))}
              </div>
            </div>

            {/* Finishing */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Отделка
              </label>
              <div className="space-y-2">
                {finishingOptions.map(finishing => (
                  <label key={finishing} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={searchFilters.finishing?.includes(finishing) || false}
                      onChange={() => toggleFinishingFilter(finishing)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{finishing}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Sorting */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Сортировка
              </label>
              <div className="space-y-2">
                <select
                  value={searchFilters.sortBy || 'price'}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="price">По цене</option>
                  <option value="rooms">По количеству комнат</option>
                  <option value="area">По площади</option>
                </select>
                <select
                  value={searchFilters.sortOrder || 'asc'}
                  onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="asc">По возрастанию</option>
                  <option value="desc">По убыванию</option>
                </select>
              </div>
            </div>
          </div>

          {/* Apply Filters Button */}
          <div className="flex justify-end mt-6">
            <button
              onClick={() => setShowFilters(false)}
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