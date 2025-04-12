import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // Import AuthProvider
import './App.css';
import Navbar from './components/Navbar';
import HeroCarousel from './components/HeroCarousel';
import ServicesSection from './components/ServicesSection';
import LookingForSection from './components/LookingForSection';
import CustomersSay from './components/CustomersSays';
import Footer from './components/Footer';
import CarLandingPage from './components/CarLandingPage';
import BikeLandingPage from './components/BikeLandingPage';
import GasLandingPage from './components/GasLandingPage';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';

const AppContent = () => {
  const location = useLocation();
  const hideNavbar = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <div className="App">
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route
          path="/"
          element={
            <>
              <HeroCarousel />
              <ServicesSection />
              <LookingForSection />
              <CustomersSay />
              <Footer />
            </>
          }
        />
        <Route path="/car" element={<CarLandingPage />} />
        <Route path="/bike" element={<BikeLandingPage />} />
        <Route path="/gas" element={<GasLandingPage />} />
        <Route path="/Community" element={
            <>
            
              <Footer />
            </>
          } />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;