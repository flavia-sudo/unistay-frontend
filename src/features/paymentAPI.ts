import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiDomain } from "../utils/APIDomain";
import type { RootState } from "../app/store";

export type TPayment = {
    paymentId: number;
    bookingId: number;
    userId: number;
    amount: number;
    method: string;
    paymentStatus: "Pending" | "Completed" | "Cancelled";
    createdAt: Date;
    updatedAt: Date;
    // ✅ relation fields returned by the API (same pattern as TBooking)
    firstName?: string;
    lastName?: string;
    hostelName?: string;
    roomNumber?: string;
    transactionId?: string;
};

export const paymentsAPI = createApi({
    reducerPath: "paymentsAPI",
    baseQuery: fetchBaseQuery({
        baseUrl: ApiDomain,
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).auth.token;
            if (token) headers.set("Authorization", `Bearer ${token}`);
            headers.set("Content-Type", "application/json");
            return headers;
        },
    }),
    tagTypes: ["Payment"],
    endpoints: (builder) => ({
        createPayment: builder.mutation<TPayment, Partial<TPayment>>({
            query: (newPayment) => ({
                url: "/payment",
                method: "POST",
                body: newPayment,
            }),
            invalidatesTags: ["Payment"],
        }),

        // ✅ FIXED: transformResponse same pattern as bookingsAPI / hostelsAPI
        getPayments: builder.query<TPayment[], void>({
            query: () => "/payment_all",
            transformResponse: (res: { data: TPayment[] } | TPayment[]) =>
                Array.isArray(res) ? res : res.data,
            providesTags: ["Payment"],
        }),

        getPaymentById: builder.query<TPayment, number>({
            query: (paymentId) => `/payment/${paymentId}`,
        }),

        getPaymentByBookingId: builder.query<TPayment[], number>({
            query: (bookingId) => `/payment/booking/${bookingId}`,
            transformResponse: (res: { data: TPayment[] } | TPayment[]) =>
                Array.isArray(res) ? res : res.data,
        }),

        getPaymentByUserId: builder.query<TPayment[], number>({
            query: (userId) => `/payment/user/${userId}`,
            transformResponse: (res: { data: TPayment[] } | TPayment[]) =>
                Array.isArray(res) ? res : res.data,
        }),

        updatePayment: builder.mutation<TPayment, Partial<TPayment> & { paymentId: number }>({
            query: (updatedPayment) => ({
                url: `/payment/${updatedPayment.paymentId}`,
                method: "PUT",
                body: updatedPayment,
            }),
            invalidatesTags: ["Payment"],
        }),

        deletePayment: builder.mutation<void, number>({
            query: (paymentId) => ({
                url: `/payment/${paymentId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Payment"],
        }),
    }),
});