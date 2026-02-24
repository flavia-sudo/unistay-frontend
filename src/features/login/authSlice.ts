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

const initialState: AuthState ={
    user: JSON.parse(localStorage.getItem("Student") || "null"),
    token: null
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login(state, action: PayloadAction<User>) {
            state.user = action.payload;
            localStorage.setItem("User", JSON.stringify(action.payload));
            localStorage.setItem("Token", action.payload.token);
        },

        logout(state) {
            state.user = null;
            localStorage.removeItem("User");
            localStorage.removeItem("Token");
        },
    },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;