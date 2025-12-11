import { create } from 'zustand';
import { AuthState, User, LoginCredentials } from '../types/auth';
import { supabase } from '@/lib/supabaseClient';

interface AuthStore extends AuthState {
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  
  login: async (credentials: LoginCredentials) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });
      
      if (error) {
        set({ error: error.message, isLoading: false });
        return false;
      }
      
      const u = data.user;
      if (u) {
        const user: User = {
          id: u.id,
          email: u.email || credentials.email,
          nome: u.user_metadata?.name || u.user_metadata?.full_name || 'Administrador',
          role: 'admin',
          createdAt: new Date(u.created_at),
          lastLogin: new Date(),
        };
        set({ user, isAuthenticated: true, isLoading: false, error: null });
        return true;
      }
      
      set({ error: 'Falha ao autenticar', isLoading: false });
      return false;
    } catch (err: any) {
      set({ error: err?.message || 'Erro ao fazer login', isLoading: false });
      return false;
    }
  },
  
  logout: async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Erro ao fazer logout:', err);
    }
    set({ user: null, isAuthenticated: false, error: null });
  },
  
  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Erro ao verificar sessão:', error);
        set({ user: null, isAuthenticated: false, isLoading: false });
        return;
      }
      
      const u = data.session?.user;
      if (u) {
        const user: User = {
          id: u.id,
          email: u.email || '',
          nome: u.user_metadata?.name || u.user_metadata?.full_name || 'Administrador',
          role: 'admin',
          createdAt: new Date(u.created_at),
          lastLogin: new Date(),
        };
        set({ user, isAuthenticated: true, isLoading: false });
      } else {
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    } catch (err) {
      console.error('Erro ao verificar autenticação:', err);
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  }
}));
