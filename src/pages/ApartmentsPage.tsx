import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  usePropertiesStore,
  useSearchStore,
  useUIStore,
  useApartments,
  useSearchResults,
  useSearchFilters,
  useSearchLoading,
  type Apartment,
  type SearchFilters
} from '../store';
import ApartmentCard from '../components/ApartmentCard';
import SearchBar from '../components/SearchBar';

const ApartmentsPage = () => {
  const apartments = useApartments();
  const { apartments: searchResultApartments } = useSearchResults();
  const filters = useSearchFilters();
  const isSearching = useSearchLoading();
  const [searchParams] = useSearchParams();
  
  const { 
    fetchFlats, 
    fetchHomes,
    isLoadingFlats,
    isLoadingHomes 
  } = usePropertiesStore();
  
  const { 
    setFilters, 
    performSearch,
    resetFilters 
  } = useSearchStore();
  
  const { 
    openModal, 
    setBookingForm 
  } = useUIStore();
  
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          fetchFlats(),
          fetchHomes(),
        ]);
      } catch (error) {
        console.error('Failed to load apartments data:', error);
      }
    };
    
    loadData();
  }, []);

  // Apply URL parameters to search filters
  useEffect(() => {
    // Reset filters first to avoid conflicts
    resetFilters();
    
    // If there are no URL parameters, just return
    if (searchParams.toString() === '') {
      return;
    }
    
    const urlFilters: Partial<SearchFilters> = {};
    
    // Handle rooms filter
    const roomsParam = searchParams.get('rooms');
    if (roomsParam) {
      const roomsArray = roomsParam.split(',').map(r => parseInt(r.trim())).filter(r => !isNaN(r));
      if (roomsArray.length > 0) {
        urlFilters.rooms = roomsArray;
      }
    }
    
    // Handle finishing filter
    const finishingParam = searchParams.get('finishing');
    if (finishingParam) {
      const finishingArray = finishingParam.split(',').map(f => f.trim()).filter(f => f.length > 0);
      if (finishingArray.length > 0) {
        urlFilters.finishing = finishingArray;
      }
    }
    
    // Handle complex filter
    const complexParam = searchParams.get('complex');
    if (complexParam) {
      urlFilters.query = complexParam; // Use query field for complex search
    }
    
    // Handle hot deals filter
    const hotParam = searchParams.get('hot');
    if (hotParam === 'true') {
      urlFilters.query = 'горячие предложения';
    }
    
    // Handle price filters
    const minPriceParam = searchParams.get('minPrice');
    const maxPriceParam = searchParams.get('maxPrice');
    if (minPriceParam) {
      const minPrice = parseInt(minPriceParam);
      if (!isNaN(minPrice)) {
        urlFilters.minPrice = minPrice;
      }
    }
    if (maxPriceParam) {
      const maxPrice = parseInt(maxPriceParam);
      if (!isNaN(maxPrice)) {
        urlFilters.maxPrice = maxPrice;
      }
    }
    
    // Handle area filters
    const minAreaParam = searchParams.get('minArea');
    const maxAreaParam = searchParams.get('maxArea');
    if (minAreaParam) {
      const minArea = parseInt(minAreaParam);
      if (!isNaN(minArea)) {
        urlFilters.minArea = minArea;
      }
    }
    if (maxAreaParam) {
      const maxArea = parseInt(maxAreaParam);
      if (!isNaN(maxArea)) {
        urlFilters.maxArea = maxArea;
      }
    }
    
    // Handle boolean filters
    const hasParksParam = searchParams.get('hasParks');
    if (hasParksParam === 'true') {
      urlFilters.hasParks = true;
    } else if (hasParksParam === 'false') {
      urlFilters.hasParks = false;
    }
    
    const hasSchoolsParam = searchParams.get('hasSchools');
    if (hasSchoolsParam === 'true') {
      urlFilters.hasSchools = true;
    } else if (hasSchoolsParam === 'false') {
      urlFilters.hasSchools = false;
    }
    
    const hasShopsParam = searchParams.get('hasShops');
    if (hasShopsParam === 'true') {
      urlFilters.hasShops = true;
    } else if (hasShopsParam === 'false') {
      urlFilters.hasShops = false;
    }
    
    // Apply the filters and perform search
    setFilters(urlFilters);
    
    // Only perform search if there are meaningful filters
    if (Object.keys(urlFilters).length > 0) {
      performSearch();
    }
  }, [searchParams]);

  const handleBookingClick = (apartment: Apartment) => {
    setBookingForm({ 
      apartmentId: apartment.id,
      flatId: apartment.id,
      complexId: apartment.complexId,
      homeId: apartment.complexId 
    });
    openModal('booking');
  };

  // Determine which apartments to show
  const hasActiveFilters = filters.query || 
    filters.minPrice || 
    filters.maxPrice || 
    (filters.rooms && filters.rooms.length > 0) ||
    (filters.finishing && filters.finishing.length > 0) ||
    filters.hasParks !== undefined ||
    filters.hasSchools !== undefined ||
    filters.hasShops !== undefined;

  const displayApartments = hasActiveFilters ? searchResultApartments : apartments;
  const isLoading = isLoadingFlats || isLoadingHomes || isSearching;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Квартиры</h1>
              <p className="text-gray-600 mt-2">
                {isLoading ? 'Загрузка...' : `${displayApartments.length} квартир доступно`}
              </p>
            </div>
            <Link
              to="/"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              ← Вернуться на главную
            </Link>
          </div>
          
          {/* Search Bar */}
          <div className="max-w-4xl">
            <SearchBar />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Filter Summary */}
        {hasActiveFilters && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-blue-900">Активные фильтры:</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {filters.query && (
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                      Поиск: {filters.query}
                    </span>
                  )}
                  {filters.rooms && filters.rooms.length > 0 && (
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                      Комнат: {filters.rooms.join(', ')}
                    </span>
                  )}
                  {filters.minPrice && (
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                      От: {filters.minPrice.toLocaleString()} ₽
                    </span>
                  )}
                  {filters.maxPrice && (
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                      До: {filters.maxPrice.toLocaleString()} ₽
                    </span>
                  )}
                  {filters.finishing && filters.finishing.length > 0 && (
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                      Отделка: {filters.finishing.join(', ')}
                    </span>
                  )}
                  {filters.hasParks && (
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                      С парковкой
                    </span>
                  )}
                  {filters.hasSchools && (
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                      Рядом школы
                    </span>
                  )}
                  {filters.hasShops && (
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                      Рядом магазины
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => {
                  resetFilters();
                  window.history.replaceState({}, '', '/apartments');
                }}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Сбросить
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Загрузка квартир...</p>
          </div>
        )}

        {/* Apartments Grid */}
        {!isLoading && displayApartments.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayApartments.map((apartment) => (
              <ApartmentCard
                key={apartment.id}
                apartment={apartment}
                onBookingClick={() => handleBookingClick(apartment)}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && displayApartments.length === 0 && (
          <div className="text-center py-16">
            {hasActiveFilters ? (
              <>
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Квартиры не найдены
                </h3>
                <p className="text-gray-600 mb-8">
                  Попробуйте изменить параметры поиска или сбросить фильтры
                </p>
                <button
                  onClick={() => {
                    resetFilters();
                    window.history.replaceState({}, '', '/apartments');
                  }}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Сбросить фильтры
                </button>
              </>
            ) : (
              <>
                <div className="text-6xl mb-4">🏠</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Квартиры скоро появятся
                </h3>
                <p className="text-gray-600 mb-8">
                  Мы работаем над наполнением каталога недвижимости
                </p>
                <Link
                  to="/"
                  className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Вернуться на главную
                </Link>
              </>
            )}
          </div>
        )}

        {/* Load More Button */}
        {!isLoading && displayApartments.length > 0 && displayApartments.length >= 20 && (
          <div className="text-center mt-12">
            <button
              onClick={() => performSearch()}
              className="bg-gray-200 text-gray-900 px-8 py-3 rounded-lg hover:bg-gray-300 transition-colors"
              disabled={isSearching}
            >
              {isSearching ? 'Загрузка...' : 'Загрузить еще'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApartmentsPage;