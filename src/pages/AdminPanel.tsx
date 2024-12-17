import { useEffect, useState } from 'react';
import { Link, Route, Routes, useNavigate } from 'react-router-dom';
import AdminAgenda from './AdminAgenda';
import AdminGaleri from './AdminGaleri';
import AdminWisata from './AdminWisata';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function AdminPanel() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Fungsi untuk memvalidasi input
  const validateInput = (value: string) => {
    // Hanya mengizinkan huruf, angka, dan simbol !@#$%
    const regex = /^[a-zA-Z0-9!@#$%]*$/;
    return regex.test(value);
  };

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

  useEffect(() => {
    checkToken();
    
    // Sembunyikan navbar saat komponen dimount
    const navbar = document.querySelector('nav');
    if (navbar) {
      navbar.style.display = 'none';
    }

    // Tampilkan kembali navbar saat komponen unmount
    return () => {
      if (navbar) {
        navbar.style.display = 'block';
      }
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error('Password tidak cocok!');
      return;
    }

    try {
      const response = await fetch(import.meta.env.VITE_UPDATE_PASSWORD_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          username: 'admin', // Hardcoded karena hanya ada 1 admin
          new_password: newPassword
        })
      });

      if (response.ok) {
        toast.success('Password berhasil diubah');
        setShowPasswordDialog(false);
        setNewPassword('');
        setConfirmPassword('');
      } else {
        const data = await response.json();
        toast.error('Gagal mengubah password: ' + data.error);
      }
    } catch (error) {
      console.error('Error updating password:', error);
      toast.error('Terjadi kesalahan saat mengubah password');
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>, setPassword: (value: string) => void) => {
    const newValue = e.target.value;
    if (validateInput(newValue)) {
      setPassword(newValue);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      <aside className="w-64 bg-white text-gray-800 flex flex-col h-screen sticky top-0 shadow-lg">
        <div className="p-4 text-lg font-bold border-b border-gray-200">Admin Panel</div>
        <nav className="flex-1">
          <ul>
            <li>
              <Link to="/admin/wisata" className="block px-4 py-2 hover:bg-gray-100 transition duration-200">Wisata</Link>
            </li>
            <li>
              <Link to="/admin/agenda" className="block px-4 py-2 hover:bg-gray-100 transition duration-200">Agenda</Link>
            </li>
            <li>
              <Link to="/admin/galeri" className="block px-4 py-2 hover:bg-gray-100 transition duration-200">Gallery</Link>
            </li>
          </ul>
        </nav>
        <div className="sticky bottom-0 w-full border-t border-gray-200">
          <button 
            onClick={() => setShowPasswordDialog(true)}
            className="block w-full px-4 py-3 text-left hover:bg-gray-100 transition duration-200 bg-white"
          >
            Ganti Password Admin
          </button>
          <button
            onClick={handleLogout}
            className="block w-full px-4 py-3 text-left text-red-500 hover:bg-gray-100 transition duration-200 bg-white border-t border-gray-200"
          >
            Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 p-8 bg-gray-100">
        <Routes>
          <Route path="wisata" element={<AdminWisata />} />
          <Route path="agenda" element={<AdminAgenda />} />
          <Route path="galeri" element={<AdminGaleri />} />
        </Routes>

        {showPasswordDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-96 shadow-xl">
              <h2 className="text-gray-800 text-xl mb-4">Ganti Password</h2>
              <div className="relative mb-4">
                <input
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Password Baru"
                  value={newPassword}
                  onChange={(e) => handlePasswordChange(e, setNewPassword)}
                  className="w-full p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showNewPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                </button>
              </div>
              <div className="relative mb-4">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Konfirmasi Password"
                  value={confirmPassword}
                  onChange={(e) => handlePasswordChange(e, setConfirmPassword)}
                  className="w-full p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                </button>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowPasswordDialog(false)}
                  className="px-4 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300"
                >
                  Batal
                </button>
                <button
                  onClick={handleChangePassword}
                  className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
                >
                  Simpan
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
