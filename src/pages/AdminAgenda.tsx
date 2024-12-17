import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';

interface Agenda {
  id?: number;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
}

export default function AdminAgenda() {
  const [agendaList, setAgendaList] = useState<Agenda[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Agenda>({
    title: '',
    date: '',
    time: '',
    location: '',
    description: ''
  });

  // Fungsi untuk mengecek token
  const checkToken = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/admin/login';
        return;
      }

      const response = await axios.get(import.meta.env.VITE_TOKEN_CHECK_API, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      const data = response.data as { status: string };
      if (data.status !== 'success') {
        localStorage.removeItem('token');
        window.location.href = '/admin/login';
      }
    } catch (error) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/admin/login';
    }
  };

  // Fungsi untuk mengambil data agenda
  const fetchAgenda = async () => {
    try {
      const response = await axios.get<Agenda[]>(import.meta.env.VITE_AGENDA_API);
      setAgendaList(response.data);
    } catch (error) {
      console.error('Error fetching agenda:', error);
      toast.error('Gagal mengambil data agenda');
    }
  };

  useEffect(() => {
    checkToken();
    fetchAgenda();
  }, []);

  // Handle input form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      
      if (editMode && selectedId) {
        // Update existing agenda
        await axios.put(import.meta.env.VITE_AGENDA_API, {
          ...formData,
          id: selectedId
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
      } else {
        // Create new agenda
        await axios.post(import.meta.env.VITE_AGENDA_API, {
          agendaList: [formData]
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
      }

      // Reset form dan refresh data
      setFormData({
        title: '',
        date: '',
        time: '',
        location: '',
        description: ''
      });
      setEditMode(false);
      setSelectedId(null);
      fetchAgenda();
      
      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: editMode ? 'Agenda berhasil diperbarui!' : 'Agenda berhasil ditambahkan!',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Error:', error);
      toast.error('Terjadi kesalahan saat menyimpan data');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: 'Apakah Anda yakin?',
      text: "Agenda akan dihapus permanen!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      try {
        setIsLoading(true);
        await axios.delete(`${import.meta.env.VITE_AGENDA_API}?id=${id}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        fetchAgenda();
        Swal.fire({
          icon: 'success',
          title: 'Terhapus!',
          text: 'Agenda berhasil dihapus.',
          timer: 2000,
          showConfirmButton: false
        });
      } catch (error) {
        console.error('Error deleting agenda:', error);
        toast.error('Gagal menghapus agenda');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="container mx-auto p-6 relative">
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="relative">
            <div className="w-12 h-12 rounded-full border-4 border-gray-200"></div>
            <div className="w-12 h-12 rounded-full border-4 border-t-green-500 animate-spin absolute top-0"></div>
          </div>
        </div>
      )}
      
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Kelola Agenda</h2>
      
      {/* Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Judul Agenda</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full p-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500 text-gray-800"
                placeholder="Masukkan judul agenda"
                required
                disabled={isLoading}
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Tanggal</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full p-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500 text-gray-800"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Waktu</label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                className="w-full p-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500 text-gray-800"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Lokasi</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full p-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500 text-gray-800"
                placeholder="Masukkan lokasi"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-gray-700 mb-2">Deskripsi</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full p-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500 text-gray-800"
              rows={4}
              placeholder="Masukkan deskripsi agenda"
              required
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-500"
            disabled={isLoading}
          >
            {editMode ? 'Update Agenda' : 'Tambah Agenda'}
          </button>
        </form>
      </div>

      {/* Tabel Agenda */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="overflow-x-auto">
          <table className="w-full text-gray-800">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-3 text-left">Judul</th>
                <th className="p-3 text-left">Tanggal</th>
                <th className="p-3 text-left">Waktu</th>
                <th className="p-3 text-left">Lokasi</th>
                <th className="p-3 text-left">Deskripsi</th>
                <th className="p-3 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {agendaList.map((agenda) => (
                <tr key={agenda.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="p-3">{agenda.title}</td>
                  <td className="p-3">{agenda.date}</td>
                  <td className="p-3">{agenda.time}</td>
                  <td className="p-3">{agenda.location}</td>
                  <td className="p-3">{agenda.description}</td>
                  <td className="p-3">
                    <button
                      onClick={() => {
                        setEditMode(true);
                        setSelectedId(agenda.id ?? null);
                        setFormData(agenda);
                      }}
                      className="mr-2 px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700"
                      disabled={isLoading}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => agenda.id && handleDelete(agenda.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                      disabled={isLoading}
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}