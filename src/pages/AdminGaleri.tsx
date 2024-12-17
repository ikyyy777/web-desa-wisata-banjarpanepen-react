import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';

interface AdminGaleri {
  id?: number;
  judul: string;
  deskripsi: string;
  imageUrl: string;
  tanggal: string;
}

export default function AdminGaleri() {
  const [galleries, setGalleries] = useState<AdminGaleri[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<AdminGaleri>({
    judul: '',
    deskripsi: '',
    imageUrl: '',
    tanggal: new Date().toISOString().split('T')[0]
  });
  const [editMode, setEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Fungsi untuk mengecek token
  const checkToken = async () => {
    try {
      console.log('Checking token...');
      const token = localStorage.getItem('token');
      console.log('Token:', token);
      
      if (!token) {
        console.log('No token found, redirecting to login...');
        window.location.href = '/admin/login';
        return;
      }
  
      console.log('Making request to check token...');
      const response = await fetch(import.meta.env.VITE_TOKEN_CHECK_API, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      console.log('Token check response:', data);
      
      if (data.status !== 'success') {
        console.log('Token check failed, redirecting to login...');
        localStorage.removeItem('token');
        window.location.href = '/admin/login';
      } else {
        console.log('Token check successful');
      }
    } catch (error) {
      console.error('Error checking token:', error);
      localStorage.removeItem('token');
      window.location.href = '/admin/login';
    }
  };  

  // Fungsi untuk mengambil data galeri
  const fetchGalleries = async () => {
    try {
      const response = await axios.get(import.meta.env.VITE_GALLERY_API);
      setGalleries(response.data as AdminGaleri[]);
    } catch (error) {
      console.error('Error fetching galleries:', error);
      toast.error('Gagal mengambil data galeri');
    }
  };

  useEffect(() => {
    fetchGalleries();
    checkToken();
  }, []);

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setFormData({
        ...formData,
        imageUrl: URL.createObjectURL(e.target.files[0])
      });
      setUploadProgress(0);
    }
  };

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
      const token = localStorage.getItem('token');

      if (!selectedFile && !editMode) {
        toast.error('Harap pilih gambar');
        setIsLoading(false);
        return;
      }

      let imageUrl = formData.imageUrl;

      // Upload gambar jika ada file yang dipilih
      if (selectedFile) {
        const imageFormData = new FormData();
        imageFormData.append('image', selectedFile);
        
        const imageResponse = await axios.post(
            import.meta.env.VITE_UPLOAD_IMAGE_API,
            imageFormData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`
              },
              onUploadProgress: (event: ProgressEvent) => {
                const progress = event.total
                  ? Math.round((event.loaded * 100) / event.total)
                  : 0;
                setUploadProgress(progress);
              }
            } as any
          );
          
        imageUrl = `${import.meta.env.VITE_PUBLIC_URL}${(imageResponse.data as { imageUrl: string }).imageUrl}`;
      }

      // Kirim data ke gallery.php
      const galleryData = {
        judul: formData.judul,
        deskripsi: formData.deskripsi,
        tanggal: formData.tanggal,
        imageUrl: imageUrl // Pastikan field ini sesuai dengan yang diharapkan API
      };

      if (editMode && selectedId) {
        await axios.put(import.meta.env.VITE_GALLERY_API, {
          ...galleryData,
          id: selectedId
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      } else {
        await axios.post(import.meta.env.VITE_GALLERY_API, galleryData, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }

      setFormData({
        judul: '',
        deskripsi: '',
        imageUrl: '',
        tanggal: new Date().toISOString().split('T')[0]
      });
      setSelectedFile(null);
      setEditMode(false);
      setSelectedId(null);
      setUploadProgress(0);
      fetchGalleries();
      
      setIsLoading(false);
      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: editMode ? 'Galeri berhasil diperbarui!' : 'Galeri berhasil ditambahkan!',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Error:', error);
      setIsLoading(false);
      setUploadProgress(0);
      toast.error('Terjadi kesalahan saat menyimpan data');
    }
  };

  // Handle delete
  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: 'Apakah Anda yakin?',
      text: "Data galeri akan dihapus permanen!",
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
        const token = localStorage.getItem('token');
        await axios.request({
          url: import.meta.env.VITE_GALLERY_API,
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          data: { id }, // Send the ID in the request body
        });        
        
        fetchGalleries();
        setIsLoading(false);
        Swal.fire({
          icon: 'success',
          title: 'Terhapus!',
          text: 'Data galeri berhasil dihapus.',
          timer: 2000,
          showConfirmButton: false
        });
      } catch (error) {
        console.error('Error deleting gallery:', error);
        setIsLoading(false);
        toast.error('Gagal menghapus galeri');
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
      
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Kelola Galeri</h2>
      
      {/* Form */}
      <div className="bg-white shadow-md p-6 rounded-lg mb-8">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Judul</label>
              <input
                type="text"
                name="judul"
                value={formData.judul}
                onChange={handleInputChange}
                className="w-full p-2 rounded border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-black"
                placeholder="Masukkan judul galeri"
                required
                disabled={isLoading}
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Tanggal</label>
              <input
                type="date"
                name="tanggal"
                value={formData.tanggal}
                onChange={handleInputChange}
                className="w-full p-2 rounded border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-black"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Gambar</label>
              <input
                type="file"
                onChange={handleFileChange}
                className="w-full p-2 text-gray-700"
                accept="image/*"
                disabled={isLoading}
              />
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-gray-600 text-sm mt-1">Upload Progress: {uploadProgress}%</p>
                </div>
              )}
              {formData.imageUrl && (
                <img 
                  src={formData.imageUrl} 
                  alt="Preview" 
                  className="mt-2 w-32 h-32 object-cover rounded"
                />
              )}
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-gray-700 mb-2">Deskripsi</label>
            <textarea
              name="deskripsi"
              value={formData.deskripsi}
              onChange={handleInputChange}
              className="w-full p-2 rounded border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-black"
              rows={4}
              placeholder="Masukkan deskripsi galeri"
              required
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {editMode ? 'Update Galeri' : 'Tambah Galeri'}
          </button>
        </form>
      </div>

      {/* Tabel Galeri */}
      <div className="bg-white shadow-md rounded-lg p-4">
        <div className="overflow-x-auto">
          <table className="w-full text-gray-700">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-left">Gambar</th>
                <th className="p-3 text-left">Judul</th>
                <th className="p-3 text-left">Deskripsi</th>
                <th className="p-3 text-left">Tanggal</th>
                <th className="p-3 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {galleries.map((gallery) => (
                <tr key={gallery.id} className="border-b border-gray-200">
                  <td className="p-3">
                    <img
                      src={gallery.imageUrl.startsWith('http') ? gallery.imageUrl : `${import.meta.env.VITE_PUBLIC_URL}${gallery.imageUrl}`}
                      alt={gallery.judul}
                      className="w-20 h-20 object-cover rounded"
                    />
                  </td>
                  <td className="p-3">{gallery.judul}</td>
                  <td className="p-3">{gallery.deskripsi}</td>
                  <td className="p-3">{new Date(gallery.tanggal).toLocaleDateString('id-ID')}</td>
                  <td className="p-3">
                    <button
                      onClick={() => {
                        setEditMode(true);
                        setSelectedId(gallery.id ?? null);
                        setFormData(gallery);
                      }}
                      className="mr-2 px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                      disabled={isLoading}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => gallery.id && handleDelete(gallery.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
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