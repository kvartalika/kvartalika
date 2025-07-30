import {BrowserRouter, Routes, Route, useLocation} from 'react-router-dom';
import {useEffect} from 'react';
import {useAppStore} from './store/useAppStore';

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

// import { apartmentsApi, complexesApi } from './api';

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
        // TODO: Replace with actual API calls
        // const [apartmentsData, complexesData] = await Promise.all([
        //   apartmentsApi.getApartments(),
        //   complexesApi.getComplexes()
        // ]);

        const mockApartments = [
          {
            id: 1,
            complex: "ЖК Янтарный",
            complexId: 1,
            address: "ул. Примерная, 10",
            rooms: 2,
            floor: 5,
            bathroom: "Совмещенный",
            bathrooms: 1,
            finishing: "Чистовая",
            isHot: true,
            image: "/images/test.png",
            price: 5500000,
            area: 65.5,
            description: "Уютная двухкомнатная квартира с современным ремонтом",
            hasParks: true,
            hasSchools: true,
            hasShops: false,
            distanceFromCenter: 5.2,
            layout: "/images/test.png",
            images: ["/images/test.png", "/images/test.png", "/images/test.png"]
          },
          {
            id: 2,
            complex: "ЖК Янтарный",
            complexId: 1,
            address: "ул. Примерная, 10",
            rooms: 3,
            floor: 8,
            bathroom: "Раздельный",
            bathrooms: 2,
            finishing: "Под ключ",
            isHot: false,
            image: "/images/test.png",
            price: 7800000,
            area: 85.2,
            description: "Просторная трёхкомнатная квартира с панорамными окнами",
            hasParks: true,
            hasSchools: true,
            hasShops: true,
            distanceFromCenter: 5.2,
            layout: "/images/test.png",
            images: ["/images/test.png", "/images/test.png", "/images/test.png"]
          },
          {
            id: 3,
            complex: "ЖК Нижний",
            complexId: 2,
            address: "ул. Речная, 25",
            rooms: 1,
            floor: 12,
            bathroom: "Совмещенный",
            bathrooms: 1,
            finishing: "Черновая",
            isHot: true,
            image: "/images/test.png",
            price: 3200000,
            area: 42.1,
            description: "Компактная однокомнатная квартира в новом доме",
            hasParks: false,
            hasSchools: false,
            hasShops: true,
            distanceFromCenter: 12.8,
            layout: "/images/test.png",
            images: ["/images/test.png", "/images/test.png", "/images/test.png"]
          },
          {
            id: 4,
            complex: "ЖК Нижний",
            complexId: 2,
            address: "ул. Речная, 25",
            rooms: 2,
            floor: 15,
            bathroom: "Раздельный",
            bathrooms: 1,
            finishing: "Дизайнерская",
            isHot: false,
            image: "/images/test.png",
            price: 6200000,
            area: 68.7,
            description: "Стильная двухкомнатная квартира с дизайнерским ремонтом",
            hasParks: false,
            hasSchools: true,
            hasShops: false,
            distanceFromCenter: 12.8,
            layout: "/images/test.png",
            images: ["/images/test.png", "/images/test.png", "/images/test.png"]
          },
          {
            id: 5,
            complex: "ЖК Солнечный",
            complexId: 3,
            address: "пр. Солнечный, 14",
            rooms: 3,
            floor: 6,
            bathroom: "Раздельный",
            bathrooms: 2,
            finishing: "Чистовая",
            isHot: true,
            image: "/images/test.png",
            price: 8900000,
            area: 95.4,
            description: "Элитная трёхкомнатная квартира в престижном районе",
            hasParks: true,
            hasSchools: true,
            hasShops: true,
            distanceFromCenter: 2.1,
            layout: "/images/test.png",
            images: ["/images/test.png", "/images/test.png", "/images/test.png"]
          }
        ];

        const mockComplexes = [
          {
            id: 1,
            name: "ЖК Янтарный",
            address: "ул. Примерная, 10",
            description: "Современный жилой комплекс в центре города с развитой инфраструктурой",
            image: "/images/test.png",
            images: [
              "/images/test.png",
              "/images/test.png",
              "/images/test.png",
              "/images/test.png",
            ],
            apartments: mockApartments.filter(apt => apt.complexId === 1),
            amenities: ["Подземная парковка", "Детская площадка", "Фитнес-центр", "Консьерж-сервис"],
            features: ["Монолитно-кирпичная конструкция", "Высокие потолки 3.2м", "Панорамное остекление", "Индивидуальное отопление", "Приточно-вытяжная вентиляция", "Оптоволоконный интернет"],
            constructionHistory: {
              startDate: "2021-03-01",
              endDate: "2024-12-01",
              phases: [
                {
                  name: "Начало строительства",
                  date: "2021-03-01",
                  description: "Получение разрешений и начало земляных работ"
                },
                {
                  name: "Фундамент",
                  date: "2021-06-01",
                  description: "Завершение работ по устройству фундамента"
                },
                {
                  name: "Возведение каркаса",
                  date: "2022-12-01",
                  description: "Завершение монолитных работ и возведение стен"
                },
                {
                  name: "Инженерные системы",
                  date: "2023-08-01",
                  description: "Монтаж всех инженерных коммуникаций"
                },
                {
                  name: "Отделочные работы",
                  date: "2024-06-01",
                  description: "Завершение внутренних отделочных работ"
                },
                {
                  name: "Сдача в эксплуатацию",
                  date: "2024-12-01",
                  description: "Получение разрешения на ввод в эксплуатацию"
                }
              ]
            }
          },
          {
            id: 2,
            name: "ЖК Нижний",
            address: "ул. Речная, 25",
            description: "Жилой комплекс бизнес-класса на берегу реки с панорамными видами",
            image: "/images/test.png",
            images: [
              "/images/test.png",
              "/images/test.png",
              "/images/test.png",
            ],
            apartments: mockApartments.filter(apt => apt.complexId === 2),
            amenities: ["Видеонаблюдение", "Закрытая территория", "Спа-центр", "Кафе"],
            features: ["Кирпично-монолитная конструкция", "Французские балконы", "Видеодомофон", "Центральное кондиционирование", "Система умный дом"],
            constructionHistory: {
              startDate: "2020-01-15",
              endDate: "2023-09-01",
              phases: [
                {
                  name: "Проектирование",
                  date: "2020-01-15",
                  description: "Разработка архитектурного проекта"
                },
                {
                  name: "Строительство",
                  date: "2020-08-01",
                  description: "Начало строительных работ"
                },
                {
                  name: "Завершение строительства",
                  date: "2023-06-01",
                  description: "Окончание всех строительных работ"
                },
                {
                  name: "Ввод в эксплуатацию",
                  date: "2023-09-01",
                  description: "Получение всех необходимых разрешений"
                }
              ]
            }
          },
          {
            id: 3,
            name: "ЖК Солнечный",
            address: "пр. Солнечный, 14",
            description: "Элитный жилой комплекс с премиальными квартирами и услугами",
            image: "/images/test.png",
            images: [
              "/images/test.png",
              "/images/test.png",
              "/images/test.png",
              "/images/test.png",
              "/images/test.png",
            ],
            apartments: mockApartments.filter(apt => apt.complexId === 3),
            amenities: ["Консьерж 24/7", "Подземный паркинг", "Бассейн", "Детский сад"],
            features: ["Премиальная отделка", "Потолки 3.5м", "Панорамные окна", "Климат-контроль", "Система безопасности", "Лифты OTIS"],
            constructionHistory: {
              startDate: "2019-05-01",
              endDate: "2022-12-01",
              phases: [
                {
                  name: "Начало проекта",
                  date: "2019-05-01",
                  description: "Получение земельного участка и разрешений"
                },
                {
                  name: "Фундаментные работы",
                  date: "2019-10-01",
                  description: "Устройство фундамента и подземных уровней"
                },
                {
                  name: "Строительство корпуса",
                  date: "2021-03-01",
                  description: "Возведение основного здания"
                },
                {
                  name: "Инженерия и отделка",
                  date: "2022-06-01",
                  description: "Монтаж инженерных систем и отделочные работы"
                },
                {
                  name: "Благоустройство",
                  date: "2022-10-01",
                  description: "Благоустройство территории и ландшафтный дизайн"
                },
                {
                  name: "Ввод в эксплуатацию",
                  date: "2022-12-01",
                  description: "Получение разрешения на ввод в эксплуатацию"
                }
              ]
            }
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