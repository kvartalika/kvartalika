import {Link} from 'react-router-dom';
import {useEffect} from 'react';
import SearchBar from '../components/SearchBar';
import ApartmentCard from '../components/ApartmentCard';
import BackgroundPattern from "../components/BackgroundPattern.tsx";
import HomePageManager from '../components/HomePageManager';

import {useUIStore} from "../store/ui.store.ts";
import {useAuthStore} from "../store/auth.store.ts";
import {usePropertiesStore} from "../store/properties.store.ts";
import type {HomePageFlats} from "../services";
import PageLoader from "../components/PageLoader.tsx";

const HomePage = () => {
  const role = useAuthStore(state => state.role);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  const pageInfo = useUIStore(state => state.pageInfo);

  const openModal = useUIStore(state => state.openModal);
  const modals = useUIStore(state => state.modals);
  const closeModal = useUIStore(state => state.closeModal);

  const categories = usePropertiesStore(state => state.categories);

  const homePageFlats = usePropertiesStore(state => state.homePageFlats);
  const fetchHomePageFlats = usePropertiesStore(state => state.fetchHomePageFlats);
  const isLoadingHomePageFlats = usePropertiesStore(state => state.isLoadingHomePageFlats);

  const fetchCategories = usePropertiesStore(state => state.fetchCategories);
  const fetchHomes = usePropertiesStore(state => state.fetchHomes);

  useEffect(() => {
    const load = async () => {
      await Promise.all([fetchCategories(), fetchHomes()]);
    };
    load();
  }, [fetchCategories, fetchHomes]);

  useEffect(() => {
    const loadHomePageFlats = async () => {
      const homePageCategories = categories.filter(c => c.isOnMainPage);
      if (homePageCategories.length === 0) return;

      await fetchHomePageFlats(homePageCategories, true);
    };

    loadHomePageFlats();
  }, [categories, fetchHomePageFlats]);

  const renderSection = (section: HomePageFlats, idx: number) => {
    return (
      <section
        key={section.category.id}
        className={`py-16 ${idx % 2 === 1 ? 'bg-gray-50' : 'bg-white'}`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{section.category.name}</h2>
            </div>
            <Link
              to={`/apartments?categoriesId=${section.category.id}`}
              className={`px-6 py-3 rounded-lg font-medium transition-colors bg-blue-600 hover:bg-blue-700 text-white`}
            >
              Посмотреть все
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {section.flats.map(apartment => (
              <ApartmentCard
                key={apartment.id}
                apartment={apartment}
                onBookingClick={() => openModal('bid')}
              />
            ))}
          </div>
        </div>
      </section>
    );
  };

  return (
    <div className="min-h-screen">
      <section className="relative min-h-screen flex pt-24 pb-6 justify-center gradient-primary overflow-hidden">
        <BackgroundPattern />
        <div className="container mx-auto px-4 text-center text-white relative z-10">
          <h1 className="heading-xl mb-6">
            {pageInfo.title}
          </h1>
          <p className="text-xl md:text-2xl mb-12 text-blue-100 max-w-3xl mx-auto">
            {pageInfo.description}
          </p>

          <div className="max-w-4xl mx-auto">
            <SearchBar />
          </div>

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

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>

        {isAuthenticated && role === 'CONTENT_MANAGER' && (
          <div className="absolute top-32 right-8 z-50">
            <button
              onClick={() => openModal('manager')}
              className="bg-white bg-opacity-20 backdrop-blur-sm text-black px-4 py-2 rounded-lg font-medium hover:bg-opacity-30 transition-all"
            >
              ✏️ Редактировать главную
            </button>
          </div>
        )}
      </section>

      {isLoadingHomePageFlats ?
        <PageLoader /> : homePageFlats.map((section, idx) => renderSection(section, idx))}

      <section
        id="about"
        className="py-16 bg-white"
      >
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
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Проверенные объекты</h3>
                <p className="text-gray-600">Все квартиры проходят тщательную проверку на юридическую чистоту</p>
              </div>

              <div className="text-center">
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
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Быстрый поиск</h3>
                <p className="text-gray-600">Удобные фильтры помогут найти идеальную квартиру за минуты</p>
              </div>

              <div className="text-center">
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
                      d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Поддержка 24/7</h3>
                <p className="text-gray-600">Наши специалисты готовы помочь вам в любое время</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-blue-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Готовы найти свою идеальную квартиру?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Оставьте заявку и наш менеджер подберет лучшие варианты специально для вас
          </p>
          <button
            onClick={() => openModal('bid')}
            className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
          >
            Оставить заявку
          </button>
        </div>
      </section>

      {modals.manager && (
        <HomePageManager
          onCancel={() => closeModal('manager')}
        />
      )}
    </div>
  );
};

export default HomePage;