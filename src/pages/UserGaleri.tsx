import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PageHeader from '../components/shared/PageHeader';
import axios from 'axios';

interface GalleryItem {
  id: number;
  judul: string;
  deskripsi: string;
  imageUrl: string;
  tanggal: string;
}

export default function UserGaleri() {
  const [galleries, setGalleries] = useState<GalleryItem[]>([]);
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  useEffect(() => {
    const fetchGalleries = async () => {
      try {
        const response = await axios.get(import.meta.env.VITE_GALLERY_API);
        setGalleries(response.data as GalleryItem[]);
      } catch (error) {
        console.error('Error fetching galleries:', error);
      }
    };

    fetchGalleries();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Watermark */}
      <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center">
        <img 
          src="/assets/logo.png" 
          alt="Watermark"
          className="w-120 h-96 opacity-5"
        />
      </div>

      <div className="relative">
        <div className="absolute inset-0 bg-purple-600 opacity-10 pattern-dots"></div>
        <PageHeader
          title="Galeri Foto"
          subtitle="Koleksi momen-momen indah dari berbagai destinasi wisata"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
          {galleries.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="break-inside-avoid mb-4"
              onClick={() => setSelectedImage(item)}
            >
              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer group">
                <div className="relative overflow-hidden">
                  <img
                    src={item.imageUrl.startsWith('http') ? item.imageUrl : `${import.meta.env.VITE_PUBLIC_URL}${item.imageUrl}`}
                    alt={item.judul}
                    className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                    <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Lihat Detail
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-gray-900 text-lg font-semibold mb-2 line-clamp-1">{item.judul}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.deskripsi}</p>
                  <div className="flex items-center text-purple-600 text-sm">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {new Date(item.tanggal).toLocaleDateString('id-ID', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal untuk tampilan detail */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-4xl w-full bg-white rounded-xl overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <img
              src={selectedImage.imageUrl.startsWith('http') ? selectedImage.imageUrl : `${import.meta.env.VITE_PUBLIC_URL}${selectedImage.imageUrl}`}
              alt={selectedImage.judul}
              className="w-full h-auto max-h-[70vh] object-contain"
            />
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">{selectedImage.judul}</h2>
              <p className="text-gray-600 mb-4">{selectedImage.deskripsi}</p>
              <div className="text-purple-600 text-sm">
                {new Date(selectedImage.tanggal).toLocaleDateString('id-ID', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}