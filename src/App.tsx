import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom'
import { useEffect, lazy, Suspense } from 'react'

import Header from './components/Header'
import Footer from './components/Footer'
import PageLoader from './components/PageLoader'
import BookingModal from './components/BookingModal'
import ScrollToAnchor from './components/ScrollToAnchor'
import ProtectedRoute from './components/ProtectedRoute'

const HomePage = lazy(() => import('./pages/HomePage'))
const ApartmentsPage = lazy(() => import('./pages/ApartmentsPage'))
const ComplexesPage = lazy(() => import('./pages/ComplexesPage'))
const ComplexPage = lazy(() => import('./pages/ComplexPage'))
const ApartmentPage = lazy(() => import('./pages/ApartmentPage'))
const AuthPage = lazy(() => import('./pages/AuthPage'))
const AdminPage = lazy(() => import('./components/admin/AdminPage.tsx'))
const ContentManagementPage = lazy(() => import('./components/content/ContentManagementPage.tsx'))
const PrivacyPage = lazy(() => import('./pages/PrivacyPage.tsx'))

import { useAuthStore } from './store/auth.store.ts'
import RouterListener from './components/RouterListener.tsx'
import { useUIStore } from './store/ui.store.ts'
import { useFlatsStore } from './store/flats.store.ts'

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

const InnerApp = () => {
  const globalLoading = useUIStore(state => state.loading.global)
  const setLoading = useUIStore(state => state.setLoading)
  const modals = useUIStore(state => state.modals)

  const loadPageInfo = useUIStore(state => state.loadPageInfo)
  const loadSocialMediaList = useUIStore(state => state.loadSocialMediaList)
  const pageInfo = useUIStore(state => state.pageInfo)

  const loadAllData = useFlatsStore(state => state.loadAllData)

  const { role, isAuthenticated } = useAuthStore()
  const location = useLocation()

  useEffect(() => {
    const loadData = async () => {
      setLoading('global', true)
      try {
        await Promise.all([loadPageInfo(), loadSocialMediaList()])
      } catch (error) {
        console.error('Error loading data:', error)
      }
    }

    loadData().then(() => {
      void loadAllData(true)
      setTimeout(() => setLoading('global', false), 500)
    })
  }, [loadAllData, loadPageInfo, loadSocialMediaList, setLoading])

  const shouldShowLoader =
    (!['/auth', '/admin', '/content'].includes(location.pathname)) &&
    (
      globalLoading ||
      (
        !pageInfo?.published &&
        (
          !isAuthenticated ||
          (role !== 'ADMIN' && role !== 'CONTENT_MANAGER')
        )
      )
    )

  if (shouldShowLoader) {
    return <PageLoader />
  }

  return (
    <>
      <ScrollToTop />
      <ScrollToAnchor />
      <div className="min-h-screen flex flex-col bg-surface-50">
        <Header />

        <main className="flex-grow">
          <Suspense fallback={<PageLoader />}>
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
                  <ProtectedRoute requiredRole={['CONTENT_MANAGER', 'ADMIN']}>
                    <AdminPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/content"
                element={
                  <ProtectedRoute requiredRole={['CONTENT_MANAGER', 'ADMIN']}>
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
                path="/privacy"
                element={<PrivacyPage />}
              />
              <Route
                path="*"
                element={
                  <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                      <h1 className="text-4xl font-bold text-surface-900 mb-4">404</h1>
                      <p className="text-surface-600">Страница не найдена</p>
                    </div>
                  </div>
                }
              />
            </Routes>
          </Suspense>
        </main>

        <Footer />
        {modals.bid && <BookingModal />}
      </div>
      <RouterListener />
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <InnerApp />
    </BrowserRouter>
  )
}

export default App