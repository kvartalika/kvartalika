import {useEffect, useState} from 'react';
import {Link, useParams} from 'react-router-dom';
import ContentManager from '../components/ContentManager';
import {useAuthStore, useFlatsStore, useUIStore} from "../store";

const ApartmentPage = () => {
  const {apartmentId} = useParams<{ apartmentId: string }>();

  const openModal = useUIStore(state => state.openModal);
  const modals = useUIStore(state => state.modals);
  const closeModal = useUIStore(state => state.closeModal);

  const {
    setSelectedFlat,
    getFlatById,
    selectedFlat,
    homes,
    setSelectedHome,
    selectedHome
  } = useFlatsStore();

  const role = useAuthStore(state => state.role);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const load = async () => {
      if (!apartmentId) return;
      const id = Number(apartmentId);
      if (Number.isNaN(id)) {
        console.warn('Invalid apartmentId:', apartmentId);
        return;
      }
      const flat = await getFlatById(id);
      if (flat) {
        setSelectedFlat(flat);
        setSelectedHome(homes.find(home => flat.flat.homeId === home.id) ?? null)
      } else {
        setSelectedFlat(null);
      }
    };
    void load()
  }, [apartmentId, getFlatById, setSelectedFlat]);

  if (!selectedFlat?.flat) {
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price);
  };

  const pricePerSqm = Math.round(selectedFlat.flat.price / selectedFlat.flat.area);

  const images = selectedFlat.flat?.images || [
    '/images/apartment-2.jpg',
    '/images/apartment-3.jpg',
    '/images/apartment-4.jpg'
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images?.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images?.length) % images?.length);
  };

  return (
    <div className="min-h-screen pt-20">
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
            <Link
              to={`/complex/${selectedFlat.flat.homeId}`}
              className="text-blue-600 hover:text-blue-700"
            >
              {selectedHome?.name ?? selectedFlat.flat.homeId}
            </Link>
            <span className="mx-2 text-gray-400">›</span>
            <span className="text-gray-600">
              {selectedFlat.flat?.numberOfRooms}-комнатная квартира
            </span>
          </nav>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="mb-8">
              <div className="relative h-96 rounded-xl overflow-hidden bg-gray-200">
                <img
                  src={images[currentImageIndex]}
                  alt={`${selectedFlat.flat?.numberOfRooms}-комнатная квартира`}
                  className="w-full h-full object-cover"
                />

                {selectedFlat.flat?.features.length >= 3 && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-2 rounded-lg font-semibold">
                    🔥 Горячее предложение
                  </div>
                )}

                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
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
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
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

                <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-lg text-sm">
                  {currentImageIndex + 1} / {images?.length}
                </div>
              </div>

              {images?.length > 1 && (
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

            {selectedFlat.flat.layout && (
              <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Планировка квартиры
                </h2>
                <div className="flex justify-center">
                  <img
                    src={selectedFlat.flat.layout}
                    alt="Планировка квартиры"
                    className="max-w-full h-auto rounded-lg border border-gray-200"
                  />
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Характеристики квартиры
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between py-3 border-b border-gray-200">
                    <span className="text-gray-600">Комнат:</span>
                    <span className="font-medium">{selectedFlat.flat?.numberOfRooms}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-gray-200">
                    <span className="text-gray-600">Площадь:</span>
                    <span className="font-medium">{selectedFlat.flat?.area} м²</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-gray-200">
                    <span className="text-gray-600">Этаж:</span>
                    <span className="font-medium">{selectedFlat.flat?.floor}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-gray-200">
                    <span className="text-gray-600">Количество санузлов:</span>
                    <span className="font-medium">{selectedFlat.flat?.numberOfBathrooms}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between py-3 border-b border-gray-200">
                    <span className="text-gray-600">Отделка:</span>
                    <span className="font-medium">{selectedFlat.flat.hasDecoration}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-gray-200">
                    <span className="text-gray-600">Цена за м²:</span>
                    <span className="font-medium">{formatPrice(pricePerSqm)} ₽/м²</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-gray-200">
                    <span className="text-gray-600">Жилой комплекс:</span>
                    <Link
                      to={`/complex/${selectedFlat.flat.homeId}`}
                      className="font-medium text-blue-600 hover:text-blue-700"
                    >
                      {selectedHome?.name ?? selectedFlat.flat.homeId}
                    </Link>
                  </div>
                  <div className="flex justify-between py-3 border-b border-gray-200">
                    <span className="text-gray-600">Адрес:</span>
                    <span className="font-medium">{selectedFlat.flat.address}</span>
                  </div>
                </div>
              </div>

              {selectedFlat.flat.description && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Описание
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {selectedFlat.flat.description}
                  </p>
                </div>
              )}

              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Особенности квартиры
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedFlat.flat?.features.map((feature) => (
                    <div className="flex items-center text-gray-600">
                      <svg
                        className="w-5 h-5 text-green-500 mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Расположение и транспорт</h3>
              <div className="bg-gray-100 rounded-xl p-8 text-center mb-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Интерактивная карта</h4>
                <p className="text-gray-600 mb-4">Здесь будет отображена карта с расположением квартиры</p>
                <p className="text-sm text-gray-500">📍 {selectedFlat.flat.address}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Транспортная доступность</h4>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-center">
                      <svg
                        className="w-5 h-5 text-blue-600 mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                        />
                      </svg>
                      Метро "Примерная" - 5 мин пешком
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="w-5 h-5 text-green-600 mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Автобусная остановка - 2 мин пешком
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="w-5 h-5 text-purple-600 mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                        />
                      </svg>
                      До центра города - 15 мин на транспорте
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Инфраструктура района</h4>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-center">
                      <svg
                        className="w-5 h-5 text-red-600 mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                      </svg>
                      Школы и детские сады поблизости
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="w-5 h-5 text-green-600 mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                        />
                      </svg>
                      Торговые центры и магазины
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="w-5 h-5 text-yellow-600 mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 0V4m0 8v8"
                        />
                      </svg>
                      Парки и зоны отдыха
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {formatPrice(selectedFlat.flat.price)} ₽
                  </div>
                  <div className="text-sm text-gray-600">
                    {formatPrice(pricePerSqm)} ₽ за м²
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Площадь:</span>
                    <span className="font-medium">{selectedFlat.flat.area} м²</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Комнат:</span>
                    <span className="font-medium">{selectedFlat.flat.numberOfRooms}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Этаж:</span>
                    <span className="font-medium">{selectedFlat.flat.floor}</span>
                  </div>
                </div>

                <button
                  onClick={() => openModal('bid')}
                  className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors mb-4"
                >
                  Записаться на осмотр
                </button>

                {isAuthenticated && role === 'CONTENT_MANAGER' && (
                  <button
                    onClick={() => openModal('manager')}
                    className="w-full bg-gray-600 text-white py-3 rounded-lg font-semibold text-base hover:bg-gray-700 transition-colors"
                  >
                    ✏️ Редактировать контент
                  </button>
                )}


              </div>


            </div>
          </div>
        </div>


      </div>

      {modals.manager && (
        <ContentManager
          contentType="apartment"
          contentId={selectedFlat.flat.id}
          initialData={selectedFlat.flat}
          onSave={() => {
            closeModal('manager')
            window.location.reload();
          }}
          onCancel={() => closeModal('manager')}
        />
      )}
    </div>
  );
};

export default ApartmentPage;