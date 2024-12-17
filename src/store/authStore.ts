import { create } from 'zustand';
import { AuthState } from '../types';

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: async (email: string, password: string) => {
    // TODO: Implement actual authentication
    set({ 
      isAuthenticated: true, 
      user: { 
        id: '1', 
        email, 
        role: 'admin' 
      } 
    });
  },
  logout: () => {
    set({ user: null, isAuthenticated: false });
  },
}));