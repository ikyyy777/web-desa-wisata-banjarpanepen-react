import React, { useState } from 'react';
import { Menu, X, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm fixed w-full z-50 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img src="/assets/logo.png" alt="Logo Wisata Banjarpanepen" className="h-12" />
            </Link>
          </div>
          
          <div className="hidden md:flex items-center">
            <div className="ml-10 flex items-baseline space-x-4">
              <NavLink to="/">Desa</NavLink>
              <NavLink to="/wisata">Wisata</NavLink>
              <NavLink to="/agenda">Agenda</NavLink>
              <NavLink to="/galeri">Galeri</NavLink>
              <NavLink to="/hubungi-kami">Hubungi Kami</NavLink>
            </div>
          </div>
          
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-green-700"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-gray-50">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <MobileNavLink to="/">Desa</MobileNavLink>
            <MobileNavLink to="/wisata">Wisata</MobileNavLink>
            <MobileNavLink to="/agenda">Agenda</MobileNavLink>
            <MobileNavLink to="/galeri">Galeri</MobileNavLink>
            <MobileNavLink to="/hubungi-kami">Hubungi Kami</MobileNavLink>
          </div>
        </div>
      )}
    </nav>
  );
}

const NavLink = ({ to, children }: { to: string; children: React.ReactNode }) => (
  <Link
    to={to}
    className="text-gray-600 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
  >
    {children}
  </Link>
);

const MobileNavLink = ({ to, children }: { to: string; children: React.ReactNode }) => (
  <Link
    to={to}
    className="text-gray-600 hover:text-green-600 block px-3 py-2 rounded-md text-base font-medium"
  >
    {children}
  </Link>
);