import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiDomain } from "../utils/APIDomain";
import type { RootState } from "../app/store";

export type TMaintenance = {
    maintenanceId: number;
    hostelId: number;
    roomId: number;
    userId: number;
    issueTitle: string;
    description: string;
    status: string;
    date_reported: Date;
    date_resolved: Date;
    // ✅ relation fields (same pattern as TBooking / TPayment)
    firstName?: string;
    lastName?: string;
    hostelName?: string;
    roomNumber?: string;
};

export const maintenanceAPI = createApi({
    reducerPath: "maintenanceAPI",
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
    tagTypes: ["Maintenance"],
    endpoints: (builder) => ({
        createMaintenance: builder.mutation<TMaintenance, Partial<TMaintenance>>({
            query: (newMaintenance) => ({ url: "/maintenance", method: "POST", body: newMaintenance }),
            invalidatesTags: ["Maintenance"],
        }),

        // ✅ transformResponse same pattern as bookingsAPI / hostelsAPI
        getMaintenances: builder.query<TMaintenance[], void>({
            query: () => "/maintenance_all",
            transformResponse: (res: { data: TMaintenance[] } | TMaintenance[]) =>
                Array.isArray(res) ? res : res.data,
            providesTags: ["Maintenance"],
        }),

        getMaintenanceById: builder.query<TMaintenance, number>({
            query: (maintenanceId) => `/maintenance/${maintenanceId}`,
        }),

        getMaintenanceByRoomId: builder.query<TMaintenance[], number>({
            query: (roomId) => `/maintenance/room/${roomId}`,
            transformResponse: (res: { data: TMaintenance[] } | TMaintenance[]) =>
                Array.isArray(res) ? res : res.data,
        }),

        getMaintenanceByUserId: builder.query<TMaintenance[], number>({
            query: (userId) => `/maintenance/user/${userId}`,
            transformResponse: (res: { data: TMaintenance[] } | TMaintenance[]) =>
                Array.isArray(res) ? res : res.data,
            providesTags: ["Maintenance"],
        }),

        updateMaintenance: builder.mutation<TMaintenance, Partial<TMaintenance> & { maintenanceId: number }>({
            query: (updatedMaintenance) => ({
                url: `/maintenance/${updatedMaintenance.maintenanceId}`,
                method: "PUT",
                body: updatedMaintenance,
            }),
            invalidatesTags: ["Maintenance"],
        }),

        deleteMaintenance: builder.mutation<void, number>({
            query: (maintenanceId) => ({ url: `/maintenance/${maintenanceId}`, method: "DELETE" }),
            invalidatesTags: ["Maintenance"],
        }),
    }),
});