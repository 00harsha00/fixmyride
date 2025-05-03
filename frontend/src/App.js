import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
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
import CartPage from './components/CartPage';
import WishlistPage from './components/WishlistPage';
import PaymentPage from './components/PaymentPage';
import OrdersPage from './components/OrdersPage';
import AdminPanel from './components/AdminPanel';
import ProtectedRoute from './components/ProtectedRoute';
import CommunityPage from './components/CommunityPage';

const AppContent = () => {
  const location = useLocation();
  const hideNavbar = ['/login', '/signup', '/admin'].includes(location.pathname);
  const hideFooter = ['/login', '/signup', '/admin'].includes(location.pathname);

  return (
    <div className="app-container">
      {!hideNavbar && <Navbar />}
      <main className="main-content">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <HeroCarousel />
                <ServicesSection />
                <LookingForSection />
                <CustomersSay />
              </>
            }
          />
          <Route path="/car" element={<CarLandingPage />} />
          <Route path="/bike" element={<BikeLandingPage />} />
          <Route path="/gas" element={<GasLandingPage />} />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wishlist"
            element={
              <ProtectedRoute>
                <WishlistPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment"
            element={
              <ProtectedRoute>
                <PaymentPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <OrdersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminPanel />
              </ProtectedRoute>
            }
          />
           <Route path="/login" element={<LoginPage />} />
           <Route path="/signup" element={<SignupPage />} />
           <Route path="/community" element={<CommunityPage />} />
        </Routes>
      </main>
      {!hideFooter && <Footer />}
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