import { create } from "zustand";

interface LoginPayload {
  phrase: string;
  userId: string;
}

interface AuthState {
  isAuthenticated: boolean;
  accessToken: string | null;
  userId: string | null;

  setIsAuthenticated: (value: boolean) => void;
  login: (payload: LoginPayload) => void;
  logout: () => void;
  checkAuth: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  accessToken: null,
  userId: null,

  setIsAuthenticated: (value: boolean) => set({ isAuthenticated: value }),

  login: ({ phrase, userId }: LoginPayload) => {
    localStorage.setItem("loginPhrase", phrase);
    localStorage.setItem("userId", userId);
    set({
      isAuthenticated: true,
    });
  },

  logout: () => {
    localStorage.removeItem("loginPhrase");
    localStorage.removeItem("userId");
    set({
      isAuthenticated: false,
    });
  },

  checkAuth: () => {
    const phrase = localStorage.getItem("loginPhrase");
    const userId = localStorage.getItem("userId");
    const isUser = Boolean(phrase && userId && phrase !== "" && userId !== "");
    set({
      isAuthenticated: isUser,
    });
  },
}));

export default useAuthStore;
