import { Compass } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white text-gray-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center">
              <Compass className="h-8 w-8 text-green-600" />
              <span className="ml-2 font-bold text-xl text-gray-900">Wisata Banjarpanepen</span>
            </div>
            <p className="mt-4">Jelajahi keindahan dan budaya Desa Banjarpanepen bersama kami.</p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Menu</h3>
            <div className="space-y-2">
              <Link to="/" className="block hover:text-green-600 transition-colors">Home</Link>
              <Link to="/wisata" className="block hover:text-green-600 transition-colors">Wisata</Link>
              <Link to="/agenda" className="block hover:text-green-600 transition-colors">Agenda</Link>
              <Link to="/galeri" className="block hover:text-green-600 transition-colors">Galeri</Link>
              <Link to="/contact" className="block hover:text-green-600 transition-colors">Contact</Link>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Kontak</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 mt-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                <span>+62 812-3456-7890</span>
              </div>
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <span>info@banjarpanepen.desa.id</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-8 text-center">
          <p>&copy; {new Date().getFullYear()} Desa Banjarpanepen. Hak Cipta Dilindungi oleh Telkom University Purwokerto.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;