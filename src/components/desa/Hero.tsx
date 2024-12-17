import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

const images = [
  'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba',
  'https://images.unsplash.com/photo-1682687221038-404670f09ef1',
  'https://images.unsplash.com/photo-1682687220063-4742bd7fd538'
];

export default function Hero() {
  const scrollToProfile = () => {
    const profileSection = document.getElementById('profile-desa');
    if (profileSection) {
      profileSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Background Slider */}
      <div className="absolute inset-0">
        <div className="relative h-full overflow-hidden">
          {images.map((image, index) => (
            <motion.div
              key={index}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.2 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
            >
              <img
                src={`${image}?auto=format&fit=crop&w=2000&q=80`}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="relative h-screen flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg">
            Desa Wisata
            <span className="block text-green-400">Banjarpanepen</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-200 mb-12 max-w-2xl mx-auto leading-relaxed">
            Jelajahi keindahan alam dan budaya Banjarpanepen yang menakjubkan
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-green-500 text-white rounded-full font-semibold text-lg flex items-center justify-center hover:bg-green-600 transition-all duration-300 shadow-lg"
              onClick={() => window.location.href = '/wisata'}
            >
              Mulai Menjelajah
              <ChevronRight className="ml-2 h-6 w-6" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white/20 backdrop-blur-sm text-white rounded-full font-semibold text-lg hover:bg-white/30 transition-all duration-300"
              onClick={scrollToProfile}
            >
              Tentang Kami
            </motion.button>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute bottom-10 flex flex-col items-center"
        >
          <div className="w-6 h-10 border-2 border-white rounded-full flex flex-col items-center">
            <motion.div 
              className="w-1 h-3 bg-white rounded-full mt-1"
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
          <p className="text-white text-sm mt-2">Scroll Kebawah</p>
        </motion.div>
      </div>
    </div>
  );
}