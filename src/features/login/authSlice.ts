import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface User {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string | null;
  role: "admin" | "student" | "Landlord";
  createdAt: string;
  updatedAt: string;
  image_URL: string;
  verificationCode: string | null;
  verified: boolean;
  token: string;
  year_of_study?: string | null;
  course?: string | null;
  address?: string | null;
}

interface AuthState {
  token: string | null;
  user: User | null;
}

const getStoredUser = (): User | null => {
  const roles: User["role"][] = ["student", "Landlord", "admin"];
  for (const role of roles) {
    const stored = localStorage.getItem(role);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error(`Error parsing ${role} from localStorage`, e);
      }
    }
  }
  return null;
};

const initialState: AuthState = {
  user: getStoredUser(),
  token: localStorage.getItem("Token") || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.token = action.payload.token;

      // Store user under their role
      localStorage.setItem(action.payload.role, JSON.stringify(action.payload));
      localStorage.setItem("currentUser", JSON.stringify(action.payload));
      localStorage.setItem("Token", action.payload.token);
    },

    logout(state) {
      if (state.user) {
        localStorage.removeItem(state.user.role);
        localStorage.removeItem("currentUser");
      }
      state.user = null;
      state.token = null;
      localStorage.removeItem("Token");
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;