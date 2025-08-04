import {lazy, useEffect} from 'react';
import {Link, useParams} from 'react-router-dom';
import {useFlatsStore} from "../store/flats.store.ts";
import {safeImage} from "../utils/safeImage.ts";
import ImageSlider from "../components/ImageSlider.tsx";
import {useUIStore} from "../store/ui.store.ts";

const Map = lazy(() => import('../components/Map.tsx'));

const ApartmentPage = () => {
  const {apartmentId} = useParams<{ apartmentId: string }>();

  const openModal = useUIStore(state => state.openModal);

  const {
    setSelectedFlat,
    getFlatById,
    selectedFlat,
    homes,
    setSelectedHome,
    selectedHome
  } = useFlatsStore();

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
  }, [apartmentId, getFlatById, setSelectedFlat, homes, selectedHome, setSelectedHome]);

  if (!selectedFlat?.flat) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Квартира не найдена
          </h1>
          <Link
            to="/"
            className="text-primary-600 hover:text-primary-700 font-medium"
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

  const pricePerSqm = Math.round((selectedFlat.flat.price || 0) / (selectedFlat.flat?.area || 1));

  let images = safeImage(selectedFlat.imagesResolved, 'flat')
  images = Array.isArray(images) ? images : [images]

  let layoutImg = safeImage(selectedFlat.layoutResolved, 'layout');
  layoutImg = Array.isArray(layoutImg) ? layoutImg[0] : layoutImg;

  return (
    <div className="min-h-screen pt-20">
      <section className="bg-gray-50 py-4">
        <div className="container mx-auto px-4">
          <nav className="text-sm">
            <Link
              to="/"
              className="text-primary-600 hover:text-primary-700"
            >
              Главная
            </Link>
            <span className="mx-2 text-gray-400">›</span>
            <Link
              to={`/complex/${selectedFlat.flat.homeId}`}
              className="text-primary-600 hover:text-primary-700"
            >
              {selectedHome?.name ?? `ЖК №${selectedFlat.flat.homeId}`}
            </Link>
            <span className="mx-2 text-gray-400">›</span>
            <span className="text-gray-600">
              {selectedFlat.flat?.numberOfRooms ?? 1}-комнатная квартира
            </span>
          </nav>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8 w-[90vw]">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="mb-4">
              <div className="relative rounded-xl overflow-hidden bg-gray-200 w-full">

                <div className="aspect-[4/3] w-full">
                  <ImageSlider
                    images={images || []}
                    className="h-full"
                    showThumbnails={true}
                    autoPlay={true}
                  />
                </div>

                {selectedFlat.categories?.some(el =>
                  el.name?.toLowerCase().includes('горячее предложение')
                ) && (
                  <div className="absolute bottom-2 left-4 bg-red-600 text-white px-2 py-2 rounded-lg text-xs font-semibold flex items-center gap-1">
                    <span>🔥</span> Горячее предложение
                  </div>
                )}
              </div>

            </div>

            {selectedFlat.flat.layout && (
              <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Планировка квартиры
                </h2>
                <div className="flex justify-center">
                  <img
                    src={layoutImg}
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
                    <span className="font-medium">{selectedFlat.flat?.numberOfRooms ?? 1}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-gray-200">
                    <span className="text-gray-600">Площадь:</span>
                    <span className="font-medium">{selectedFlat.flat?.area ?? "Неизвестно"} м²</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-gray-200">
                    <span className="text-gray-600">Этаж:</span>
                    <span className="font-medium">{selectedFlat.flat?.floor ?? 1}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-gray-200">
                    <span className="text-gray-600">Количество санузлов:</span>
                    <span className="font-medium">{selectedFlat.flat?.numberOfBathrooms ?? 1}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between py-3 border-b border-gray-200">
                    <span className="text-gray-600">Отделка:</span>
                    <span className="font-medium">{selectedFlat.flat.hasDecoration ? "Есть" : "Нет"}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-gray-200">
                    <span className="text-gray-600">Цена за м²:</span>
                    <span className="font-medium">{formatPrice(pricePerSqm)} ₽/м²</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-gray-200">
                    <span className="text-gray-600">Жилой комплекс:</span>
                    <Link
                      to={`/complex/${selectedFlat.flat.homeId}`}
                      className="font-medium text-primary-600 hover:text-primary-700"
                    >
                      {selectedHome?.name ?? `ЖК №${selectedFlat.flat.homeId}`}
                    </Link>
                  </div>
                  <div className="flex justify-between py-3 border-b border-gray-200">
                    <span className="text-gray-600">Адрес:</span>
                    <span className="font-medium">{selectedFlat.flat.address ?? "Нужно уточнить"}</span>
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
                  {selectedFlat.flat?.features?.map((feature, index) => (
                    <div
                      key={`${feature.slice(15)}-${index}`}
                      className="flex items-center text-gray-600"
                    >
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

              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Категории
                </h3>
                <div className="flex gap-4">
                  {selectedFlat.categories.map((cat, index) => (
                    <div
                      key={`${cat.name}-${index}`}
                      className="flex items-center text-white px-3 py-2 bg-primary-500 font-semibold text-center rounded-lg"
                    >
                      {cat.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>


            {selectedFlat.flat.latitude && selectedFlat.flat.longitude && selectedFlat.flat.address &&
              <div className="mt-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Расположение квартиры</h3>
                <div className="bg-gray-100 rounded-xl p-8 text-center mb-8">
                  <Map
                    latitude={selectedFlat.flat.latitude}
                    longitude={selectedFlat.flat.longitude}
                    description={selectedFlat.flat.address}
                  />
                </div>
              </div>
            }
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {formatPrice(selectedFlat.flat?.price || 0)} ₽
                  </div>
                  <div className="text-sm text-gray-600">
                    {formatPrice(pricePerSqm)} ₽ за м²
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Площадь:</span>
                    <span className="font-medium">{selectedFlat.flat.area ?? "Неизвестно"} м²</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Комнат:</span>
                    <span className="font-medium">{selectedFlat.flat.numberOfRooms ?? 1}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Этаж:</span>
                    <span className="font-medium">{selectedFlat.flat.floor ?? 1}</span>
                  </div>
                </div>

                <button
                  onClick={() => openModal('bid')}
                  aria-label="Записаться на осмотр квартиры"
                  className="w-full bg-primary-600 text-surface-50 py-4 rounded-xl font-semibold text-lg hover:bg-primary-700 transition-all duration-200 shadow-lg hover:shadow-xl mb-4"
                >
                  Записаться на осмотр
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApartmentPage;