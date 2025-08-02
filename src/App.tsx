import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';
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
import AdminPage from './components/admin/AdminPage.tsx';

import {useAuthStore, useFlatsStore, useUIStore} from "./store";
import ContentManagementPage
  from "./components/content/ContentManagementPage.tsx";
import RouterListener from "./components/RouterListener.tsx";

function ScrollToTop() {
  const {pathname} = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

const InnerApp = () => {
  const loading = useUIStore(state => state.loading);
  const setLoading = useUIStore(state => state.setLoading);
  const modals = useUIStore(state => state.modals);

  const loadPageInfo = useUIStore(state => state.loadPageInfo);
  const loadSocialMediaList = useUIStore(state => state.loadSocialMediaList);
  const pageInfo = useUIStore(state => state.pageInfo);

  const loadAllData = useFlatsStore(state => state.loadAllData);

  const {role, isAuthenticated} = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    const loadData = async () => {
      setLoading('global', true);
      try {
        await Promise.all([loadPageInfo(), loadSocialMediaList()]);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData().then(() => {
      void loadAllData();
      setLoading('global', false);
    })
  }, [loadAllData, loadPageInfo, loadSocialMediaList, setLoading]);

  const shouldShowLoader =
    (!['/auth', '/admin', '/content'].includes(location.pathname)) &&
    (
      loading.global ||
      (
        !pageInfo?.published &&
        (
          !isAuthenticated ||
          (role !== 'ADMIN' && role !== 'CONTENT_MANAGER')
        )
      )
    );

  if (shouldShowLoader) {
    return <PageLoader />;
  }

  return (
    <>
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
              path="/content"
              element={
                <ProtectedRoute requiredRole={["CONTENT_MANAGER", "ADMIN"]}>
                  <ContentManagementPage />
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
              path="/complex/:homeId"
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
      <RouterListener />
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <InnerApp />
    </BrowserRouter>
  );
}

export default App;