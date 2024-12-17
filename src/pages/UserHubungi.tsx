import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import PageHeader from '../components/shared/PageHeader';

export default function UserHubungi() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Watermark */}
      <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center">
        <img 
          src="/assets/logo.png" 
          alt="Watermark"
          className="w-120 h-96 opacity-5"
        />
      </div>

      <div className="relative">
        <div className="absolute inset-0 bg-green-600 opacity-10 pattern-dots"></div>
        <PageHeader
          title="Hubungi Kami"
          subtitle="Hubungi tim kami untuk merencanakan kunjungan Anda ke Desa Wisata Banjarpanepen"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Informasi Kontak</h2>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4 group">
                      <div className="bg-green-100 p-3 rounded-lg group-hover:bg-green-200 transition-colors">
                        <Mail className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Email</h3>
                        <a href="mailto:info@wisatabanjarpanepen.com" className="mt-1 text-gray-600 hover:text-green-600 block transition-colors">
                          info@wisatabanjarpanepen.com
                        </a>
                        <a href="mailto:support@wisatabanjarpanepen.com" className="mt-1 text-gray-600 hover:text-green-600 block transition-colors">
                          support@wisatabanjarpanepen.com
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4 group">
                      <div className="bg-green-100 p-3 rounded-lg group-hover:bg-green-200 transition-colors">
                        <Phone className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Telepon</h3>
                        <a href="tel:+62811234567" className="mt-1 text-gray-600 hover:text-green-600 block transition-colors">
                          +62 81 1234 567 (Telepon)
                        </a>
                        <a href="tel:+62822345678" className="mt-1 text-gray-600 hover:text-green-600 block transition-colors">
                          +62 82 2345 678 (WhatsApp)
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-start space-x-4 group">
                      <div className="bg-green-100 p-3 rounded-lg group-hover:bg-green-200 transition-colors">
                        <MapPin className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Alamat Kantor</h3>
                        <p className="mt-1 text-gray-600">
                          Jl. Nama Jalan No. 123<br />
                          Kecamatan Nama Kecamatan, 12345<br />
                          Indonesia
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4 group">
                      <div className="bg-green-100 p-3 rounded-lg group-hover:bg-green-200 transition-colors">
                        <Clock className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Jam Operasional</h3>
                        <div className="mt-1 space-y-1 text-gray-600">
                          <p>Senin - Jumat: 09:00 - 17:00 WIB</p>
                          <p>Sabtu: 09:00 - 15:00 WIB</p>
                          <p>Minggu: Tutup</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden h-full">
              <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Lokasi Kami</h2>
                <div className="aspect-w-16 aspect-h-9 rounded-xl overflow-hidden">
                  <iframe 
                    src="https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=Banjarpanepen&zoom=12&maptype=satellite"
                    width="100%"
                    height="400"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="rounded-xl"
                  ></iframe>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}