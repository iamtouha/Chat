import { create } from 'zustand';
import { User } from '../types';

interface UserStore {
  user: User | null;
  setUser: (user: User | undefined) => void;
}

export const useUserStore = create<UserStore>()((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
