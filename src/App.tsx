import {BrowserRouter, Routes, Route} from 'react-router-dom';
import {useEffect, useState} from 'react';

import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/home_page/HomePage';
import ComplexPage from './pages/complex_page/ComplexPage';
import ApartmentPage from './pages/apartment_page/ApartmentPage';
import PageLoader from './components/PageLoader';

import './App.css';

function App() {
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsInitialLoad(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isInitialLoad) return <PageLoader />;

  return (
    <BrowserRouter>
      <div className="App">
        <Header
          showOnHomePage={true}
          isScrolled={isScrolled}
        />

        <Routes>
          <Route
            path="/"
            element={<HomePage />}
          />
          <Route
            path="/complex"
            element={<ComplexPage />}
          />
          <Route
            path="/apartment"
            element={<ApartmentPage />}
          />
          <Route
            path="*"
            element={<div>Страница не найдена</div>}
          />
        </Routes>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;