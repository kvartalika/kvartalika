import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import ApartmentCard from '../components/ApartmentCard';

const ComplexPage = () => {
  const { complexName } = useParams<{ complexName: string }>();
  const { 
    complexes, 
    setSelectedApartment, 
    setShowBookingModal,
    setSelectedComplex 
  } = useAppStore();
  
  const [activeTab, setActiveTab] = useState<'apartments' | 'about' | 'location'>('apartments');
  
  // Find the complex by name
  const complex = complexes.find(c => c.name === decodeURIComponent(complexName || ''));
  
  useEffect(() => {
    if (complex) {
      setSelectedComplex(complex);
    }
  }, [complex, setSelectedComplex]);

  if (!complex) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Жилой комплекс не найден
          </h1>
          <Link
            to="/"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Вернуться на главную
          </Link>
        </div>
      </div>
    );
  }

  const handleBookingClick = (apartment?: any) => {
    if (apartment) {
      setSelectedApartment(apartment);
    }
    setShowBookingModal(true);
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative h-96 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="absolute inset-0">
          <img
            src={complex.image || '/images/complex-placeholder.jpg'}
            alt={complex.name}
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
          <div className="text-white">
            {/* Breadcrumbs */}
            <nav className="mb-4">
              <Link to="/" className="text-blue-200 hover:text-white">
                Главная
              </Link>
              <span className="mx-2 text-blue-200">›</span>
              <span className="text-white">{complex.name}</span>
            </nav>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {complex.name}
            </h1>
            <p className="text-xl text-blue-100 mb-6 max-w-2xl">
              {complex.description}
            </p>
            <p className="text-lg text-blue-200 mb-8">
              📍 {complex.address}
            </p>
            
            <button
              onClick={() => handleBookingClick()}
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Записаться на осмотр
            </button>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('apartments')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'apartments'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Квартиры ({complex.apartments.length})
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'about'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              О комплексе
            </button>
            <button
              onClick={() => setActiveTab('location')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'location'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Расположение
            </button>
          </nav>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Apartments Tab */}
          {activeTab === 'apartments' && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900">
                  Доступные квартиры
                </h2>
                <div className="text-sm text-gray-600">
                  Найдено: {complex.apartments.length} квартир
                </div>
              </div>
              
              {complex.apartments.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {complex.apartments.map(apartment => (
                    <ApartmentCard
                      key={apartment.id}
                      apartment={apartment}
                      onBookingClick={() => handleBookingClick(apartment)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Квартиры временно недоступны
                  </h3>
                  <p className="text-gray-600 mb-6">
                    В данный момент в этом комплексе нет доступных квартир. 
                    Оставьте заявку, и мы уведомим вас о новых предложениях.
                  </p>
                  <button
                    onClick={() => handleBookingClick()}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Оставить заявку
                  </button>
                </div>
              )}
            </div>
          )}

          {/* About Tab */}
          {activeTab === 'about' && (
            <div className="max-w-4xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">
                О жилом комплексе
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Описание
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {complex.description}
                  </p>
                  
                  {complex.amenities && complex.amenities.length > 0 && (
                    <>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Удобства и инфраструктура
                      </h3>
                      <ul className="space-y-2">
                        {complex.amenities.map((amenity, index) => (
                          <li key={index} className="flex items-center text-gray-600">
                            <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            {amenity}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Ключевые характеристики
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-gray-600">Всего квартир:</span>
                      <span className="font-medium">{complex.apartments.length}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-gray-600">Тип квартир:</span>
                      <span className="font-medium">
                        {Array.from(new Set(complex.apartments.map(apt => `${apt.rooms}-комн.`))).join(', ')}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-gray-600">Отделка:</span>
                      <span className="font-medium">
                        {Array.from(new Set(complex.apartments.map(apt => apt.finishing))).join(', ')}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-gray-600">Адрес:</span>
                      <span className="font-medium">{complex.address}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Gallery */}
              {complex.images && complex.images.length > 0 && (
                <div className="mt-12">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">
                    Фотогалерея
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {complex.images.map((image, index) => (
                      <div key={index} className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
                        <img
                          src={image}
                          alt={`${complex.name} - фото ${index + 1}`}
                          className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Location Tab */}
          {activeTab === 'location' && (
            <div className="max-w-4xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">
                Расположение и транспорт
              </h2>
              
              <div className="bg-gray-100 rounded-xl p-8 text-center mb-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Интерактивная карта
                </h3>
                <p className="text-gray-600 mb-4">
                  Здесь будет отображена карта с расположением жилого комплекса
                </p>
                <p className="text-sm text-gray-500">
                  📍 {complex.address}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Транспортная доступность
                  </h3>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                      </svg>
                      Метро "Примерная" - 5 мин пешком
                    </li>
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Автобусная остановка - 2 мин пешком
                    </li>
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-purple-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                      До центра города - 15 мин на транспорте
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Инфраструктура района
                  </h3>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      Школы и детские сады поблизости
                    </li>
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      Торговые центры и магазины
                    </li>
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      Медицинские учреждения
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Заинтересовались {complex.name}?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Запишитесь на персональную экскурсию по жилому комплексу
          </p>
          <button
            onClick={() => handleBookingClick()}
            className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors"
          >
            Записаться на осмотр
          </button>
        </div>
      </section>
    </div>
  );
};

export default ComplexPage;