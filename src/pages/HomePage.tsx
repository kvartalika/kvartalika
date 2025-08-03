import {Link} from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import ApartmentShowcase from '../components/ApartmentShowcase';
import BackgroundPattern from "../components/BackgroundPattern.tsx";
import HomePageManager from '../components/content/HomePageManager.tsx';

import {useAuthStore, useFlatsStore, useUIStore} from "../store";
import PageInfoEditor from "../components/content/PageInfoEditor.tsx";
import SocialMediaEditor from "../components/content/SocialMediaEditor.tsx";

const HomePage = () => {
  const role = useAuthStore(state => state.role);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  const pageInfo = useUIStore(state => state.pageInfo);

  const openModal = useUIStore(state => state.openModal);
  const modals = useUIStore(state => state.modals);

  const {
    homePageFlats,
    homes,
    flats,
  } = useFlatsStore();

  const handleBookingClick = () => {
    openModal('bid');
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex pt-24 pb-6 justify-center gradient-primary overflow-hidden">
        <BackgroundPattern />
        <div className="container mx-auto px-4 text-center text-white relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            {pageInfo.title}
          </h1>
          <p className="text-xl md:text-2xl mb-12 text-blue-100 max-w-4xl mx-auto leading-relaxed">
            {pageInfo.description}
          </p>

          <div className="max-w-4xl mx-auto mb-16">
            <SearchBar />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-blue-200 mb-2">50+</div>
              <div className="text-sm md:text-base text-blue-100">Жилых комплексов</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-blue-200 mb-2">1000+</div>
              <div className="text-sm md:text-base text-blue-100">Квартир в продаже</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-blue-200 mb-2">15</div>
              <div className="text-sm md:text-base text-blue-100">Лет на рынке</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-blue-200 mb-2">5000+</div>
              <div className="text-sm md:text-base text-blue-100">Довольных клиентов</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Apartments */}
      {flats.length > 0 && (
        <ApartmentShowcase
          apartments={flats.slice(0, 6)}
          title="Популярные квартиры"
          subtitle="Самые востребованные варианты от наших партнеров"
          viewAllLink="/apartments"
          className="bg-gray-50"
        />
      )}

      {/* Category Sections */}
      {homePageFlats.length > 0 && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Рекомендуемые квартиры
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Подборка лучших квартир для вас
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {homePageFlats.slice(0, 6).map(apartment => (
                <div
                  key={apartment.flat.id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    {apartment.imagesResolved && apartment.imagesResolved.length > 0 ? (
                      <img
                        src={apartment.imagesResolved[0]}
                        alt={apartment.flat.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                    
                    {/* Price Badge */}
                    <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                      {new Intl.NumberFormat('ru-RU').format(apartment.flat.price || 0)} ₽
                    </div>
                    
                    {/* Rooms Badge */}
                    <div className="absolute top-4 left-4 bg-white bg-opacity-90 text-gray-900 px-3 py-1 rounded-full text-sm font-medium">
                      {apartment.flat.numberOfRooms || 1} комн.
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="mb-4">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                        {apartment.flat.name}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {homes.find(home => home.id === apartment.flat.homeId)?.name || 'Жилой комплекс'}
                      </p>
                    </div>

                    {/* Features */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                        </svg>
                        {apartment.flat.area || 0} м²
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        {apartment.flat.floor || 0} этаж
                      </div>
                    </div>

                    {/* Decorated Badge */}
                    {apartment.flat.hasDecoration && (
                      <div className="mb-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          С отделкой
                        </span>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3">
                      <Link
                        to={`/apartment/${apartment.flat.id}`}
                        className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200 px-4 py-2 rounded-lg text-center font-medium transition-colors"
                      >
                        Подробнее
                      </Link>
                      <button
                        onClick={handleBookingClick}
                        className="flex-1 bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg font-medium transition-colors"
                      >
                        Забронировать
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* View All Button */}
            <div className="text-center mt-12">
              <Link
                to="/apartments"
                className="inline-flex items-center px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Посмотреть все квартиры
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Не нашли подходящую квартиру?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Наши специалисты помогут подобрать идеальный вариант под ваши требования и бюджет
          </p>
          <button
            onClick={handleBookingClick}
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-medium transition-colors text-lg"
          >
            Получить персональную подборку
          </button>
        </div>
      </section>

      {/* Content Management */}
      {(isAuthenticated && (role === 'ADMIN' || role === 'CONTENT_MANAGER')) && (
        <>
          {modals.mainPage && <PageInfoEditor />}
          {modals.social && <SocialMediaEditor />}
          <HomePageManager onCancel={() => {}}>
            <div>Content Management</div>
          </HomePageManager>
        </>
      )}
    </div>
  );
};

export default HomePage;