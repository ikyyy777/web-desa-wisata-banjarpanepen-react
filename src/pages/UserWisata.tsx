import { useState, useEffect } from 'react';
import PageHeader from '../components/shared/PageHeader';
import Card from '../components/shared/Card';
import { motion } from 'framer-motion';

interface Wisata {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  kategori?: string;
  slug: string;
}

function createSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export default function UserWisata() {
  const [wisata, setWisata] = useState<Wisata[]>([]);
  const [categories, setCategories] = useState<string[]>(['semua']);
  const [selectedCategory, setSelectedCategory] = useState<string>('semua');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(import.meta.env.VITE_WISATA_CATEGORY_API, {
          method: 'GET'
        });
        const data = await response.json();
        
        if (Array.isArray(data)) {
          setCategories(['semua', ...data]);
        } else if (data.status === 'error') {
          console.error('Error dari server:', data.message);
          setCategories(['semua']);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories(['semua']);
      }
    };

    const fetchWisata = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(import.meta.env.VITE_WISATA_API);
        const data = await response.json();
        const wisataWithUpdates = data.map((wis: any) => ({
          ...wis,
          price: Number(wis.price),
          imageUrl: wis.imageUrl.startsWith('http') ? wis.imageUrl : `${import.meta.env.VITE_PUBLIC_URL}${wis.imageUrl}`,
          slug: createSlug(wis.title)
        }));
        setWisata(wisataWithUpdates.map((wis: Wisata) => ({
          ...wis,
          price: wis.price === 0 ? 'Gratis' : `Rp${wis.price.toLocaleString('id-ID')}`
        })));
      } catch (error) {
        console.error('Error fetching wisata:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
    fetchWisata();
  }, []);
  
  const filteredWisata = selectedCategory === 'semua' 
    ? wisata
    : wisata.filter(wis => wis.kategori?.toLowerCase() === selectedCategory.toLowerCase());

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
          title="Wisata Banjarpanepen"
          subtitle="Temukan Keindahan Alam & Budaya"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-green-100"></div>
            <div className="w-16 h-16 rounded-full border-4 border-t-green-600 animate-spin absolute top-0"></div>
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6 mb-12 sticky top-20 z-10"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Kategori Wisata</h3>
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105
                    ${selectedCategory === category 
                      ? 'bg-green-600 text-white shadow-lg shadow-green-200' 
                      : 'bg-green-50 text-green-700 hover:bg-green-100'
                    }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredWisata.map((wis, index) => (
              <motion.div
                key={wis.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card {...wis} />
              </motion.div>
            ))}
          </div>

          {filteredWisata.length === 0 && (
            <div className="text-center py-12">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-gray-500 text-lg"
              >
                Tidak ada wisata dalam kategori ini
              </motion.div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
