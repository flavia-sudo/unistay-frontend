import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiDomain } from "../utils/APIDomain";

export type TMaintenance = {
    maintenanceId: number;
    hostelId: number;
    roomId: number;
    userId: number;
    issueTitle: string;
    description: string;
    status: boolean;
    date_reported: Date;
    date_resolved: Date;
}

export const maintenanceAPI = createApi({
    reducerPath: "maintenanceAPI",
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
    tagTypes: ["Maintenance"],
    endpoints: (builder) => ({
        createMaintenance: builder.mutation<TMaintenance, Partial<TMaintenance>>({
            query: (newMaintenance) => ({
                url: "/maintenance",
                method: "POST",
                body: newMaintenance,
            }),
            invalidatesTags: ["Maintenance"],
        }),
        getMaintenances: builder.query<{ data: TMaintenance[] }, void>({
            query: () => "/maintenance_all",
            providesTags: ["Maintenance"],
        }),
        getMaintenanceById: builder.query<TMaintenance, number>({
            query: (maintenanceId) => `/maintenance/${maintenanceId}`,
        }),
        getMaintenanceByRoomId: builder.query<{ data: TMaintenance[] }, number>({
            query: (roomId) => `/maintenance/room/${roomId}`,
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
            query: (maintenanceId) => ({
                url: `/maintenance/${maintenanceId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Maintenance"],
        }),
    }),
});