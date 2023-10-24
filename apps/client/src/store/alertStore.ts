import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AlertStore {
  alert: boolean;
  setAlert: (alert: boolean) => void;
}

export const useAlertStore = create<AlertStore>()(
  persist(
    (set) => ({
      alert: true,
      setAlert: (val) => set({ alert: val }),
    }),
    { name: 'alert-storage' },
  ),
);
