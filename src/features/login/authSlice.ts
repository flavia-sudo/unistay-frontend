import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type AuthUser = {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  address?: string;
  role: string;
  verified?: boolean;
};

type AuthState = {
  user: AuthUser | null;
  token: string | null;
};

const loadFromStorage = (): AuthState => {
  try {
    const stored = localStorage.getItem("auth_user");
    if (!stored) return { user: null, token: null };
    const { user, token } = JSON.parse(stored);
    return { user: user ?? null, token: token ?? null };
  } catch {
    return { user: null, token: null };
  }
};

const authSlice = createSlice({
  name: "auth",
  initialState: loadFromStorage(),
  reducers: {
    login(state, action: PayloadAction<AuthUser & { token: string }>) {
      const { token, ...user } = action.payload;
      state.user = user;
      state.token = token;
      localStorage.setItem("auth_user", JSON.stringify({ user, token }));
    },
    logout(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem("auth_user");
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;