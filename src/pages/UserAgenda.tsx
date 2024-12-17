import { useState, useEffect } from 'react';
import axios from 'axios';
import PageHeader from '../components/shared/PageHeader';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin } from 'lucide-react';

interface Agenda {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
}

export default function UserAgenda() {
  const [agendaList, setAgendaList] = useState<Agenda[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const formatDate = (dateStr: string) => {
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    const date = new Date(dateStr);
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const formatTime = (timeStr: string) => {
    return timeStr.substring(0, 5);
  };

  const isEventPassed = (dateStr: string) => {
    const eventDate = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return eventDate < today;
  };

  useEffect(() => {
    const fetchAgenda = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get<Agenda[]>(import.meta.env.VITE_AGENDA_API);
        const sortedAgenda = response.data.sort((a, b) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
        setAgendaList(sortedAgenda);
      } catch (error) {
        console.error('Error fetching agenda:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAgenda();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white relative">
      {/* Watermark */}
      <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center">
        <img 
          src="/assets/logo.png" 
          alt="Watermark"
          className="w-120 h-96 opacity-5"
        />
      </div>

      <div className="relative z-10">
        <div className="absolute inset-0 bg-blue-600 opacity-10 pattern-dots"></div>
        <PageHeader
          title="Agenda Desa"
          subtitle="Jadwal Kegiatan & Acara Mendatang"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[60vh] relative z-10">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-blue-100"></div>
            <div className="w-16 h-16 rounded-full border-4 border-t-blue-600 animate-spin absolute top-0"></div>
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
          <div className="grid gap-8">
            {agendaList.map((agenda, index) => (
              <motion.div
                key={agenda.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className="md:flex">
                  <div className={`md:w-1/4 p-6 flex flex-col justify-center items-center text-center ${
                    isEventPassed(agenda.date) ? 'bg-red-50' : 'bg-blue-50'
                  }`}>
                    <span className={`text-lg font-semibold mb-2 ${
                      isEventPassed(agenda.date) ? 'text-red-600' : 'text-blue-600'
                    }`}>
                      {isEventPassed(agenda.date) ? 'Sudah Lewat' : 'Akan Datang'}
                    </span>
                    <div className="text-3xl font-bold text-gray-800">
                      {new Date(agenda.date).getDate()}
                    </div>
                    <div className="text-lg text-gray-600">
                      {new Date(agenda.date).toLocaleString('id-ID', { month: 'long' })}
                    </div>
                  </div>
                  
                  <div className="md:w-3/4 p-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{agenda.title}</h3>
                    <div className="space-y-3">
                      <div className="flex items-center text-gray-700">
                        <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                        <span>{formatDate(agenda.date)}</span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <Clock className="w-5 h-5 mr-2 text-blue-600" />
                        <span>{formatTime(agenda.time)} WIB</span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                        <span>{agenda.location}</span>
                      </div>
                      <p className="text-gray-600 mt-4 leading-relaxed">
                        {agenda.description}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {agendaList.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div className="text-gray-500 text-lg">
                  Tidak ada agenda yang tersedia saat ini
                </div>
              </motion.div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}