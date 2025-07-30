import {BrowserRouter, Routes, Route, useLocation} from 'react-router-dom';
import {useEffect} from 'react';
import {useAppStore} from './store/useAppStore';

import Header from './components/Header';
import Footer from './components/Footer';
import PageLoader from './components/PageLoader';
import BookingModal from './components/BookingModal';
import ProtectedRoute from './components/ProtectedRoute';

import HomePage from './pages/HomePage';
import ComplexPage from './pages/ComplexPage';
import ApartmentPage from './pages/ApartmentPage';
import ComplexesPage from './pages/ComplexesPage';
import ApartmentsPage from './pages/ApartmentsPage';
import AdminSetupPage from './pages/admin/AdminSetupPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminRegisterPage from './pages/admin/AdminRegisterPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import ManagerDashboardPage from './pages/manager/ManagerDashboardPage';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  const {
    isLoading,
    showBookingModal,
    setApartments,
    setComplexes,
    setIsLoading
  } = useAppStore();

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const mockApartments = [
          {
            id: 1,
            complex: "ЖК Янтарный",
            complexId: 1,
            address: "ул. Примерная, 10",
            rooms: 2,
            floor: 5,
            bathrooms: 1,
            bathroom: "Совмещенный",
            finishing: "Чистовая",
            isHot: true,
            image: "/images/apt1.jpg",
            price: 5500000,
            area: 65.5,
            description: "Уютная двухкомнатная квартира с современным ремонтом",
            floorPlan: "/images/floorplan1.jpg",
            coordinates: { lat: 55.7558, lng: 37.6176 },
            viewers: 12,
            hasParks: true,
            hasInfrastructure: true
          },
          {
            id: 2,
            complex: "ЖК Янтарный",
            complexId: 1,
            address: "ул. Примерная, 10",
            rooms: 3,
            floor: 8,
            bathrooms: 2,
            bathroom: "Раздельный",
            finishing: "Под ключ",
            isHot: false,
            image: "/images/apt2.jpg",
            price: 7800000,
            area: 85.2,
            description: "Просторная трёхкомнатная квартира с панорамными окнами",
            floorPlan: "/images/floorplan2.jpg",
            coordinates: { lat: 55.7568, lng: 37.6186 },
            viewers: 8,
            hasParks: true,
            hasInfrastructure: true
          },
          {
            id: 3,
            complex: "ЖК Нижний",
            complexId: 2,
            address: "ул. Речная, 25",
            rooms: 1,
            floor: 12,
            bathrooms: 1,
            bathroom: "Совмещенный",
            finishing: "Черновая",
            isHot: true,
            image: "/images/apt3.jpg",
            price: 3200000,
            area: 42.1,
            description: "Компактная однокомнатная квартира в новом доме",
            floorPlan: "/images/floorplan3.jpg",
            coordinates: { lat: 55.7548, lng: 37.6166 },
            viewers: 15,
            hasParks: false,
            hasInfrastructure: true
          },
          {
            id: 4,
            complex: "ЖК Нижний",
            complexId: 2,
            address: "ул. Речная, 25",
            rooms: 2,
            floor: 15,
            bathrooms: 2,
            bathroom: "Раздельный",
            finishing: "Дизайнерская",
            isHot: false,
            image: "/images/apt4.jpg",
            price: 6200000,
            area: 68.7,
            description: "Стильная двухкомнатная квартира с дизайнерским ремонтом",
            floorPlan: "/images/floorplan4.jpg",
            coordinates: { lat: 55.7538, lng: 37.6156 },
            viewers: 6,
            hasParks: false,
            hasInfrastructure: false
          },
          {
            id: 5,
            complex: "ЖК Солнечный",
            complexId: 3,
            address: "пр. Солнечный, 14",
            rooms: 3,
            floor: 6,
            bathrooms: 2,
            bathroom: "Раздельный",
            finishing: "Чистовая",
            isHot: true,
            image: "/images/apt5.jpg",
            price: 8900000,
            area: 95.4,
            description: "Элитная трёхкомнатная квартира в престижном районе",
            floorPlan: "/images/floorplan5.jpg",
            coordinates: { lat: 55.7578, lng: 37.6196 },
            viewers: 20,
            hasParks: true,
            hasInfrastructure: true
          }
        ];

        const mockComplexes = [
          {
            id: 1,
            name: "ЖК Янтарный",
            address: "ул. Примерная, 10",
            description: "Современный жилой комплекс в центре города с развитой инфраструктурой",
            image: "/images/complex1.jpg",
            apartments: mockApartments.filter(apt => apt.complexId === 1),
            amenities: ["Подземная парковка", "Детская площадка", "Фитнес-центр", "Консьерж-сервис"],
            coordinates: { lat: 55.7558, lng: 37.6176 },
            hasParks: true,
            hasInfrastructure: true
          },
          {
            id: 2,
            name: "ЖК Нижний",
            address: "ул. Речная, 25",
            description: "Жилой комплекс бизнес-класса на берегу реки с панорамными видами",
            image: "/images/complex2.jpg",
            apartments: mockApartments.filter(apt => apt.complexId === 2),
            amenities: ["Видеонаблюдение", "Закрытая территория", "Спа-центр", "Кафе"],
            coordinates: { lat: 55.7548, lng: 37.6166 },
            hasParks: false,
            hasInfrastructure: true
          },
          {
            id: 3,
            name: "ЖК Солнечный",
            address: "пр. Солнечный, 14",
            description: "Элитный жилой комплекс с премиальными квартирами и услугами",
            image: "/images/complex3.jpg",
            apartments: mockApartments.filter(apt => apt.complexId === 3),
            amenities: ["Консьерж 24/7", "Подземный паркинг", "Бассейн", "Детский сад"],
            coordinates: { lat: 55.7578, lng: 37.6196 },
            hasParks: true,
            hasInfrastructure: true
          }
        ];

        setApartments(mockApartments);
        setComplexes(mockComplexes);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setTimeout(() => setIsLoading(false), 1000);
      }
    };

    loadData();
  }, [setApartments, setComplexes, setIsLoading]);

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors">
        <Header />
        <ScrollToTop />

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/complexes" element={<ComplexesPage />} />
            <Route path="/apartments" element={<ApartmentsPage />} />
            <Route path="/complex/:complexName" element={<ComplexPage />} />
            <Route path="/apartment/:apartmentId" element={<ApartmentPage />} />
            
            <Route path="/admin/setup" element={<AdminSetupPage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin/register" element={<AdminRegisterPage />} />
            
            <Route 
              path="/admin/dashboard" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboardPage />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/manager/dashboard" 
              element={
                <ProtectedRoute requiredRole="manager">
                  <ManagerDashboardPage />
                </ProtectedRoute>
              } 
            />
            
            <Route
              path="*"
              element={
                <div className="flex items-center justify-center min-h-[400px]">
                  <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">404</h1>
                    <p className="text-gray-600 dark:text-gray-400">Страница не найдена</p>
                  </div>
                </div>
              }
            />
          </Routes>
        </main>

        <Footer />

        {showBookingModal && <BookingModal />}
      </div>
    </BrowserRouter>
  );
}

export default App;