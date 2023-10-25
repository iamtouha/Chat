import { create } from 'zustand';

interface SocketStore {
  connected: boolean;
  setConnected: (val: boolean) => void;
  activeConversations: string[];
  setActiveConversations: (val: string[]) => void;
  addActiveConversation: (val: string) => void;
  removeActiveConversation: (val: string) => void;
  isConversationActive: (val: string) => boolean;
}

export const useSocketStore = create<SocketStore>()((set, get) => ({
  connected: false,
  activeConversations: [],
  setConnected: (val) => set({ connected: val }),
  setActiveConversations: (val) => set({ activeConversations: val }),
  addActiveConversation: (val) =>
    set((state) => ({
      activeConversations: [...state.activeConversations, val],
    })),
  removeActiveConversation: (val) =>
    set((state) => ({
      activeConversations: state.activeConversations.filter((id) => id !== val),
    })),
  isConversationActive: (val) => get().activeConversations.includes(val),
}));
