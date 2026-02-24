import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiDomain } from "../utils/APIDomain";

export type TReview = {
    reviewId: number;
    hostelId: number;
    userId: number;
    rating: number;
    comment: string;
    createdAt: Date;
    updatedAt: Date;
}

export const reviewsAPI = createApi({
    reducerPath: "reviewsAPI",
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
    tagTypes: ['Review'],
    endpoints: (builder) => ({
        createReview: builder.mutation<TReview, Partial<TReview>>({
            query: (newReview) => ({
                url: "/review",
                method: "POST",
                body: newReview,
            }),
            invalidatesTags: ['Review'],
        }),
        getReviews: builder.query<{ data: TReview[] }, void>({
            query: () => "/review_all",
            providesTags: ['Review'],
        }),
        getReviewById: builder.query<TReview, number>({
            query: (reviewId) => `/review/${reviewId}`,
        }),
        getReviewByHostelId: builder.query<{ data: TReview[] }, number>({
            query: (hostelId) => `/review/hostel/${hostelId}`,
        }),
        updateReview: builder.mutation<TReview, Partial<TReview> & { reviewId: number }>({
            query: (updatedReview) => ({
                url: `/review/${updatedReview.reviewId}`,
                method: "PUT",
                body: updatedReview,
            }),
            invalidatesTags: ['Review'],
        }),
        deleteReview: builder.mutation<void, number>({
            query: (reviewId) => ({
                url: `/review/${reviewId}`,
                method: "DELETE",
            }),
            invalidatesTags: ['Review'],
        }),
    }),
});