import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ApiDomain } from '../utils/APIDomain';

export type THostel = {
    hostelId: number;
    userId: number;
    landlordId: number;
    hostelName: string;
    location: string;
    contact_number: string;
    rooms_available: number;
    description: string;
    image_URL: string;
    price: number;
}

const getToken = () => {
    try {
        const stored = localStorage.getItem("auth_user");
        return stored ? JSON.parse(stored).token : null;
    } catch { return null; }
};

export const hostelsAPI = createApi({
    reducerPath: "hostelsAPI",
    baseQuery: fetchBaseQuery({
        baseUrl: ApiDomain,
        prepareHeaders: (headers) => {
            const token = getToken();
            if (token) headers.set("Authorization", `Bearer ${token}`);
            headers.set('Content-Type', 'application/json');
            return headers;
        }
    }),
    tagTypes: ['Hostels'],
    endpoints: (builder) => ({
        createHostel: builder.mutation<THostel, Partial<THostel>>({
            query: (newHostel) => ({ url: "/hostel", method: "POST", body: newHostel }),
            invalidatesTags: ['Hostels'],
        }),
        getHostels: builder.query<{ data: THostel[] }, void>({
            query: () => "/hostel_all",
            providesTags: ['Hostels'],
        }),
        getHostelById: builder.query<THostel, number>({
            query: (hostelId) => `/hostel/${hostelId}`,
        }),
        getHostelByUserId: builder.query<{ data: THostel[] }, number>({
            query: (userId) => `/hostel/user/${userId}`,
        }),
        updateHostel: builder.mutation<THostel, Partial<THostel> & { hostelId: number }>({
            query: (updatedHostel) => ({
                url: `/hostel/${updatedHostel.hostelId}`,
                method: "PUT",
                body: updatedHostel,
            }),
            invalidatesTags: ['Hostels'],
        }),
        deleteHostel: builder.mutation<void, number>({
            query: (hostelId) => ({ url: `/hostel/${hostelId}`, method: "DELETE" }),
            invalidatesTags: ['Hostels'],
        }),
    }),
});