import {BrowserRouter, Routes, Route, useLocation} from 'react-router-dom';
import {useEffect} from 'react';

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

import {useUIStore} from "./store";

function ScrollToTop() {
  const {pathname} = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  const loading = useUIStore(state => state.loading);
  const setLoading = useUIStore(state => state.setLoading);
  const modals = useUIStore(state => state.modals);

  const loadPageInfo = useUIStore(state => state.loadPageInfo);
  const loadSocialMediaList = useUIStore(state => state.loadSocialMediaList)


  useEffect(() => {
    const loadData = async () => {
      setLoading('global', true);
      try {
        await Promise.all([loadPageInfo(), loadSocialMediaList()]);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setTimeout(() => setLoading('global', false), 100);
      }
    };

    loadData();
  }, [loadPageInfo, loadSocialMediaList, setLoading]);

  if (loading.global) {
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
        {modals.bid && <BookingModal />}
      </div>
    </BrowserRouter>
  );
}

export default App;