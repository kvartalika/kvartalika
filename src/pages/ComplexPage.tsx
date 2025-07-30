import {useEffect, useState} from 'react';
import {useParams, Link} from 'react-router-dom';
import {useAppStore} from '../store/useAppStore';
import ApartmentCard from '../components/ApartmentCard';
import { motion, AnimatePresence } from 'framer-motion';
import type { Apartment } from '../store/useAppStore';

const ComplexPage = () => {
  const {complexName} = useParams<{ complexName: string }>();
  const {
    complexes,
    setSelectedApartment,
    setShowBookingModal,
    setSelectedComplex
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<'apartments' | 'about' | 'location'>('apartments');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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

  const handleBookingClick = (apartment?: Apartment) => {
    if (apartment) {
      setSelectedApartment(apartment);
    }
    setShowBookingModal(true);
  };

  const images = complex?.images || [complex?.image || '/images/test.png'];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  useEffect(() => {
    if (images.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex(prev => (prev + 1) % images.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [images]);

  return (
    <div className="min-h-screen pt-20">
      {/* Breadcrumbs */}
      <section className="bg-gray-50 py-4">
        <div className="container mx-auto px-4">
          <nav className="text-sm">
            <Link
              to="/"
              className="text-blue-600 hover:text-blue-700"
            >
              Главная
            </Link>
            <span className="mx-2 text-gray-400">›</span>
            <span className="text-gray-600">{complex.name}</span>
          </nav>
        </div>
      </section>

      {/* Photo Slider */}
      <section className="relative h-96 md:h-[500px]">
        <div className="relative h-full overflow-hidden bg-gray-200">
          <AnimatePresence initial={false} custom={currentImageIndex}>
            <motion.img
              key={currentImageIndex}
              src={images[currentImageIndex]}
              alt={`${complex.name} - фото ${currentImageIndex + 1}`}
              className="w-full h-full object-cover absolute inset-0"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/images/test.png';
              }}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              style={{ position: 'absolute' }}
            />
          </AnimatePresence>

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all z-20"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all z-20"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </>
          )}

          {/* Image Counter */}
          <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-lg text-sm z-20">
            {currentImageIndex + 1} / {images.length}
          </div>

          {/* Overlay Info */}
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/60">
            <div className="text-center text-white max-w-4xl px-4">
              <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
                {complex.name}
              </h1>
              <p className="text-xl md:text-2xl mb-6 text-gray-100 drop-shadow-md">
                {complex.description}
              </p>
              <p className="text-lg mb-8 text-gray-200 drop-shadow-md">
                📍 {complex.address}
              </p>
              <button
                onClick={() => handleBookingClick()}
                className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors shadow-lg"
              >
                Записаться на осмотр
              </button>
            </div>
          </div>
        </div>

        {/* Thumbnail Gallery */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-3 h-3 rounded-full transition-all shadow-lg ${
                  index === currentImageIndex
                    ? 'bg-white'
                    : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                }`}
              />
            ))}
          </div>
        )}
      </section>

      {/* Apartments Preview */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Доступные квартиры</h2>
            {complex.apartments.length > 4 && (
              <Link
                to={`/apartments?complex=${encodeURIComponent(complex.name)}`}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Показать все квартиры
              </Link>
            )}
          </div>
          {complex.apartments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {complex.apartments.slice(0, 4).map(apartment => (
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
              <h3 className="text-lg font-medium text-gray-900 mb-2">Квартиры временно недоступны</h3>
              <p className="text-gray-600 mb-6">В данный момент в этом комплексе нет доступных квартир. Оставьте заявку, и мы уведомим вас о новых предложениях.</p>
              <button
                onClick={() => handleBookingClick()}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Оставить заявку
              </button>
            </div>
          )}
        </div>
      </section>

      {/* About/Description, Features, History, Amenities, etc. */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">О жилом комплексе</h2>
            {/* Description */}
            <div className="text-center mb-16">
              <p className="text-lg text-gray-600 leading-relaxed max-w-4xl mx-auto">{complex.description}</p>
            </div>
            {/* Features of LCD */}
            {complex.features && complex.features.length > 0 && (
              <div className="mb-16">
                <h3 className="text-2xl font-semibold text-gray-900 mb-8 text-center">Особенности ЖК</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {complex.features.map((feature, index) => (
                    <div key={index} className="bg-white rounded-xl p-6 shadow-lg text-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="text-gray-700 font-medium">{feature}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Construction History */}
            {complex.constructionHistory && (
              <div className="mb-16">
                <h3 className="text-2xl font-semibold text-gray-900 mb-8 text-center">История строительства</h3>
                <div className="bg-white rounded-xl p-8 shadow-lg">
                  <div className="text-center mb-8">
                    <p className="text-gray-600">Строительство: {new Date(complex.constructionHistory.startDate).toLocaleDateString('ru-RU')} - {new Date(complex.constructionHistory.endDate).toLocaleDateString('ru-RU')}</p>
                  </div>
                  <div className="space-y-6">
                    {complex.constructionHistory.phases.map((phase, index) => (
                      <div key={index} className="flex items-start">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-4">{index + 1}</div>
                        <div className="flex-grow">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-gray-900">{phase.name}</h4>
                            <span className="text-sm text-gray-500">{new Date(phase.date).toLocaleDateString('ru-RU')}</span>
                          </div>
                          <p className="text-gray-600">{phase.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {/* Amenities and Key Characteristics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {complex.amenities && complex.amenities.length > 0 && (
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Удобства и инфраструктура</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 justify-items-center">
                    {complex.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center text-gray-600">
                        <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {amenity}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Ключевые характеристики</h3>
                <div className="space-y-4">
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Всего квартир:</span>
                    <span className="font-medium">{complex.apartments.length}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Тип квартир:</span>
                    <span className="font-medium">{Array.from(new Set(complex.apartments.map(apt => `${apt.rooms}-комн.`))).join(', ')}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Отделка:</span>
                    <span className="font-medium">{Array.from(new Set(complex.apartments.map(apt => apt.finishing))).join(', ')}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Адрес:</span>
                    <span className="font-medium">{complex.address}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Расположение и транспорт</h2>
            <div className="bg-gray-100 rounded-xl p-8 text-center mb-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Интерактивная карта</h3>
              <p className="text-gray-600 mb-4">Здесь будет отображена карта с расположением жилого комплекса</p>
              <p className="text-sm text-gray-500">📍 {complex.address}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Транспортная доступность</h3>
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
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Инфраструктура района</h3>
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
                    <svg className="w-5 h-5 text-yellow-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 0V4m0 8v8" />
                    </svg>
                    Парки и зоны отдыха
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Заинтересовались ЖК?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Запишитесь на персональную экскурсию по жилому комплексу {complex.name}
          </p>
          <button
            onClick={() => handleBookingClick()}
            className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
          >
            Записаться на осмотр
          </button>
        </div>
      </section>
    </div>
  );
};

export default ComplexPage;