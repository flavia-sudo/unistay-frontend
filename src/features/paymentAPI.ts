import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiDomain } from "../utils/APIDomain";

export type TPayment = {
    paymentId: number;
    bookingId: number;
    userId: number;
    amount: number;
    method: string;
    paymentStatus: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export const paymentsAPI = createApi({
    reducerPath: "paymentsAPI",
    baseQuery: fetchBaseQuery({ baseUrl: ApiDomain,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("Token");
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            headers.set('Content-Type', 'application/json');
            return headers;
        }
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
        getPayments: builder.query<{ data: TPayment[] }, void>({
            query: () => "/payment_all",
            providesTags: ["Payment"],
        }),
        getPaymentById: builder.query<TPayment, number>({
            query: (paymentId) => `/payment/${paymentId}`,
        }),
        getPaymentByBookingId: builder.query<{ data: TPayment[] }, number>({
            query: (bookingId) => `/payment/booking/${bookingId}`,
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