import {useEffect, useState} from 'react';
import {Link, useParams} from 'react-router-dom';
import ApartmentCard from '../components/ApartmentCard';

import {useFlatsStore, useUIStore} from "../store";
import {safeImage} from "../utils/safeImage.ts";
import Map from '../components/Map.tsx';

const ComplexPage = () => {
  const {homeId} = useParams<{ homeId: string }>();

  const {
    flatsByHome,
    setSelectedHome,
    getHomeById,
    loadFlatsByHome,
    selectedHome
  } = useFlatsStore();

  const openModal = useUIStore(state => state.openModal);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);


  useEffect(() => {
    const load = async () => {
      if (!homeId) return;
      const id = Number(homeId);
      if (Number.isNaN(id)) {
        console.warn('Invalid homeId:', homeId);
        return;
      }
      const home = await getHomeById(id);
      if (home) {
        setSelectedHome(home);
      } else {
        setSelectedHome(null);
      }
    };
    void load()
  }, [getHomeById, homeId, setSelectedHome]);

  useEffect(() => {
    const id = selectedHome?.id;
    if (!id) return;
    const loadData = async () => {
      try {
        await loadFlatsByHome(id);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, [loadFlatsByHome, selectedHome]);

  if (!selectedHome) {
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

  let images = safeImage(selectedHome.imagesResolved, 'home');
  images = Array.isArray(images) ? images : [images];

  let historyImages = safeImage(selectedHome.historyImagesResolved, 'history');
  historyImages = Array.isArray(historyImages) ? historyImages : [historyImages];

  let yardsImages = safeImage(selectedHome.yardsImagesResolved, 'history');
  yardsImages = Array.isArray(yardsImages) ? yardsImages : [yardsImages];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
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
            <span className="text-gray-600">{selectedHome.name}</span>
          </nav>
        </div>
      </section>

      <section className="relative h-96 md:h-[500px]">
        <div className="relative h-full overflow-hidden bg-gray-200">

          <img
            key={currentImageIndex}
            src={images[currentImageIndex]}
            alt={`${selectedHome.name} - фото ${currentImageIndex + 1}`}
            className="w-full h-full object-cover absolute inset-0"
            style={{position: 'absolute'}}
          />


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

          <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-lg text-sm z-20">
            {currentImageIndex + 1} / {images.length}
          </div>

          <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/60">
            <div className="text-center text-white max-w-4xl px-4">
              <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
                {selectedHome.name ?? "Неизвестное ЖК"}
              </h1>
              <p className="text-xl md:text-2xl mb-6 text-gray-100 drop-shadow-md">
                {selectedHome.description ?? "Пока здесь ничего нет..."}
              </p>
              <p className="text-lg mb-8 text-gray-200 drop-shadow-md">
                📍 {selectedHome.address ?? "Требуется уточнение"}
              </p>
              <button
                onClick={() => openModal('bid')}
                className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors shadow-lg"
              >
                Записаться на осмотр
              </button>
            </div>
          </div>
        </div>

        {Array.isArray(images) && images.length > 1 && (
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

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Доступные квартиры</h2>
            {flatsByHome.length > 4 && (
              <Link
                to={`/apartments?homeId=${selectedHome.id}`}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Показать все квартиры
              </Link>
            )}
          </div>
          {flatsByHome.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {flatsByHome.slice(0, 4).map(apartment => (
                <ApartmentCard
                  key={apartment.flat.id}
                  homeName={selectedHome.name ?? `ЖК №${apartment.flat.homeId}`}
                  apartment={apartment}
                  onBookingClick={() => openModal('bid')}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Квартиры временно недоступны</h3>
              <p className="text-gray-600 mb-6">В данный момент в этом комплексе нет доступных квартир. Оставьте заявку, и мы уведомим вас о новых предложениях.</p>
              <button
                onClick={() => openModal('bid')}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Оставить заявку
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">О жилом комплексе</h2>
            <div className="text-center mb-16">
              <p className="text-lg text-gray-600 leading-relaxed max-w-4xl mx-auto">{selectedHome.description}</p>
            </div>
            {selectedHome.features && selectedHome.features.length > 0 && (
              <div className="mb-16">
                <h3 className="text-2xl font-semibold text-gray-900 mb-8 text-center">Особенности ЖК</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {selectedHome.features.map((feature, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-xl p-6 shadow-lg text-center"
                    >
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg
                          className="w-6 h-6 text-blue-600"
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
                      </div>
                      <p className="text-gray-700 font-medium">{feature}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {selectedHome.history && (
              <div className="mb-16">
                <h3 className="text-2xl font-semibold text-gray-900 mb-8 text-center">История строительства</h3>
                <div className="bg-white rounded-xl p-8 shadow-lg">
                  <div className="text-center mb-8">
                    <p className="text-gray-600">Год постройки: {selectedHome.yearBuilt}</p>
                  </div>
                  <div className="space-y-6">
                    {selectedHome.history.map((phase, index) => (
                      <div
                        key={index}
                        className="flex items-start"
                      >
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-4">{index + 1}</div>
                        <div className="flex-grow">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-gray-900">{phase}</h4>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {selectedHome.features && selectedHome.features.length > 0 && (
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Удобства и инфраструктура</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 justify-items-center">
                    {selectedHome.features.map((amenity, index) => (
                      <div
                        key={index}
                        className="flex items-center text-gray-600"
                      >
                        <svg
                          className="w-5 h-5 text-green-500 mr-3 flex-shrink-0"
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
                    <span className="font-medium">{flatsByHome.length ?? "Неизвестно"}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Тип квартир:</span>
                    <span className="font-medium">{Array.from(new Set(flatsByHome.map(apt => `${apt.flat.numberOfRooms}-комн.`))).join(', ')}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Адрес:</span>
                    <span className="font-medium">{selectedHome.address ?? "Требуется уточнить"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Расположение ЖК</h2>
            {selectedHome.latitude && selectedHome.longitude && selectedHome.name &&
              <div className="bg-gray-100 rounded-xl p-8 text-center mb-8">
                  <Map 
                    latitude={selectedHome.latitude}
                    longitude={selectedHome.longitude}
                    description={selectedHome.name}
                  />
              </div>
              }
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Инфраструктура района</h3>
                <ul className="space-y-3 text-gray-600">
                  {selectedHome.schoolsNearby &&
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
                    </li>}
                  {selectedHome.storesNearby &&
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
                    </li>}
                  {selectedHome.hospitalsNearby &&
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
                      Медицинские учреждения
                    </li>}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-blue-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Заинтересовались ЖК?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Запишитесь на персональную экскурсию по жилому комплексу {selectedHome.name}
          </p>
          <button
            onClick={() => openModal('bid')}
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