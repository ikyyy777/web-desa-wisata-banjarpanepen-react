import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Toaster } from 'react-hot-toast'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/Footer'

// Pages
import Home from '../pages/UserHome'
import Wisata from '../pages/UserWisata'
import Agenda from '../pages/UserAgenda'
import Galeri from '../pages/UserGaleri'
import HubungiKami from '../pages/UserHubungi'
import AdminLogin from '../pages/AdminLogin'
import AdminDashboard from '../pages/AdminPanel'
import WisataArtikel from '../pages/UserWisataArtikel'
import Error from '../components/Error'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? children : <Navigate to="/admin/login" />
}

export const Index = () => {
  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#333',
            color: '#fff',
          },
          success: {
            duration: 3000,
          },
          error: {
            duration: 4000,
          },
        }}
      />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/wisata" element={<Wisata />} />
        <Route path="/agenda" element={<Agenda />} />
        <Route path="/galeri" element={<Galeri />} />
        <Route path="/hubungi-kami" element={<HubungiKami />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route 
          path="/admin/*" 
          element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          } 
        />
        <Route path="/wisata/:slug" element={<WisataArtikel />} />
        <Route path="*" element={<Error statusCode={404} />} />
      </Routes>
      <Footer />
    </div>
  )
}
