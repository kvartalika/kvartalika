import {useEffect, useMemo, useState} from 'react';
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
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(0);

  const [aptSlideIndex, setAptSlideIndex] = useState(0);
  const APARTMENTS_PER_PAGE = 3;

  const [yardSlideIndex, setYardSlideIndex] = useState(0);
  const YARDS_PER_PAGE = 3;

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
    void loadFlatsByHome(id);
  }, [loadFlatsByHome, selectedHome]);

  const flatTypes = useMemo(() => {
    return Array.from(new Set(flatsByHome.map(apt => `${apt.flat.numberOfRooms}-комн.`))).join(', ');
  }, [flatsByHome]);

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
          />

          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                aria-label="Предыдущее фото"
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
                aria-label="Следующее фото"
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
          <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center mb-6 gap-2">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Доступные квартиры</h2>
              <div className="text-sm text-gray-600 mt-1">
                {flatsByHome.length > 0
                  ? `${flatsByHome.length} ${flatsByHome.length === 1 ? 'квартира' : 'квартиры'} · ${flatTypes}`
                  : 'Пока нет доступных квартир'}
              </div>
            </div>
            {flatsByHome.length > APARTMENTS_PER_PAGE && (
              <div className="flex gap-2 mt-2 md:mt-0">
                <button
                  aria-label="Предыдущие квартиры"
                  onClick={() => setAptSlideIndex(i => Math.max(0, i - 1))}
                  disabled={aptSlideIndex === 0}
                  className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 disabled:opacity-40"
                >
                  ‹
                </button>
                <button
                  aria-label="Следующие квартиры"
                  onClick={() =>
                    setAptSlideIndex(i =>
                      Math.min(
                        Math.ceil(Math.min(6, flatsByHome.length) / APARTMENTS_PER_PAGE) - 1,
                        i + 1
                      )
                    )
                  }
                  disabled={
                    aptSlideIndex >=
                    Math.ceil(Math.min(6, flatsByHome.length) / APARTMENTS_PER_PAGE) - 1
                  }
                  className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 disabled:opacity-40"
                >
                  ›
                </button>
              </div>
            )}
          </div>

          {flatsByHome.length > 0 ? (
            <div className="relative">
              <div className="overflow-hidden">
                <div
                  className="flex gap-6 transition-transform"
                  style={{
                    transform: `translateX(-${aptSlideIndex * 100}%)`,
                    width: `${Math.ceil(Math.min(6, flatsByHome.length) / APARTMENTS_PER_PAGE) * 100}%`,
                  }}
                >
                  {flatsByHome.slice(0, 6).map((apartment) => (
                    <div
                      key={apartment.flat.id}
                      className="flex-shrink-0"
                      style={{width: `${100 / Math.ceil(Math.min(6, flatsByHome.length) / APARTMENTS_PER_PAGE) / APARTMENTS_PER_PAGE * 100}%`}}
                    >
                      <ApartmentCard
                        homeName={selectedHome.name ?? `ЖК №${apartment.flat.homeId}`}
                        apartment={apartment}
                        onBookingClick={() => openModal('bid')}
                      />
                    </div>
                  ))}
                </div>
              </div>
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
              <p className="text-gray-600 mb-6">
                В данный момент в этом комплексе нет доступных квартир. Оставьте заявку, и мы уведомим вас о новых предложениях.
              </p>
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
          <div className="mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">О жилом комплексе</h2>
            <div className="text-center mb-16">
              <p className="text-lg text-gray-600 leading-relaxed max-w-4xl mx-auto">{selectedHome.about}</p>
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
                <div className="bg-white rounded-xl p-8 shadow-lg flex flex-col lg:flex-row gap-8">
                  <div className="lg:w-[60%] space-y-6">
                    <div className="text-center mb-4">
                      <p className="text-gray-600">Год постройки: {selectedHome.yearBuilt ?? "-"}</p>
                    </div>
                    {selectedHome.history.map((phase, index) => (
                      <div
                        key={`${phase}-${index}`}
                        className="flex items-start"
                      >
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-4">
                          {index + 1}
                        </div>
                        <div className="flex-grow">
                          <h4 className="font-semibold text-gray-900 mb-1">{phase}</h4>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="lg:w-[40%] flex flex-col items-center justify-center">
                    {historyImages.length > 0 ? (
                      <div className="relative rounded overflow-hidden">
                        <img
                          src={historyImages[currentHistoryIndex]}
                          alt={`История ${currentHistoryIndex + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {historyImages.length > 1 && (
                          <>
                            <button
                              onClick={() => setCurrentHistoryIndex(prev => (prev - 1 + historyImages.length) % historyImages.length)}
                              aria-label="Предыдущее фото истории"
                              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                            >
                              ‹
                            </button>
                            <button
                              onClick={() => setCurrentHistoryIndex(prev => (prev + 1) % historyImages.length)}
                              aria-label="Следующее фото истории"
                              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                            >
                              ›
                            </button>
                            <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-xs">
                              {currentHistoryIndex + 1} / {historyImages.length}
                            </div>
                          </>
                        )}
                      </div>
                    ) : (
                      <div className="flex-1 rounded overflow-hidden border bg-gray-100 flex items-center justify-center">
                        <span className="text-gray-500">Фотографии отсутствуют</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {selectedHome.latitude !== undefined && selectedHome.longitude !== undefined && selectedHome.name &&
              <>
                <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">Расположение ЖК</h2>
                <div className="bg-gray-100 rounded-xl p-8 text-center mb-8">
                  <Map
                    latitude={selectedHome.latitude}
                    longitude={selectedHome.longitude}
                    description={selectedHome.name}
                  />
                </div>
              </>
            }
            <div className="flex justify-center items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Инфраструктура района</h3>
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
                    </li>
                  }
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

      {selectedHome.hasYards && (
        <div className="mb-16">
          <h3 className="text-2xl font-semibold text-gray-900 mb-6 text-center">Фотографии дворов</h3>

          <div className="relative">
            <div className="flex justify-between items-center mb-4">
              {yardsImages.length > YARDS_PER_PAGE && (
                <div className="flex gap-2">
                  <button
                    aria-label="Назад по дворам"
                    onClick={() => setYardSlideIndex(i => Math.max(0, i - 1))}
                    disabled={yardSlideIndex === 0}
                    className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 disabled:opacity-40"
                  >
                    ‹
                  </button>
                  <button
                    aria-label="Вперед по дворам"
                    onClick={() =>
                      setYardSlideIndex(i =>
                        Math.min(
                          Math.ceil(yardsImages.length / YARDS_PER_PAGE) - 1,
                          i + 1
                        )
                      )
                    }
                    disabled={yardSlideIndex >= Math.ceil(yardsImages.length / YARDS_PER_PAGE) - 1}
                    className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 disabled:opacity-40"
                  >
                    ›
                  </button>
                </div>
              )}
            </div>

            <div className="overflow-hidden">
              <div
                className="flex gap-6 transition-transform items-center justify-center"
                style={{
                  transform: `translateX(-${yardSlideIndex * (100 / Math.ceil(yardsImages.length / YARDS_PER_PAGE))}%)`,
                  width: `${Math.ceil(yardsImages.length / YARDS_PER_PAGE) * 100}%`,
                }}
              >
                {yardsImages.map((img, i) => (
                  <div
                    key={i}
                    className="flex-shrink-0 rounded-xl overflow-hidden max-w-[60vw]"
                    style={{width: `${100 / Math.ceil(yardsImages.length / YARDS_PER_PAGE)}%`}}
                  >
                    <img
                      src={img}
                      alt={`Двор ${i + 1}`}
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

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
  )
    ;
};

export default ComplexPage;