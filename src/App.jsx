import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import Home from './pages/Home';
import Cars from './pages/Cars';
import CarDetail from './pages/CarDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import NoPage from './pages/NoPage';
import ProtectedRoute from './middleware/ProtectedRoute';
import './App.css';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/cars" element={<Cars />} />
        <Route path="/cars/:carId" element={<CarDetail />} />
        {/* <Route path="/about" element={<About />} /> */}
        <Route path="/contact" element={<Contact />} />

        {/* Admin Authentication & Protected Dashboard */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* 404 Fallback */}
        <Route path="*" element={<NoPage />} />
      </Routes>
     <Footer
  contactEmail="YOUR_EXISTING_EMAIL"
  address="YOUR_EXISTING_DEALERSHIP_ADDRESS"
  socialLinks={{
    Facebook: "YOUR_FACEBOOK_URL",
    Instagram: "YOUR_INSTAGRAM_URL",
    LinkedIn: "YOUR_LINKEDIN_URL",
    X: "YOUR_X_URL"
  }}
  privacyPath="/privacy-policy"
  termsPath="/terms"
/>
      <FloatingWhatsApp />
    </>
  );
}

export default App;
