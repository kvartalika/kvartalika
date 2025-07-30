import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import ApartmentCard from '../components/ApartmentCard';
import SearchBar from '../components/SearchBar';

const ApartmentsPage = () => {
  const { filteredApartments, setSelectedApartment, setShowBookingModal } = useAppStore();
  const [searchParams] = useSearchParams();
  
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Get initial filter from URL params
  useEffect(() => {
    // These URL params could be used to pre-filter results
    // For now, we'll just use the filteredApartments from the store
  }, [searchParams]);

  const handleBookingClick = (apartment: any) => {
    setSelectedApartment(apartment);
    setShowBookingModal(true);
  };

  const getPageTitle = () => {
    const hot = searchParams.get('hot');
    const rooms = searchParams.get('rooms');
    
    if (hot === 'true') {
      return '🔥 Горячие предложения';
    }
    if (rooms) {
      return `${rooms}-комнатные квартиры`;
    }
    return 'Все квартиры';
  };

  const getPageDescription = () => {
    const hot = searchParams.get('hot');
    const rooms = searchParams.get('rooms');
    
    if (hot === 'true') {
      return 'Лучшие квартиры по специальным ценам с ограниченным предложением';
    }
    if (rooms) {
      return `Подберите идеальную ${rooms}-комнатную квартиру из нашего каталога`;
    }
    return 'Большой выбор квартир в лучших жилых комплексах города';
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Page Header */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center text-white mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {getPageTitle()}
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              {getPageDescription()}
            </p>
          </div>
          
          {/* Search Bar */}
          <div className="max-w-4xl mx-auto">
            <SearchBar />
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Breadcrumbs */}
        <nav className="mb-8">
          <div className="flex items-center text-sm text-gray-600">
            <Link to="/" className="text-blue-600 hover:text-blue-700">
              Главная
            </Link>
            <span className="mx-2">›</span>
            <span className="text-gray-900">Квартиры</span>
          </div>
        </nav>

        {/* Results Info */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-gray-600">
              Найдено квартир: <span className="font-semibold text-gray-900">{filteredApartments.length}</span>
            </p>
          </div>
        </div>

        {/* Apartments Grid */}
        {filteredApartments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredApartments.map(apartment => (
              <ApartmentCard
                key={apartment.id}
                apartment={apartment}
                onBookingClick={() => handleBookingClick(apartment)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Квартиры не найдены
            </h3>
            <p className="text-gray-600 mb-6">
              Попробуйте изменить параметры поиска или{' '}
              <Link to="/apartments" className="text-blue-600 hover:text-blue-700 font-medium">
                посмотреть все квартиры
              </Link>
            </p>
          </div>
        )}

        {/* Additional Info Section */}
        <section className="mt-16 bg-gray-50 rounded-2xl p-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Не нашли подходящую квартиру?
            </h2>
            <p className="text-gray-600 mb-6">
              Наши специалисты помогут подобрать идеальный вариант под ваши требования и бюджет
            </p>
            <button
              onClick={() => setShowBookingModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
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