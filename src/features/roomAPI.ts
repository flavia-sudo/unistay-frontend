import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiDomain } from "../utils/APIDomain";
import type { RootState } from "../app/store";

export type TRoom = {
    roomId: number;
    hostelId: number;
    userId: number;
    roomNumber: string;
    roomType: string;
    price: string;
    capacity: string;
    description: string;
    status: boolean | string | number;
};

export const roomsAPI = createApi({
    reducerPath: "roomsAPI",
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
    tagTypes: ["Rooms"],
    endpoints: (builder) => ({
        createRoom: builder.mutation<TRoom, Partial<TRoom>>({
            query: (newRoom) => ({ url: "/room", method: "POST", body: newRoom }),
            invalidatesTags: ["Rooms"],
        }),

        // ✅ transformResponse same pattern as bookingsAPI / hostelsAPI
        getRooms: builder.query<TRoom[], void>({
            query: () => "/room_all",
            transformResponse: (res: { data: TRoom[] } | TRoom[]) =>
                Array.isArray(res) ? res : res.data,
            providesTags: ["Rooms"],
        }),

        getRoomById: builder.query<TRoom, number>({
            query: (roomId) => `/room/${roomId}`,
        }),

        getRoomByHostelId: builder.query<TRoom[], number>({
            query: (hostelId) => `/room/hostel/${hostelId}`,
            transformResponse: (res: { data: TRoom[] } | TRoom[]) =>
                Array.isArray(res) ? res : res.data,
        }),

        updateRoom: builder.mutation<TRoom, Partial<TRoom> & { roomId: number }>({
            query: (updatedRoom) => ({
                url: `/room/${updatedRoom.roomId}`,
                method: "PUT",
                body: updatedRoom,
            }),
            invalidatesTags: ["Rooms"],
        }),

        deleteRoom: builder.mutation<void, number>({
            query: (roomId) => ({ url: `/room/${roomId}`, method: "DELETE" }),
            invalidatesTags: ["Rooms"],
        }),
    }),
});