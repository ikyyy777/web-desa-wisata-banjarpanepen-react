import { createStore } from 'zustand/vanilla';
import { useStore } from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const isBrowser = typeof window !== 'undefined';

const authStore = createStore<AuthState>((set) => ({
  isAuthenticated: isBrowser ? !!window.localStorage.getItem('token') : false,

  login: async (username: string, password: string) => {
    try {
      console.log("Attempting to login with:", { username, password });
      const response = await fetch(import.meta.env.VITE_LOGIN_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      console.log('Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Login successful:', data);
        if (isBrowser) {
          window.localStorage.setItem('token', data.token);
        }
        set({ isAuthenticated: true });
        return true;
      } else {
        console.error('Login failed:', response.statusText);
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  },

  logout: () => {
    if (isBrowser) {
      window.localStorage.removeItem('token');
    }
    set({ isAuthenticated: false });
  }
}));

export const useAuth = () => useStore(authStore);
