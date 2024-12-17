import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  // Fungsi untuk memvalidasi input
  const validateInput = (value: string) => {
    // Hanya mengizinkan huruf, angka, dan simbol !@#$%
    const regex = /^[a-zA-Z0-9!@#$%]*$/;
    return regex.test(value);
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (validateInput(newValue)) {
      setUsername(newValue);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (validateInput(newValue)) {
      setPassword(newValue);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const success = await login(username, password);
    if (success) {
      navigate('/admin/wisata');
    } else {
      setError('Login gagal. Periksa username dan password Anda.');
    }
  };

  // Fungsi untuk mengecek token, jika token valid maka akan diarahkan ke halaman admin panel
  const checkToken = async () => {
    try {
      setIsLoading(true);
      console.log('Checking token...');
      const token = localStorage.getItem('token');
      console.log('Token:', token);
      
      // Jika tidak ada token dan sudah berada di halaman login, tidak perlu redirect
      if (!token && window.location.pathname === '/admin/login') {
        setIsLoading(false);
        return;
      }
      
      // Jika tidak ada token dan bukan di halaman login, redirect ke login
      if (!token) {
        console.log('No token found, redirecting to login...');
        navigate('/admin/login');
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
        navigate('/admin/login');
      } else {
        navigate('/admin/wisata');
        console.log('Token check successful');
      }
    } catch (error) {
      console.error('Error checking token:', error);
      localStorage.removeItem('token');
      navigate('/admin/login');
    } finally {
      setIsLoading(false);
    }
  };  

  useEffect(() => {
    checkToken();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="relative">
            <div className="w-12 h-12 rounded-full border-4 border-gray-200"></div>
            <div className="w-12 h-12 rounded-full border-4 border-t-green-500 animate-spin absolute top-0"></div>
          </div>
        </div>
      )}
      <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Admin Login</h2>
        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-600 rounded">
            {error}
          </div>
        )}
        <div className="mb-4">
          <label className="block text-gray-700">Username</label>
          <input
            type="text"
            value={username}
            onChange={handleUsernameChange}
            className="w-full px-3 py-2 border rounded bg-white text-gray-800 border-gray-300 focus:border-blue-500 focus:outline-none"
            required
            placeholder="Hanya huruf, angka, dan simbol !@#$%"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={handlePasswordChange}
              className="w-full px-3 py-2 border rounded bg-white text-gray-800 border-gray-300 focus:border-blue-500 focus:outline-none"
              required
              placeholder="Hanya huruf, angka, dan simbol !@#$%"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </button>
          </div>
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200">
          Login
        </button>
      </form>
    </div>
  );
}