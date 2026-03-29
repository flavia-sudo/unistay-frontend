import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiDomain } from "../utils/APIDomain";

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
}

export const bookingsAPI = createApi({
    reducerPath: "bookingsAPI",
    baseQuery: fetchBaseQuery({
        baseUrl: ApiDomain,
        prepareHeaders: (headers) => {
            const stored = localStorage.getItem("auth_user");
            const token = stored ? JSON.parse(stored).token : null;
            if (token) headers.set("Authorization", `Bearer ${token}`);
            headers.set("Content-Type", "application/json");
            return headers;
        },
    }),
    tagTypes: ["Bookings"],
    endpoints: (builder) => ({
        createBooking: builder.mutation<TBooking, Partial<TBooking>>({
            query: (newBooking) => ({ url: "/booking", method: "POST", body: newBooking }),
            invalidatesTags: ["Bookings"],
        }),
        getBookings: builder.query<{ data: TBooking[] }, void>({
            query: () => "/booking_all",
            providesTags: ["Bookings"],
        }),
        getBookingById: builder.query<TBooking, number>({
            query: (bookingId) => `/booking/${bookingId}`,
        }),
        getBookingByUserId: builder.query<{ data: TBooking[] }, number>({
            query: (userId) => `/booking/user/${userId}`,
            providesTags: ["Bookings"],
        }),
        getBookingByRoomId: builder.query<{ data: TBooking[] }, number>({
            query: (roomId) => `/booking/room/${roomId}`,
        }),
        updateBooking: builder.mutation<TBooking, Partial<TBooking> & { bookingId: number }>({
            query: (updatedBooking) => ({
                url: `/booking/${updatedBooking.bookingId}`,
                method: "PUT",
                body: updatedBooking,
            }),
            invalidatesTags: ["Bookings"],
        }),
        deleteBooking: builder.mutation<void, number>({
            query: (bookingId) => ({ url: `/booking/${bookingId}`, method: "DELETE" }),
            invalidatesTags: ["Bookings"],
        }),
    }),
});