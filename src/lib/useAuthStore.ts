import { create } from "zustand";

interface LoginPayload {
  token: string;
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

  login: ({ token, userId }: LoginPayload) => {
    localStorage.setItem("canvasApiToken", token);
    localStorage.setItem("userId", userId);
    set({
      isAuthenticated: true,
    });
  },

  logout: () => {
    localStorage.removeItem("canvasApiToken");
    localStorage.removeItem("userId");
    set({
      isAuthenticated: false,
    });
  },

  checkAuth: () => {
    const token = localStorage.getItem("canvasApiToken");
    const id = localStorage.getItem("userId");
    const isUser = Boolean(token && id && token !== "" && id !== "");
    set({
      isAuthenticated: isUser,
    });
  },
}));

export default useAuthStore;
