import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiDomain } from "../utils/APIDomain";
import type { RootState } from "../app/store"; // ✅ added

export type TBooking = {
    bookingId: number;
    hostelId: number;
    roomId: number;
    userId: number;
    firstName: string;
    lastName: string;
    hostelName: string;
    roomNumber: string;
    checkInDate: Date;
    duration: string;
    totalAmount: number;
    bookingStatus: boolean;
    createdAt: Date;
    updatedAt: Date;
};

export const bookingsAPI = createApi({
    reducerPath: "bookingsAPI",
    baseQuery: fetchBaseQuery({
        baseUrl: ApiDomain,
        prepareHeaders: (headers, { getState }) => {
            // ✅ use Redux state instead of localStorage
            const token = (getState() as RootState).auth.token;
            if (token) headers.set("Authorization", `Bearer ${token}`);
            return headers;
        },
    }),
    tagTypes: ["Bookings"],
    endpoints: (builder) => ({
        createBooking: builder.mutation<TBooking, Partial<TBooking>>({
            query: (newBooking) => ({
                url: "/booking",
                method: "POST",
                body: newBooking,
            }),
            invalidatesTags: ["Bookings"],
        }),

        // ✅ FIXED: match hostelAPI response handling
        getBookings: builder.query<TBooking[], void>({
            query: () => "/booking_all",
            transformResponse: (res: { data: TBooking[] } | TBooking[]) =>
                Array.isArray(res) ? res : res.data,
            providesTags: ["Bookings"],
        }),

        getBookingById: builder.query<TBooking, number>({
            query: (bookingId) => `/booking/${bookingId}`,
        }),

        // ✅ FIXED: consistent response format
        getBookingByUserId: builder.query<TBooking[], number>({
            query: (userId) => `/booking/user/${userId}`,
            transformResponse: (res: { data: TBooking[] } | TBooking[]) =>
                Array.isArray(res) ? res : res.data,
            providesTags: ["Bookings"],
        }),

        getBookingByRoomId: builder.query<TBooking[], number>({
            query: (roomId) => `/booking/room/${roomId}`,
            transformResponse: (res: { data: TBooking[] } | TBooking[]) =>
                Array.isArray(res) ? res : res.data,
        }),

        updateBooking: builder.mutation<
            TBooking,
            Partial<TBooking> & { bookingId: number }
        >({
            query: (updatedBooking) => ({
                url: `/booking/${updatedBooking.bookingId}`,
                method: "PUT",
                body: updatedBooking,
            }),
            invalidatesTags: ["Bookings"],
        }),

        deleteBooking: builder.mutation<void, number>({
            query: (bookingId) => ({
                url: `/booking/${bookingId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Bookings"],
        }),
    }),
});