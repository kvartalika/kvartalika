import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import SearchBar from '../components/SearchBar';
import ApartmentCard from '../components/ApartmentCard';

const HomePage = () => {
  const { 
    filteredApartments, 
    searchFilters, 
    setSearchFilters, 
    setSelectedApartment, 
    setShowBookingModal 
  } = useAppStore();

  // Get apartments by category
  const hotDeals = filteredApartments.filter(apt => apt.isHot).slice(0, 5);
  const threeRoomApts = filteredApartments.filter(apt => apt.rooms === 3).slice(0, 5);
  const twoRoomApts = filteredApartments.filter(apt => apt.rooms === 2).slice(0, 5);
  const oneRoomApts = filteredApartments.filter(apt => apt.rooms === 1).slice(0, 5);

  const handleBookingClick = (apartment: any) => {
    setSelectedApartment(apartment);
    setShowBookingModal(true);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="7" cy="7" r="7"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
        </div>

        <div className="container mx-auto px-4 text-center text-white relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Найдите квартиру<br />
            <span className="text-blue-200">своей мечты</span>
          </h1>
          <p className="text-xl md:text-2xl mb-12 text-blue-100 max-w-3xl mx-auto">
            Современные жилые комплексы с лучшими условиями для комфортной жизни
          </p>

          {/* Search Bar */}
          <div className="max-w-4xl mx-auto">
            <SearchBar />
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-200 mb-2">50+</div>
              <div className="text-sm text-blue-100">Жилых комплексов</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-200 mb-2">1000+</div>
              <div className="text-sm text-blue-100">Квартир в продаже</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-200 mb-2">15</div>
              <div className="text-sm text-blue-100">Лет на рынке</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-200 mb-2">5000+</div>
              <div className="text-sm text-blue-100">Довольных клиентов</div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Hot Deals Section */}
      {hotDeals.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">🔥 Горячие предложения</h2>
                <p className="text-gray-600">Лучшие квартиры по специальным ценам</p>
              </div>
              <Link 
                to="/apartments?hot=true" 
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Смотреть все
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {hotDeals.map(apartment => (
                <ApartmentCard 
                  key={apartment.id} 
                  apartment={apartment}
                  onBookingClick={() => handleBookingClick(apartment)}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 3-Room Apartments */}
      {threeRoomApts.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">3-комнатные квартиры</h2>
                <p className="text-gray-600">Просторные квартиры для больших семей</p>
              </div>
              <Link 
                to="/apartments?rooms=3" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Смотреть все
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {threeRoomApts.map(apartment => (
                <ApartmentCard 
                  key={apartment.id} 
                  apartment={apartment}
                  onBookingClick={() => handleBookingClick(apartment)}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 2-Room Apartments */}
      {twoRoomApts.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">2-комнатные квартиры</h2>
                <p className="text-gray-600">Оптимальный выбор для молодых семей</p>
              </div>
              <Link 
                to="/apartments?rooms=2" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Смотреть все
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {twoRoomApts.map(apartment => (
                <ApartmentCard 
                  key={apartment.id} 
                  apartment={apartment}
                  onBookingClick={() => handleBookingClick(apartment)}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 1-Room Apartments */}
      {oneRoomApts.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">1-комнатные квартиры</h2>
                <p className="text-gray-600">Идеальное решение для молодых профессионалов</p>
              </div>
              <Link 
                to="/apartments?rooms=1" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Смотреть все
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {oneRoomApts.map(apartment => (
                <ApartmentCard 
                  key={apartment.id} 
                  apartment={apartment}
                  onBookingClick={() => handleBookingClick(apartment)}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* About Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Почему выбирают нас?
            </h2>
            <p className="text-lg text-gray-600 mb-12">
              Мы предлагаем только проверенные объекты недвижимости от надежных застройщиков
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Проверенные объекты</h3>
                <p className="text-gray-600">Все квартиры проходят тщательную проверку на юридическую чистоту</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Быстрый поиск</h3>
                <p className="text-gray-600">Удобные фильтры помогут найти идеальную квартиру за минуты</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Поддержка 24/7</h3>
                <p className="text-gray-600">Наши специалисты готовы помочь вам в любое время</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Готовы найти свою идеальную квартиру?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Оставьте заявку и наш менеджер подберет лучшие варианты специально для вас
          </p>
          <button
            onClick={() => setShowBookingModal(true)}
            className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
          >
            Получить консультацию
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;