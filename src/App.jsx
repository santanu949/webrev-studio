import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

// Components & Pages (Ensure karein ki ye paths aapke folders se match karte hon)
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection'; 
import AdminDashboard from './pages/AdminDashboard'; 

function App() { 
  // URL check karne ke liye: kya current route '/admin' se start hota hai?
  const isAdminRoute = useLocation().pathname.startsWith('/admin');

  return (
    <div className="app-container bg-[#fafafa]">
      
      {/* Agar admin route NAHI hai, tabhi Navbar dikhega */}
      {!isAdminRoute && <Navbar />} 
      
      <Routes>
        {/* MAIN USER FACING WEBSITE */}
        <Route path='/' element={<HeroSection />} />

        {/* SECURE ADMIN DASHBOARD (Bina normal Navbar ke) */}
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>

    </div>
  );
}

export default App;