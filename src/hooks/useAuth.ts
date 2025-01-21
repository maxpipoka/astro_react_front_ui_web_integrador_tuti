import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  username: string | null;
  userId: number | null;
  accessLevel: number | null;
  isAuthenticated: boolean;
  login: (data: { token: string; username: string; userId: number; accessLevel: number }) => void;
  logout: () => void;
}

// Only create the store if we're in the browser
const createStore = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  return create<AuthState>()(
    persist(
      (set) => ({
        token: null,
        username: null,
        userId: null,
        accessLevel: null,
        isAuthenticated: false,
        login: (data) =>
          set({
            token: data.token,
            username: data.username,
            userId: data.userId,
            accessLevel: data.accessLevel,
            isAuthenticated: true,
          }),
        logout: () =>
          set({
            token: null,
            username: null,
            userId: null,
            accessLevel: null,
            isAuthenticated: false,
          }),
      }),
      {
        name: 'auth-storage',
        storage: createJSONStorage(() => localStorage),
      }
    )
  );
};

export const useAuth = typeof window !== 'undefined' ? createStore() : null;