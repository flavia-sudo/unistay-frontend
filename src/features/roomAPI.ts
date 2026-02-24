import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiDomain } from "../utils/APIDomain";

export type TRoom = {
    roomId: number;
    hostelId: number;
    userId: number;
    roomNumber: number;
    roomType: string;
    price: string;
    capacity: string;
    description: string;
    status: boolean;
}

export const roomsAPI = createApi({
    reducerPath: "roomsAPI",
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
     tagTypes: ['Rooms'],
     endpoints: (builder) => ({
        createRoom: builder.mutation<TRoom, Partial<TRoom>>({
            query: (newRoom) => ({
                url: "/room",
                method: "POST",
                body: newRoom,
            }),
            invalidatesTags: ['Rooms'],
        }),
        getRooms: builder.query<{ data: TRoom[] }, void>({
            query: () => "/room_all",
            providesTags: ['Rooms'],
        }),
        getRoomById: builder.query<TRoom, number>({
            query: (roomId) => `/room/${roomId}`,
        }),
        getRoomByHostelId: builder.query<{ data: TRoom[] }, number>({
            query: (hostelId) => `/room/hostel/${hostelId}`,
        }),
        updateRoom: builder.mutation<TRoom, Partial<TRoom> & { roomId: number }>({
            query: (updatedRoom) => ({
                url: `/room/${updatedRoom.roomId}`,
                method: "PUT",
                body: updatedRoom,
            }),
            invalidatesTags: ['Rooms'],
        }),
        deleteRoom: builder.mutation<void, number>({
            query: (roomId) => ({
                url: `/room/${roomId}`,
                method: "DELETE",
            }),
            invalidatesTags: ['Rooms'],
        }),
     }),
})