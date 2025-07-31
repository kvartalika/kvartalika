import {BrowserRouter, Routes, Route, useLocation} from 'react-router-dom';
import {useEffect} from 'react';
import {useAppStore} from './store/useAppStore';
import { PublicService } from './services/public.service';

import Header from './components/Header';
import Footer from './components/Footer';
import PageLoader from './components/PageLoader';
import BookingModal from './components/BookingModal';
import ScrollToAnchor from './components/ScrollToAnchor';
import ProtectedRoute from './components/ProtectedRoute';

import HomePage from './pages/HomePage';
import ApartmentsPage from './pages/ApartmentsPage';
import ComplexesPage from './pages/ComplexesPage';
import ComplexPage from './pages/ComplexPage';
import ApartmentPage from './pages/ApartmentPage';
import AuthPage from './pages/AuthPage';
import AdminPage from './pages/AdminPage';

function ScrollToTop() {
  const {pathname} = useLocation();

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
        // Load data from API
        const [flats, homes] = await Promise.all([
          PublicService.getFlats(),
          PublicService.getHomes()
        ]);

        // Transform API data to legacy format for compatibility
        const apartments = flats.map(flat => ({
          id: flat.id,
          complex: flat.home?.name || "Неизвестный комплекс",
          complexId: flat.homeId,
          address: flat.home?.address || "Адрес не указан",
          rooms: flat.rooms,
          floor: flat.floor,
          bathroom: "Совмещенный", // Default value
          bathrooms: 1, // Default value
          finishing: "Чистовая", // Default value
          isHot: false, // Default value
          image: flat.photos?.[0]?.url || "/images/default-apartment.jpg",
          price: flat.price,
          area: flat.area,
          description: flat.description,
          hasParks: flat.home?.amenities?.includes("Парковка") || false,
          hasSchools: flat.home?.amenities?.includes("Школа") || false,
          hasShops: flat.home?.amenities?.includes("Магазины") || false,
          distanceFromCenter: 5.0, // Default value
          layout: flat.photos?.[0]?.url || "/images/default-apartment.jpg",
          images: flat.photos?.map(photo => photo.url) || []
        }));

        const complexes = homes.map(home => ({
          id: home.id,
          name: home.name,
          address: home.address,
          description: home.description,
          image: home.photos?.[0]?.url || "/images/default-complex.jpg",
          images: home.photos?.map(photo => photo.url) || [],
          apartments: apartments.filter(apt => apt.complexId === home.id),
          amenities: home.amenities || [],
          features: home.amenities || [], // Map amenities to features for compatibility
          constructionHistory: {
            startDate: "2020-01-01", // Default values
            endDate: "2024-12-31",
            phases: [
              {
                name: "Строительство",
                date: "2020-01-01",
                description: "Строительные работы"
              }
            ]
          }
        }));

        setApartments(apartments);
        setComplexes(complexes);
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
      <ScrollToTop />
      <ScrollToAnchor />
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />

        <main className="flex-grow">
          <Routes>
            <Route
              path="/"
              element={<HomePage />}
            />
            <Route
              path="/auth"
              element={<AuthPage />}
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <AdminPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/apartments"
              element={<ApartmentsPage />}
            />
            <Route
              path="/complexes"
              element={<ComplexesPage />}
            />
            <Route
              path="/complex/:complexName"
              element={<ComplexPage />}
            />
            <Route
              path="/apartment/:apartmentId"
              element={<ApartmentPage />}
            />
            <Route
              path="*"
              element={
                <div className="flex items-center justify-center min-h-[400px]">
                  <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                    <p className="text-gray-600">Страница не найдена</p>
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