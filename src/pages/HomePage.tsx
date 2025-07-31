import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  usePropertiesStore,
  useUIStore,
  useAuthStore,
  useSearchStore,
  useApartments,
  useFeaturedHomes,
  usePopularFlats,
  useHomepageSections,
  useIsAuthenticated,
  useAuthUser,
  useAuthRole,
  type Apartment
} from '../store';
import SearchBar from '../components/SearchBar';
import ApartmentCard from '../components/ApartmentCard';
import BackgroundPattern from "../components/BackgroundPattern.tsx";
import HomePageManager from '../components/HomePageManager';

const HomePage = () => {
  const apartments = useApartments();
  const featuredHomes = useFeaturedHomes();
  const popularFlats = usePopularFlats();
  const homepageSections = useHomepageSections();
  const isAuthenticated = useIsAuthenticated();
  const user = useAuthUser();
  const role = useAuthRole();
  
  const { 
    fetchFlats, 
    fetchHomes, 
    fetchFeaturedContent,
    isLoading: propertiesLoading 
  } = usePropertiesStore();
  
  const { 
    openModal, 
    setBookingForm,
    setHomepageSections 
  } = useUIStore();
  
  const { resetFilters } = useSearchStore();
  
  const [showHomePageManager, setShowHomePageManager] = useState(false);

  useEffect(() => {
    // Reset search filters on homepage
    resetFilters();
    
    // Load initial data
    const loadData = async () => {
      try {
        await Promise.all([
          fetchFlats(),
          fetchHomes(),
          fetchFeaturedContent(),
        ]);
      } catch (error) {
        console.error('Failed to load homepage data:', error);
      }
    };
    
    loadData();
  }, []);

  const handleBookingClick = (apartment: Apartment) => {
    setBookingForm({ 
      apartmentId: apartment.id,
      flatId: apartment.id,
      complexId: apartment.complexId,
      homeId: apartment.complexId 
    });
    openModal('booking');
  };

  const getApartmentsForSection = (section: any): Apartment[] => {
    if (section.type === 'hot_deals') {
      // Show popular flats from API
      return popularFlats.map(flat => ({
        id: flat.id,
        complex: flat.home?.name || "Неизвестный комплекс",
        complexId: flat.homeId,
        address: flat.home?.address || "Адрес не указан",
        rooms: flat.rooms,
        floor: flat.floor,
        bathroom: "Совмещенный",
        bathrooms: 1,
        finishing: "Чистовая",
        isHot: true,
        image: flat.photos?.[0]?.url || "/images/default-apartment.jpg",
        price: flat.price,
        area: flat.area,
        description: flat.description,
        hasParks: flat.home?.amenities?.includes("Парковка") || false,
        distanceFromCenter: 5.0
      }));
    }
    
    if (section.type === 'rooms' && section.rooms) {
      return apartments.filter(apt => apt.rooms === section.rooms);
    }
    
    if (section.type === 'custom' && section.customFilter) {
      try {
        // Apply custom filter if it exists
        return apartments.filter(apt => {
          if (section.id === 'by_complex_yantar') {
            return apt.complex.includes('Янтарный');
          }
          if (section.id === 'by_complex_nizhniy') {
            return apt.complex.includes('Нижний');
          }
          if (section.id === 'by_finishing_ready') {
            return apt.finishing === 'Чистовая' || apt.finishing === 'Под ключ';
          }
          return true;
        });
      } catch (error) {
        console.error('Error applying custom filter:', error);
        return [];
      }
    }
    
    return [];
  };

  const canManageHomepage = isAuthenticated && (role === 'admin' || role === 'content_manager');

  if (propertiesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка данных...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <BackgroundPattern />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Найдите идеальную квартиру
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Премиальная недвижимость в лучших районах города
          </p>
          
          {/* Search Bar */}
          <div className="max-w-4xl mx-auto">
            <SearchBar />
          </div>
          
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/apartments"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Все квартиры
            </Link>
            <Link
              to="/complexes"
              className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Жилые комплексы
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Content */}
      {featuredHomes.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Рекомендуемые комплексы
              </h2>
              <p className="text-xl text-gray-600">
                Лучшие предложения от наших партнеров
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredHomes.slice(0, 6).map((home) => (
                <div key={home.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="h-48 bg-gray-200">
                    {home.photos?.[0]?.url ? (
                      <img
                        src={home.photos[0].url}
                        alt={home.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <span className="text-4xl">🏠</span>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{home.name}</h3>
                    <p className="text-gray-600 mb-2">{home.address}</p>
                    <p className="text-gray-700 text-sm mb-4 line-clamp-2">{home.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {home.flats?.length || 0} квартир
                      </span>
                      <Link
                        to={`/complex/${home.id}`}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Подробнее →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Homepage Sections */}
      <main className="py-16">
        <div className="container mx-auto px-4">
          {canManageHomepage && (
            <div className="mb-8 text-center">
              <button
                onClick={() => setShowHomePageManager(!showHomePageManager)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {showHomePageManager ? 'Скрыть настройки' : 'Настроить страницу'}
              </button>
            </div>
          )}

          {showHomePageManager && (
            <div className="mb-12">
              <HomePageManager 
                sections={homepageSections}
                onSectionsChange={setHomepageSections}
              />
            </div>
          )}

          {homepageSections
            .filter(section => section.isVisible)
            .sort((a, b) => a.order - b.order)
            .map((section) => {
              const sectionApartments = getApartmentsForSection(section);
              
              if (sectionApartments.length === 0) {
                return null;
              }

              return (
                <section
                  key={section.id}
                  className={`mb-16 py-12 rounded-lg ${
                    section.backgroundColor === 'gray' ? 'bg-gray-50' : 'bg-white'
                  }`}
                >
                  <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center mb-8">
                      <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                          {section.title}
                        </h2>
                        <p className="text-xl text-gray-600">
                          {section.description}
                        </p>
                      </div>
                      {section.linkUrl && (
                        <Link
                          to={section.linkUrl}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          {section.linkText || 'Смотреть все'} →
                        </Link>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {sectionApartments.slice(0, 8).map((apartment) => (
                        <ApartmentCard
                          key={apartment.id}
                          apartment={apartment}
                          onBookingClick={() => handleBookingClick(apartment)}
                        />
                      ))}
                    </div>

                    {sectionApartments.length > 8 && section.linkUrl && (
                      <div className="text-center mt-8">
                        <Link
                          to={section.linkUrl}
                          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Показать все {sectionApartments.length} предложений
                        </Link>
                      </div>
                    )}
                  </div>
                </section>
              );
            })}

          {/* Empty State */}
          {apartments.length === 0 && !propertiesLoading && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🏠</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Квартиры скоро появятся
              </h3>
              <p className="text-gray-600 mb-8">
                Мы работаем над наполнением каталога недвижимости
              </p>
              <Link
                to="/apartments"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Перейти в каталог
              </Link>
            </div>
          )}
        </div>
      </main>

      {/* Stats Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">{apartments.length}</div>
              <div className="text-xl opacity-90">Квартир в продаже</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">{featuredHomes.length}</div>
              <div className="text-xl opacity-90">Жилых комплексов</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">100%</div>
              <div className="text-xl opacity-90">Проверенных объектов</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-xl opacity-90">Поддержка клиентов</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Готовы найти свою квартиру?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Свяжитесь с нами, и мы поможем подобрать идеальный вариант
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => openModal('contactForm')}
              className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Связаться с нами
            </button>
            <Link
              to="/apartments"
              className="bg-gray-200 text-gray-900 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Смотреть каталог
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;