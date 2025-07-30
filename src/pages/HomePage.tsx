import {Link} from 'react-router-dom';
import {useEffect, useState} from 'react';
import {
  type Apartment,
  type HomepageSection,
  useAppStore
} from '../store/useAppStore';
import {useAuthStore} from '../store/useAuthStore';
import SearchBar from '../components/SearchBar';
import ApartmentCard from '../components/ApartmentCard';
import BackgroundPattern from "../components/BackgroundPattern.tsx";
import HomePageManager from '../components/HomePageManager';

const HomePage = () => {
  const {
    filteredApartments,
    homepageSections,
    setSelectedApartment,
    setShowBookingModal,
    setSearchFilters
  } = useAppStore();
  const {user, isAuthenticated} = useAuthStore();
  const [showHomePageManager, setShowHomePageManager] = useState(false);

  useEffect(() => {
    setSearchFilters({
      query: '',
      rooms: [],
      bathrooms: [],
      finishing: [],
      minPrice: undefined,
      maxPrice: undefined,
      complex: '',
      hasParks: undefined,
      hasSchools: undefined,
      hasShops: undefined,
      sortBy: 'price',
      sortOrder: 'asc'
    });
  }, [setSearchFilters]);

  const handleBookingClick = (apartment: Apartment) => {
    setSelectedApartment(apartment);
    setShowBookingModal(true);
  };

  const getApartmentsForSection = (section: HomepageSection): Apartment[] => {
    let apartments: Apartment[] = [];

    if (section.type === 'hot_deals') {
      apartments = filteredApartments.filter(apt => apt.isHot);
    } else if (section.type === 'rooms' && section.rooms) {
      apartments = filteredApartments.filter(apt => apt.rooms === section.rooms);
    } else if (section.type === 'custom' && section.customFilter) {
      apartments = section.customFilter(filteredApartments);
    }

    return apartments.slice(0, 5);
  };

  const renderSection = (section: HomepageSection, apartments: Apartment[]) => {
    if (!section.isVisible || apartments.length === 0) return null;

    return (
      <section
        key={section.id}
        className={`py-16 ${section.backgroundColor === 'gray' ? 'bg-gray-50' : 'bg-white'}`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{section.title}</h2>
              <p className="text-gray-600">{section.description}</p>
            </div>
            {section.linkText && section.linkUrl && (
              <Link
                to={section.linkUrl}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  section.type === 'hot_deals'
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {section.linkText}
              </Link>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {apartments.map(apartment => (
              <ApartmentCard
                key={apartment.id}
                apartment={apartment}
                onBookingClick={() => handleBookingClick(apartment)}
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
            Найдите квартиру<br />
            <span className="text-blue-200">своей мечты</span>
          </h1>
          <p className="text-xl md:text-2xl mb-12 text-blue-100 max-w-3xl mx-auto">
            Современные жилые комплексы с лучшими условиями для комфортной жизни
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

        {/* Content Manager Edit Button */}
        {isAuthenticated && user?.role === 'CM' && (
          <div className="absolute top-32 right-8 z-50">
            <button
              onClick={() => setShowHomePageManager(true)}
              className="bg-white bg-opacity-20 backdrop-blur-sm text-black px-4 py-2 rounded-lg font-medium hover:bg-opacity-30 transition-all"
            >
              ✏️ Редактировать главную
            </button>
          </div>
        )}
      </section>

      {homepageSections
        .filter(section => section.isVisible)
        .sort((a, b) => a.order - b.order)
        .map(section => {
          const apartments = getApartmentsForSection(section);
          return renderSection(section, apartments);
        })}

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
            onClick={() => setShowBookingModal(true)}
            className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
          >
            Оставить заявку
          </button>
        </div>
      </section>

      {/* Home Page Manager Modal */}
      {showHomePageManager && (
        <HomePageManager
          onSave={() => {
            // Update the home page data
            setShowHomePageManager(false);
            // Reload the page or update the data
            window.location.reload();
          }}
          onCancel={() => setShowHomePageManager(false)}
        />
      )}
    </div>
  );
};

export default HomePage;