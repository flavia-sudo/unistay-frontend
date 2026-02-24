import { configureStore } from "@reduxjs/toolkit";
// Import individual reducers for different parts of the state
import authReducer from "../features/login/authSlice"; // Handles authentication state
import { bookingsAPI } from "../features/bookingAPI";
import { usersAPI } from "../features/userAPI";
import { paymentsAPI } from "../features/paymentAPI";
import { reviewsAPI } from "../features/reviewAPI";
import { hostelsAPI } from "../features/hostelAPI";
import { roomsAPI } from "../features/roomAPI";
import { maintenanceAPI } from "../features/maintenanceAPI";

// Create and export the Redux store
export const store = configureStore({
    // Define all slices (reducers) that make up the global Redux state
    reducer: {
        auth: authReducer, // auth slice handles login, register, user info, etc.
        [bookingsAPI.reducerPath]: bookingsAPI.reducer,
        [usersAPI.reducerPath]: usersAPI.reducer,
        [paymentsAPI.reducerPath]: paymentsAPI.reducer,
        [reviewsAPI.reducerPath]: reviewsAPI.reducer,
        [hostelsAPI.reducerPath]: hostelsAPI.reducer,
        [roomsAPI.reducerPath]: roomsAPI.reducer,
        [maintenanceAPI.reducerPath]: maintenanceAPI.reducer
    },
    // Extend default middleware to include RTK Query's middleware for caching, polling, etc.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(bookingsAPI.middleware)
      .concat(usersAPI.middleware)
      .concat(paymentsAPI.middleware)
      .concat(reviewsAPI.middleware)
      .concat(hostelsAPI.middleware)
      .concat(roomsAPI.middleware)
      .concat(maintenanceAPI.middleware),
});

// Define types for the entire Redux state and the dispatch function
export type RootState = ReturnType<typeof store.getState>; // Type for the entire state
export type AppDispatch = typeof store.dispatch; // Type for the dispatch function
