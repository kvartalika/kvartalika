import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';

const ApartmentPage = () => {
  const { apartmentId } = useParams<{ apartmentId: string }>();
  const { 
    apartments, 
    setSelectedApartment, 
    setShowBookingModal,
    selectedApartment 
  } = useAppStore();
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Find the apartment by ID
  const apartment = apartments.find(apt => apt.id === Number(apartmentId));
  
  useEffect(() => {
    if (apartment) {
      setSelectedApartment(apartment);
    }
  }, [apartment, setSelectedApartment]);

  if (!apartment) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Квартира не найдена
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

  const handleBookingClick = () => {
    setShowBookingModal(true);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price);
  };

  const pricePerSqm = Math.round(apartment.price / apartment.area);

  // Mock images for gallery (in real app would come from apartment.images)
  const images = apartment.images || [
    apartment.image || '/images/apartment-placeholder.jpg',
    '/images/apartment-2.jpg',
    '/images/apartment-3.jpg',
    '/images/apartment-4.jpg'
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Breadcrumbs */}
      <section className="bg-gray-50 py-4">
        <div className="container mx-auto px-4">
          <nav className="text-sm">
            <Link to="/" className="text-blue-600 hover:text-blue-700">
              Главная
            </Link>
            <span className="mx-2 text-gray-400">›</span>
            <Link 
              to={`/complex/${encodeURIComponent(apartment.complex)}`}
              className="text-blue-600 hover:text-blue-700"
            >
              {apartment.complex}
            </Link>
            <span className="mx-2 text-gray-400">›</span>
            <span className="text-gray-600">
              {apartment.rooms}-комнатная квартира
            </span>
          </nav>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Details */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="mb-8">
              <div className="relative h-96 rounded-xl overflow-hidden bg-gray-200">
                <img
                  src={images[currentImageIndex]}
                  alt={`${apartment.rooms}-комнатная квартира`}
                  className="w-full h-full object-cover"
                />
                
                {/* Hot Deal Badge */}
                {apartment.isHot && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-2 rounded-lg font-semibold">
                    🔥 Горячее предложение
                  </div>
                )}

                {/* Navigation Arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                )}

                {/* Image Counter */}
                <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-lg text-sm">
                  {currentImageIndex + 1} / {images.length}
                </div>
              </div>

              {/* Thumbnail Gallery */}
              {images.length > 1 && (
                <div className="flex space-x-2 mt-4 overflow-x-auto">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        index === currentImageIndex
                          ? 'border-blue-500'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`Фото ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Apartment Details */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Характеристики квартиры
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between py-3 border-b border-gray-200">
                    <span className="text-gray-600">Комнат:</span>
                    <span className="font-medium">{apartment.rooms}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-gray-200">
                    <span className="text-gray-600">Площадь:</span>
                    <span className="font-medium">{apartment.area} м²</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-gray-200">
                    <span className="text-gray-600">Этаж:</span>
                    <span className="font-medium">{apartment.floor}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-gray-200">
                    <span className="text-gray-600">Санузел:</span>
                    <span className="font-medium">{apartment.bathroom}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between py-3 border-b border-gray-200">
                    <span className="text-gray-600">Отделка:</span>
                    <span className="font-medium">{apartment.finishing}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-gray-200">
                    <span className="text-gray-600">Цена за м²:</span>
                    <span className="font-medium">{formatPrice(pricePerSqm)} ₽/м²</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-gray-200">
                    <span className="text-gray-600">Жилой комплекс:</span>
                    <Link
                      to={`/complex/${encodeURIComponent(apartment.complex)}`}
                      className="font-medium text-blue-600 hover:text-blue-700"
                    >
                      {apartment.complex}
                    </Link>
                  </div>
                  <div className="flex justify-between py-3 border-b border-gray-200">
                    <span className="text-gray-600">Адрес:</span>
                    <span className="font-medium">{apartment.address}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              {apartment.description && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Описание
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {apartment.description}
                  </p>
                </div>
              )}

              {/* Features */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Особенности квартиры
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Панорамные окна
                  </div>
                  <div className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Высокие потолки
                  </div>
                  <div className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Балкон/лоджия
                  </div>
                  <div className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Индивидуальное отопление
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Price and Booking */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              {/* Price Card */}
              <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {formatPrice(apartment.price)} ₽
                  </div>
                  <div className="text-sm text-gray-600">
                    {formatPrice(pricePerSqm)} ₽ за м²
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Площадь:</span>
                    <span className="font-medium">{apartment.area} м²</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Комнат:</span>
                    <span className="font-medium">{apartment.rooms}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Этаж:</span>
                    <span className="font-medium">{apartment.floor}</span>
                  </div>
                </div>

                <button
                  onClick={handleBookingClick}
                  className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors mb-4"
                >
                  Записаться на осмотр
                </button>

                <div className="text-center">
                  <a
                    href="tel:+74951234567"
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    📞 +7 (495) 123-45-67
                  </a>
                </div>
              </div>

              {/* Mortgage Calculator */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Ипотечный калькулятор
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Первоначальный взнос
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="range"
                        min="10"
                        max="50"
                        defaultValue="20"
                        className="flex-1"
                      />
                      <span className="text-sm font-medium w-12">20%</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Срок кредита
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm">
                      <option>10 лет</option>
                      <option>15 лет</option>
                      <option>20 лет</option>
                      <option>25 лет</option>
                      <option>30 лет</option>
                    </select>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Ежемесячный платеж:</span>
                      <span className="font-semibold text-lg">
                        {formatPrice(Math.round(apartment.price * 0.8 * 0.008))} ₽
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Расчет приблизительный, ставка 8% годовых
                    </div>
                  </div>

                  <button className="w-full bg-gray-100 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                    Подробный расчет
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Apartments */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Похожие квартиры в {apartment.complex}
          </h2>
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Похожие квартиры
            </h3>
            <p className="text-gray-600 mb-6">
              Посмотрите другие варианты в этом жилом комплексе
            </p>
            <Link
              to={`/complex/${encodeURIComponent(apartment.complex)}`}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Смотреть все квартиры в {apartment.complex}
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ApartmentPage;