import { create } from 'zustand';

export interface User {
  id?: string;
  name: string;
  email: string;
  phoneNumber?: string;
  uid: string; // UID do Firebase
}

export interface Organization {
  id: string;
  name: string;
  modality: string;
  userId: string;
  createdAt: string; // Ou Date, dependendo de como você recebe do backend
  nameUser: string;
  email: string;
  phoneNumber: string;
}

export interface Match {
    id: string;
    local: string;
    guests?: Guest[];
    date: string;
    hour: string;
    dateTime: string;
    duration: number;
    modality: string;
    numberMaxPlayers: number;
    numberMinPlayers: number;
    numberPlayers: number;
    inviteCode?: string;
    idOrganization: string;
    status: string;
}

export interface Guest {
  id: string;
  email: string;
  idMatch: string;
  isConfirm: boolean;
  name: string;
  phoneNumber: string;
  preferencePosition: string;
}

interface UserState {
  user: User | null;
  organization: Organization | null;
  match: Match | null;
  token: string | null; 
  isLoading: boolean; 
  errorAuth: string | null;
  
  setUser: (user: User | null) => void;
  setOrganization: (org: Organization | null) => void;
  setToken: (token: string | null) => void;
  setIsLoading: (loading: boolean) => void;
  setErrorAuth: (error: string | null) => void;
  setMatch: (match: Match | null) => void;
  
  // Ação para fazer logout
  logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  organization: null,
  token: localStorage.getItem('authToken') || null,
  isLoading: false,
  errorAuth: null,
  match: null,

  setUser: (user) => set({ user }),
  setOrganization: (org) => set({ organization: org }),
  setToken: (token) => {
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
    set({ token });
  },
  setIsLoading: (loading) => set({ isLoading: loading }),
  setErrorAuth: (error) => set({ errorAuth: error }),
  setMatch: (match) => set({match: match}),

  logout: () => {
    set({ user: null, organization: null, token: null });
    localStorage.removeItem('authToken');
  },
}));