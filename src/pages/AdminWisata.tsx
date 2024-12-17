import React, { useState, useEffect, lazy, Suspense } from 'react';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';

// Dynamic import untuk ReactQuill
const ReactQuill = lazy(() => import('react-quill'));

// Komponen fallback saat ReactQuill sedang dimuat
const QuillFallback = () => (
  <div className="w-full h-[300px] bg-gray-100 animate-pulse rounded"></div>
);

interface AdminWisata {
  id?: number;
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  kategori: string;
  artikel: {
    konten: string;
    jamOperasional: string;
    lokasi: string;
    petaLokasi: string;
  };
}

export default function AdminWisata() {
  const [destinations, setDestinations] = useState<AdminWisata[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<AdminWisata>({
    title: '',
    description: '',
    imageUrl: '',
    price: 0,
    kategori: '',
    artikel: {
      konten: '',
      jamOperasional: '',
      lokasi: '',
      petaLokasi: ''
    }
  });
  const [editMode, setEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [formattedPrice, setFormattedPrice] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Tambahkan konfigurasi modules untuk Quill
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      [{ font: [] }],
      [{ size: [] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      ['link', 'image'],
      ['clean'],
    ],
  };

  const formats = [
    'header',
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'color',
    'background',
    'align',
    'link',
    'image',
  ];

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

  // Fungsi untuk mengambil data destinations
  const fetchDestinations = async () => {
    try {
      const response = await fetch(import.meta.env.VITE_WISATA_API);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setDestinations(data as AdminWisata[]);
    } catch (error) {
      console.error('Error fetching destinations:', error);
      toast.error('Gagal mengambil data destinasi');
    }
  };

  // Fungsi untuk mengambil data kategori
  const fetchCategories = async () => {
    try {
      const response = await fetch(import.meta.env.VITE_WISATA_CATEGORY_API);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setCategories(data as string[]);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Gagal mengambil data kategori');
    }
  };

  useEffect(() => {
    fetchDestinations();
    fetchCategories();
    checkToken();
  }, []);

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      // Buat URL preview untuk gambar yang dipilih
      setFormData({
        ...formData,
        imageUrl: URL.createObjectURL(e.target.files[0])
      });
    }
  };

  // Format currency
  const formatCurrency = (value: string) => {
    const number = value.replace(/[^\d]/g, '');
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(Number(number));
  };

  // Handle input form
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    if (name.startsWith('artikel.')) {
      // Handle artikel fields
      const artikelField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        artikel: {
          ...prev.artikel,
          [artikelField]: value
        }
      }));
    } else if (name === 'price') {
      const formattedValue = formatCurrency(value);
      setFormattedPrice(formattedValue);
      const numericValue = Number(value.replace(/[^\d]/g, ''));
      setFormData(prev => ({
        ...prev,
        price: numericValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: e.target.type === 'number' ? parseFloat(value) : value
      }));
    }
  };

  // Handle tambah kategori baru
  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      toast.error('Nama kategori tidak boleh kosong');
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(import.meta.env.VITE_WISATA_CATEGORY_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          name: newCategory.toLowerCase()
        })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json() as { status: string };
      if (data.status === 'success') {
        fetchCategories();
        setNewCategory('');
        toast.success('Kategori berhasil ditambahkan');
      } else {
        toast.error((data as { message?: string }).message || 'Gagal menambahkan kategori');
      }
    } catch (error) {
      console.error('Error adding category:', error);
      toast.error('Gagal menambahkan kategori');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle hapus kategori
  const handleDeleteCategory = async (category: string) => {
    const result = await Swal.fire({
      title: 'Apakah Anda yakin?',
      text: `Kategori "${category}" akan dihapus!`,
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
        const response = await fetch(`${import.meta.env.VITE_WISATA_CATEGORY_API}?name=${category}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json() as { status: string };
        
        if (data.status === 'success') {
          fetchCategories();
          toast.success('Kategori berhasil dihapus');
        } else {
          toast.error('Gagal menghapus kategori');
        }
      } catch (error) {
        console.error('Error deleting category:', error);
        toast.error('Gagal menghapus kategori');
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Optimasi handler untuk ReactQuill
  const handleQuillChange = (content: string) => {
    // Hanya lakukan string replacement saat form akan disubmit
    setFormData(prev => ({
      ...prev,
      artikel: {
        ...prev.artikel!,
        konten: content
      }
    }));
  };

  // Tambahkan fungsi untuk memformat konten sebelum submit
  const formatContent = (content: string) => {
    return content
      .replace(/<h1>/g, '<h1 class="text-4xl font-bold mb-4">')
      .replace(/<h2>/g, '<h2 class="text-3xl font-bold mb-3">')
      .replace(/<h3>/g, '<h3 class="text-2xl font-bold mb-2">')
      .replace(/<p>/g, '<p class="text-base mb-4">')
      .replace(/<ul>/g, '<ul class="list-disc list-inside mb-4">')
      .replace(/<ol>/g, '<ol class="list-decimal list-inside mb-4">')
      .replace(/<li>/g, '<li class="mb-2">');
  };

  // Modifikasi handleSubmit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      setUploadProgress(0);

      const formattedContent = formatContent(formData.artikel.konten);
      
      const updatedFormData = {
        ...formData,
        artikel: {
          ...formData.artikel,
          konten: formattedContent
        }
      };

      // Persiapkan data wisata yang akan dikirim
      const wisataData = {
        title: updatedFormData.title,
        description: updatedFormData.description,
        imageUrl: updatedFormData.imageUrl,
        price: updatedFormData.price,
        kategori: updatedFormData.kategori
      };

      // Upload gambar utama jika ada
      if (selectedFile) {
        const imageFormData = new FormData();
        imageFormData.append('image', selectedFile);
        const uploadResponse = await fetch(
          import.meta.env.VITE_UPLOAD_IMAGE_API,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: imageFormData
          }
        );

        if (!uploadResponse.ok) {
          throw new Error('Upload failed');
        }

        const uploadData = await uploadResponse.json() as { imageUrl: string };
        wisataData.imageUrl = import.meta.env.VITE_PUBLIC_URL + uploadData.imageUrl;
      }

      // Kirim data wisata ke API
      const wisataResponse = await fetch(
        editMode && selectedId 
          ? `${import.meta.env.VITE_WISATA_API}?id=${selectedId}`
          : import.meta.env.VITE_WISATA_API,
        {
          method: editMode && selectedId ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(editMode && selectedId ? { ...wisataData, id: selectedId } : wisataData)
        }
      );

      if (!wisataResponse.ok) {
        throw new Error('Failed to save wisata data');
      }

      const wisataResult = await wisataResponse.json();
      const wisataId = editMode ? selectedId : wisataResult.id;

      // Persiapkan data artikel dengan format JSON yang benar
      const artikelData = {
        id: selectedId,
        wisata_id: wisataId,
        konten: updatedFormData.artikel.konten,
        jam_operasional: updatedFormData.artikel.jamOperasional,
        lokasi: updatedFormData.artikel.lokasi,
        peta_lokasi: updatedFormData.artikel.petaLokasi
      };

      // Kirim data artikel ke API
      const artikelResponse = await fetch(
        editMode 
          ? `${import.meta.env.VITE_WISATA_ARTIKEL_API}?id=${wisataId}`
          : import.meta.env.VITE_WISATA_ARTIKEL_API,
        {
          method: editMode ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(artikelData)
        }
      );

      if (!artikelResponse.ok) {
        throw new Error('Failed to save artikel data');
      }

      // Reset form dan refresh data
      setFormData({
        title: '',
        description: '',
        imageUrl: '',
        price: 0,
        kategori: '',
        artikel: {
          konten: '',
          jamOperasional: '',
          lokasi: '',
          petaLokasi: ''
        }
      });
      setFormattedPrice('');
      setSelectedFile(null);
      setEditMode(false);
      setSelectedId(null);
      setUploadProgress(0);
      fetchDestinations();
      
      setIsLoading(false);
      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: editMode ? 'Data berhasil diperbarui!' : 'Data berhasil ditambahkan!',
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
      text: "Data akan dihapus permanen!",
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
        
        // Hapus data artikel terlebih dahulu
        const artikelResponse = await fetch(`${import.meta.env.VITE_WISATA_ARTIKEL_API}?id=${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!artikelResponse.ok) {
          throw new Error('Failed to delete artikel data');
        }

        // Kemudian hapus data wisata
        const wisataResponse = await fetch(`${import.meta.env.VITE_WISATA_API}?id=${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!wisataResponse.ok) {
          throw new Error('Failed to delete wisata data');
        }

        fetchDestinations();
        setIsLoading(false);
        Swal.fire({
          icon: 'success',
          title: 'Terhapus!',
          text: 'Data berhasil dihapus.',
          timer: 2000,
          showConfirmButton: false
        });
      } catch (error) {
        console.error('Error deleting data:', error);
        setIsLoading(false);
        toast.error('Gagal menghapus data');
      }
    }
  };

  // Handle edit button click
  const handleEdit = async (destination: AdminWisata) => {
    try {
      setIsLoading(true);
      
      // Ambil data artikel berdasarkan wisata_id
      const artikelResponse = await fetch(`${import.meta.env.VITE_WISATA_ARTIKEL_API}?wisata_id=${destination.id}`);
      if (!artikelResponse.ok) {
        throw new Error('Failed to fetch artikel data');
      }
      
      const artikelData = await artikelResponse.json();
      
      // Periksa apakah artikelData null
      if (!artikelData) {
        throw new Error('Artikel data not found');
      }

      setEditMode(true);
      setSelectedId(destination.id ?? null);
      setFormData({
        ...destination,
        artikel: {
          konten: artikelData.konten || '',
          jamOperasional: artikelData.jam_operasional || '',
          lokasi: artikelData.lokasi || '',
          petaLokasi: artikelData.peta_lokasi || ''
        }
      });
      setFormattedPrice(formatCurrency(destination.price.toString()));
      
    } catch (error) {
      console.error('Error fetching artikel data:', error);
      toast.error('Gagal mengambil data artikel');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-4 border-gray-200"></div>
          <div className="w-12 h-12 rounded-full border-4 border-t-green-500 animate-spin absolute top-0"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 relative">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Kelola Wisata</h2>
      
      {/* Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Judul</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full p-2 rounded border border-gray-300 text-gray-800"
                placeholder="Masukkan judul wisata"
                required
                disabled={isLoading}
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Harga</label>
              <input
                type="text"
                name="price"
                value={formattedPrice}
                onChange={handleInputChange}
                className="w-full p-2 rounded border border-gray-300 text-gray-800"
                placeholder="Masukkan harga"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Kategori</label>
              <div className="flex gap-2">
                <select
                  name="kategori"
                  value={formData.kategori}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded border border-gray-300 text-gray-800"
                  required
                  disabled={isLoading}
                >
                  <option value="">Pilih Kategori</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="p-2 rounded border border-gray-300 text-gray-800"
                    placeholder="Kategori baru"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={handleAddCategory}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
                    disabled={isLoading}
                  >
                    +
                  </button>
                </div>
              </div>
              {/* Daftar kategori dengan tombol hapus */}
              <div className="mt-2 flex flex-wrap gap-2">
                {categories.map((category) => (
                  <div key={category} className="flex items-center bg-gray-100 rounded px-2 py-1">
                    <span className="text-gray-800 mr-2">{category}</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteCategory(category)}
                      className="text-red-500 hover:text-red-700"
                      disabled={isLoading}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Gambar Utama</label>
              <input
                type="file"
                onChange={handleFileChange}
                className="w-full p-2 text-gray-800"
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
                  <p className="text-gray-700 text-sm mt-1">{uploadProgress}% Uploaded</p>
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
            <label className="block text-gray-700 mb-2">Deskripsi Singkat</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full p-2 rounded border border-gray-300 text-gray-800"
              rows={4}
              placeholder="Masukkan deskripsi singkat wisata"
              required
              disabled={isLoading}
            />
          </div>

          {/* Form Artikel */}
          <div className="mt-6 border-t pt-6">
            <h3 className="text-xl font-semibold mb-4">Informasi Detail Artikel</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Konten Artikel Lengkap</label>
                {isClient && (
                  <Suspense fallback={<QuillFallback />}>
                    <ReactQuill
                      theme="snow"
                      value={formData.artikel?.konten}
                      onChange={handleQuillChange}
                      modules={modules}
                      formats={formats}
                      className="bg-white text-gray-800"
                      style={{ height: '300px', marginBottom: '50px' }}
                      placeholder="Masukkan konten artikel lengkap"
                      readOnly={isLoading}
                    />
                  </Suspense>
                )}
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Jam Operasional</label>
                <input
                  type="text"
                  name="artikel.jamOperasional"
                  value={formData.artikel?.jamOperasional}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded border border-gray-300 text-gray-800"
                  placeholder="Contoh: Senin-Minggu, 08:00-17:00 WIB"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Lokasi</label>
                <textarea
                  name="artikel.lokasi"
                  value={formData.artikel?.lokasi}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded border border-gray-300 text-gray-800"
                  rows={3}
                  placeholder="Masukkan alamat lengkap lokasi"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Link Google Maps</label>
                <input
                  type="text"
                  name="artikel.petaLokasi"
                  value={formData.artikel?.petaLokasi}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded border border-gray-300 text-gray-800"
                  placeholder="Masukkan link Google Maps"
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {editMode ? 'Update Destinasi' : 'Tambah Destinasi'}
          </button>
        </form>
      </div>

      {/* Tabel Destinasi */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="overflow-x-auto">
          <table className="w-full text-gray-800">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-3 text-left">Gambar</th>
                <th className="p-3 text-left">Judul</th>
                <th className="p-3 text-left">Deskripsi</th>
                <th className="p-3 text-left">Harga</th>
                <th className="p-3 text-left">Kategori</th>
                <th className="p-3 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {destinations.map((destination) => (
                <tr key={destination.id} className="border-b border-gray-200">
                  <td className="p-3">
                    <img
                      src={destination.imageUrl.startsWith('http') ? destination.imageUrl : `${import.meta.env.VITE_PUBLIC_URL}${destination.imageUrl}`}
                      alt={destination.title}
                      className="w-20 h-20 object-cover rounded"
                    />
                  </td>
                  <td className="p-3">{destination.title}</td>
                  <td className="p-3">{destination.description}</td>
                  <td className="p-3">{new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    minimumFractionDigits: 0
                  }).format(destination.price)}</td>
                  <td className="p-3">{destination.kategori}</td>
                  <td className="p-3">
                    <button
                      onClick={() => handleEdit(destination)}
                      className="mr-2 px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700"
                      disabled={isLoading}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => destination.id && handleDelete(destination.id)}
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
