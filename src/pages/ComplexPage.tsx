import { useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useFlatsStore, useUIStore } from '../store';
import ApartmentCard from '../components/ApartmentCard';
import ImageSlider from '../components/ImageSlider';

const ComplexPage = () => {
  const { homeId } = useParams<{ homeId: string }>();
  const openModal = useUIStore(state => state.openModal);

  const {
    homes,
    flats,
    loadFlatsByHome,
    isLoadingHomes,
  } = useFlatsStore();

  const home = useMemo(() => {
    if (!homeId) return null;
    return homes.find(h => h.id === parseInt(homeId));
  }, [homes, homeId]);

  const complexFlats = useMemo(() => {
    if (!homeId) return [];
    return flats.filter(f => f.flat.homeId === parseInt(homeId));
  }, [flats, homeId]);

  useEffect(() => {
    if (homeId) {
      void loadFlatsByHome(parseInt(homeId));
    }
  }, [homeId, loadFlatsByHome]);

  if (isLoadingHomes || !home) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                {home.name}
              </h1>
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                {home.description || 'Современный жилой комплекс с развитой инфраструктурой и комфортными условиями для жизни.'}
              </p>
              
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-200 mb-2">
                    {complexFlats.length}
                  </div>
                  <div className="text-sm text-blue-100">Квартир в продаже</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-200 mb-2">
                    {home.numberOfFloors || 'Много'}
                  </div>
                  <div className="text-sm text-blue-100">Этажей</div>
                </div>
              </div>

              <button
                onClick={() => openModal('bid')}
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-medium transition-colors"
              >
                Получить консультацию
              </button>
            </div>

            {/* Complex Photos Slider */}
            <div className="relative">
              <ImageSlider
                images={home.imagesResolved || []}
                title="Фотографии комплекса"
                className="h-80"
                showThumbnails={true}
                autoPlay={true}
                autoPlayInterval={5000}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Complex Details */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Info */}
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                О комплексе
              </h2>
              
              <div className="prose prose-lg max-w-none text-gray-600">
                <p className="mb-6">
                  {home.description || 'Жилой комплекс представляет собой современный проект, разработанный с учетом всех потребностей современной семьи. Каждая квартира спроектирована с максимальным комфортом и функциональностью.'}
                </p>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Особенности комплекса:
                </h3>
                
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Современная архитектура и качественные материалы</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Развитая инфраструктура и благоустройство</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Круглосуточная охрана и видеонаблюдение</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Подземная парковка и наземные парковочные места</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Детские и спортивные площадки</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Информация о комплексе
                </h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Адрес:</span>
                    <span className="font-medium">{home.address || 'Уточняется'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Этажность:</span>
                    <span className="font-medium">{home.numberOfFloors || 'Многоэтажный'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Квартир в продаже:</span>
                    <span className="font-medium">{complexFlats.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Статус:</span>
                    <span className="font-medium text-green-600">Строится</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Нужна консультация?
                </h3>
                <p className="text-gray-600 mb-4">
                  Наши специалисты помогут подобрать идеальную квартиру в этом комплексе
                </p>
                <button
                  onClick={() => openModal('bid')}
                  className="w-full bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Получить консультацию
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Apartments Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Квартиры в комплексе
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Выберите подходящую квартиру в жилом комплексе "{home.name}"
            </p>
          </div>

          {complexFlats.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {complexFlats.map((apartment) => (
                <ApartmentCard
                  homeName={home.name || 'Жилой комплекс'}
                  key={apartment.flat.id}
                  apartment={apartment}
                  onBookingClick={() => openModal('bid')}
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
                В данный момент нет доступных квартир в этом комплексе
              </p>
              <Link
                to="/apartments"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Посмотреть все квартиры
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Заинтересовались комплексом?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Оставьте заявку, и наш менеджер свяжется с вами для обсуждения деталей
          </p>
          <button
            onClick={() => openModal('bid')}
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-medium transition-colors text-lg"
          >
            Оставить заявку
          </button>
        </div>
      </section>
    </div>
  );
};

export default ComplexPage;