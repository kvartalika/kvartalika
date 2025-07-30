import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';

const SearchBar = () => {
  const { searchFilters, setSearchFilters } = useAppStore();
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Filter functionality is handled automatically by the store
    setShowFilters(false);
    
    // Navigate to apartments page if not already there
    if (location.pathname !== '/apartments') {
      navigate('/apartments');
    }
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

  const toggleBathroomFilter = (bathrooms: number) => {
    const currentBathrooms = searchFilters.bathrooms || [];
    const newBathrooms = currentBathrooms.includes(bathrooms)
      ? currentBathrooms.filter(b => b !== bathrooms)
      : [...currentBathrooms, bathrooms];
    handleFilterChange('bathrooms', newBathrooms);
  };

  const clearFilters = () => {
    setSearchFilters({
      query: '',
      rooms: [],
      bathrooms: [],
      finishing: [],
      minPrice: undefined,
      maxPrice: undefined,
      complex: '',
      hasParks: undefined,
      hasInfrastructure: undefined,
      isHot: undefined,
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
              className="input-field border-0 rounded-xl"
            />
          </div>

          {/* Filter Toggle Button */}
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`px-6 py-3 rounded-xl font-medium transition-colors ${
              showFilters || 
              (searchFilters.rooms && searchFilters.rooms.length > 0) || 
              (searchFilters.bathrooms && searchFilters.bathrooms.length > 0) ||
              (searchFilters.finishing && searchFilters.finishing.length > 0) ||
              searchFilters.minPrice || searchFilters.maxPrice || 
              searchFilters.hasParks !== undefined || searchFilters.hasInfrastructure !== undefined ||
              searchFilters.isHot !== undefined
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
            className="btn-primary px-8 py-3 rounded-xl"
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
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 mt-4 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Расширенные фильтры</h3>
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Очистить все
            </button>
          </div>

          <div className="space-y-8">
            {/* Basic Filters Section */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                Основные параметры
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Price Range */}
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    💰 Цена, ₽
                  </label>
                  <div className="space-y-2">
                    <input
                      type="number"
                      placeholder="От"
                      value={searchFilters.minPrice || ''}
                      onChange={(e) => handleFilterChange('minPrice', e.target.value ? Number(e.target.value) : undefined)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900"
                    />
                    <input
                      type="number"
                      placeholder="До"
                      value={searchFilters.maxPrice || ''}
                      onChange={(e) => handleFilterChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900"
                    />
                  </div>
                </div>

                {/* Rooms */}
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    🏠 Количество комнат
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[1, 2, 3, 4].map(rooms => (
                      <button
                        key={rooms}
                        type="button"
                        onClick={() => toggleRoomFilter(rooms)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          searchFilters.rooms?.includes(rooms)
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {rooms === 4 ? '4+' : rooms}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bathrooms */}
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    🚿 Количество санузлов
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[1, 2, 3].map(bathrooms => (
                      <button
                        key={bathrooms}
                        type="button"
                        onClick={() => toggleBathroomFilter(bathrooms)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          searchFilters.bathrooms?.includes(bathrooms)
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {bathrooms === 3 ? '3+' : bathrooms}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Property Details Section */}
            <div className="bg-blue-50 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Характеристики недвижимости
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Finishing */}
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    🎨 Отделка
                  </label>
                  <div className="space-y-2">
                    {finishingOptions.map(finishing => (
                      <label key={finishing} className="flex items-center p-2 rounded hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={searchFilters.finishing?.includes(finishing) || false}
                          onChange={() => toggleFinishingFilter(finishing)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="ml-3 text-sm text-gray-700">{finishing}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Residential Complex */}
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    🏢 Жилой комплекс
                  </label>
                  <select
                    value={searchFilters.complex || ''}
                    onChange={(e) => handleFilterChange('complex', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900"
                  >
                    <option value="">Любой</option>
                    <option value="ЖК Янтарный">ЖК Янтарный</option>
                    <option value="ЖК Нижний">ЖК Нижний</option>
                    <option value="ЖК Солнечный">ЖК Солнечный</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Special Offers & Features Section */}
            <div className="bg-green-50 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                Специальные предложения и удобства
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Hot Deals */}
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    🔥 Специальные предложения
                  </label>
                  <label className="flex items-center p-2 rounded hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={searchFilters.isHot || false}
                      onChange={(e) => handleFilterChange('isHot', e.target.checked || undefined)}
                      className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                    />
                    <span className="ml-3 text-sm text-gray-700">Горячие предложения</span>
                  </label>
                </div>

                {/* Parks and Infrastructure */}
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    🌳 Инфраструктура
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center p-2 rounded hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={searchFilters.hasParks || false}
                        onChange={(e) => handleFilterChange('hasParks', e.target.checked || undefined)}
                        className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                      />
                      <span className="ml-3 text-sm text-gray-700">Наличие парков</span>
                    </label>
                    <label className="flex items-center p-2 rounded hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={searchFilters.hasInfrastructure || false}
                        onChange={(e) => handleFilterChange('hasInfrastructure', e.target.checked || undefined)}
                        className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                      />
                      <span className="ml-3 text-sm text-gray-700">Развитая инфраструктура</span>
                    </label>
                  </div>
                </div>

                {/* Sorting */}
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    📊 Сортировка
                  </label>
                  <div className="space-y-2">
                    <select
                      value={searchFilters.sortBy || 'price'}
                      onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900"
                    >
                      <option value="price">По цене</option>
                      <option value="rooms">По количеству комнат</option>
                      <option value="area">По площади</option>
                      <option value="location">По удаленности от центра</option>
                    </select>
                    <select
                      value={searchFilters.sortOrder || 'asc'}
                      onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900"
                    >
                      <option value="asc">По возрастанию</option>
                      <option value="desc">По убыванию</option>
                    </select>
                  </div>
                </div>
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