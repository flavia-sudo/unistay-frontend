import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiDomain } from "../utils/APIDomain";
import type { RootState } from "../app/store";

export type TReview = {
    reviewId: number;
    hostelId: number;
    userId: number;
    rating: number;
    comment: string;
    createdAt: Date;
    updatedAt: Date;
    // ✅ relation fields (same pattern as TBooking / TPayment)
    firstName?: string;
    lastName?: string;
    hostelName?: string;
    landlordId?: number;
};

export const reviewsAPI = createApi({
    reducerPath: "reviewsAPI",
    baseQuery: fetchBaseQuery({
        baseUrl: ApiDomain,
        // ✅ Redux state instead of localStorage
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).auth.token;
            if (token) headers.set("Authorization", `Bearer ${token}`);
            headers.set("Content-Type", "application/json");
            return headers;
        },
    }),
    tagTypes: ["Review"],
    endpoints: (builder) => ({
        createReview: builder.mutation<TReview, Partial<TReview>>({
            query: (newReview) => ({ url: "/review", method: "POST", body: newReview }),
            invalidatesTags: ["Review"],
        }),

        // ✅ transformResponse same pattern as bookingsAPI / hostelsAPI
        getReviews: builder.query<TReview[], void>({
            query: () => "/review_all",
            transformResponse: (res: { data: TReview[] } | TReview[]) =>
                Array.isArray(res) ? res : res.data,
            providesTags: ["Review"],
        }),

        getReviewById: builder.query<TReview, number>({
            query: (reviewId) => `/review/${reviewId}`,
        }),

        getReviewByHostelId: builder.query<TReview[], number>({
            query: (hostelId) => `/review/hostel/${hostelId}`,
            transformResponse: (res: { data: TReview[] } | TReview[]) =>
                Array.isArray(res) ? res : res.data,
        }),

        getReviewByUserId: builder.query<TReview[], number>({
            query: (userId) => `/review/user/${userId}`,
            transformResponse: (res: { data: TReview[] } | TReview[]) =>
                Array.isArray(res) ? res : res.data,
            providesTags: ["Review"],
        }),

        updateReview: builder.mutation<TReview, Partial<TReview> & { reviewId: number }>({
            query: (updatedReview) => ({
                url: `/review/${updatedReview.reviewId}`,
                method: "PUT",
                body: updatedReview,
            }),
            invalidatesTags: ["Review"],
        }),

        deleteReview: builder.mutation<void, number>({
            query: (reviewId) => ({ url: `/review/${reviewId}`, method: "DELETE" }),
            invalidatesTags: ["Review"],
        }),
    }),
});