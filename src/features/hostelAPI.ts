import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ApiDomain } from '../utils/APIDomain';
import type { RootState } from '../app/store';

export type THostel = {
    hostelId: number;
    userId: number;
    hostelName: string;
    location: string;
    contact_number: string;
    rooms_available: number;
    description: string;
    image_URL: string;
    price: number;
    firstName?: string;
    lastName?: string;
};

export const hostelsAPI = createApi({
    reducerPath: "hostelsAPI",
    baseQuery: fetchBaseQuery({
        baseUrl: ApiDomain,
        prepareHeaders: (headers, { getState }) => {
            // ✅ attach JWT token
            const token = (getState() as RootState).auth.token;
            if (token) headers.set("Authorization", `Bearer ${token}`);
            return headers;
        }
    }),
    tagTypes: ['Hostels'],

    endpoints: (builder) => ({

        // ✅ OLD CREATE (kept for backward compatibility)
        createHostel: builder.mutation<THostel, FormData>({
            query: (formData) => ({
                url: "/hostel",
                method: "POST",
                body: formData,
            }),
            invalidatesTags: ['Hostels'],
        }),

        // ✅ NEW CREATE WITH ROOMS (ADDED)
        createHostelWithRooms: builder.mutation<THostel, FormData>({
            query: (formData) => ({
                url: "/hostel/with-rooms",
                method: "POST",
                body: formData,
            }),
            invalidatesTags: ['Hostels'],
        }),

        getHostels: builder.query<THostel[], void>({
            query: () => "/hostel_all",
            transformResponse: (res: { data: THostel[] } | THostel[]) =>
                Array.isArray(res) ? res : res.data,
            providesTags: ['Hostels'],
        }),

        getHostelById: builder.query<THostel, number>({
            query: (hostelId) => `/hostel/${hostelId}`,
        }),

        getHostelByUserId: builder.query<THostel[], number>({
            query: (userId) => `/hostel/user/${userId}`,
            transformResponse: (res: { data: THostel[] } | THostel[]) =>
                Array.isArray(res) ? res : res.data,
        }),

        updateHostel: builder.mutation<THostel, FormData>({
            query: (formData) => ({
                url: `/hostel/${formData.get("hostelId")}`,
                method: "PUT",
                body: formData,
            }),
            invalidatesTags: ['Hostels'],
        }),

        deleteHostel: builder.mutation<void, number>({
            query: (hostelId) => ({
                url: `/hostel/${hostelId}`,
                method: "DELETE"
            }),
            invalidatesTags: ['Hostels'],
        }),
    }),
});