import { motion } from 'framer-motion';

export default function ProfileDesa() {
  return (
    <section id="profile-desa" className="bg-gray-50 py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Profil Desa Banjarpanepen
          </h2>
          <div className="w-20 h-1 bg-green-600 mx-auto"></div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <p className="text-gray-600 leading-relaxed">
              Desa Banjarpanepen merupakan salah satu desa yang terletak di Kecamatan Sumpiuh, 
              Kabupaten Banyumas, Provinsi Jawa Tengah. Desa ini memiliki keunikan tersendiri 
              dengan kekayaan alam dan budaya yang masih terjaga dengan baik.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Dengan luas wilayah sekitar X hektar, Desa Banjarpanepen dikelilingi oleh 
              pemandangan alam yang memukau, mulai dari area persawahan yang membentang hijau 
              hingga perbukitan yang menyajikan panorama indah.
            </p>
            <motion.button
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-green-600 text-white px-6 py-2 rounded-full font-semibold 
                hover:bg-green-700 transition-colors"
            >
              Pelajari Lebih Lanjut
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-4"
          >
            <div className="space-y-4">
              <div className="bg-gray-100 p-6 rounded-lg shadow-sm">
                <h3 className="text-green-600 text-4xl font-bold mb-2">1.234</h3>
                <p className="text-gray-800">Jumlah Penduduk</p>
              </div>
              <div className="bg-gray-100 p-6 rounded-lg shadow-sm">
                <h3 className="text-green-600 text-4xl font-bold mb-2">5+</h3>
                <p className="text-gray-800">Destinasi Wisata</p>
              </div>
            </div>
            <div className="space-y-4 mt-8">
              <div className="bg-gray-100 p-6 rounded-lg shadow-sm">
                <h3 className="text-green-600 text-4xl font-bold mb-2">10+</h3>
                <p className="text-gray-800">UMKM Aktif</p>
              </div>
              <div className="bg-gray-100 p-6 rounded-lg shadow-sm">
                <h3 className="text-green-600 text-4xl font-bold mb-2">3+</h3>
                <p className="text-gray-800">Budaya Lokal</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}