import { createApi } from "@reduxjs/toolkit/query/react";
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiDomain } from "../utils/APIDomain";

export type TUser = {
    userId: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber: string | null;
    role: "admin" | "student" | "Landlord";
    createdAt: Date;
    updatedAt: Date;
    image_URL: string;
    verificationCode: string | null;
    verified: boolean;
    token: string;
    year_of_study: string | null;
    course: string | null;
    address: string | null;
};

export type TverifyUser = {
    email: string;
    code: string;
};

export const usersAPI = createApi({
    reducerPath: "usersAPI",
    baseQuery: fetchBaseQuery({
        baseUrl: ApiDomain,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("Token");
            console.log(token);
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ["Users"],
    endpoints: (builder) => ({
        createUsers: builder.mutation<TUser, Partial<TUser>>({
            query: (newUser) => ({
                url: "/auth/register",
                method: "POST",
                body: newUser,
            }),
            invalidatesTags: ["Users"],
        }),

        verifyUser: builder.mutation<TUser, TverifyUser>({
      query: (data) => ({
        url: "/auth/verify",
        method: "POST",
        body: data,
      }),
    }),

    getUsers: builder.query<{ data: TUser[] }, void>({
      query: () => "/user_all",
      providesTags: ["Users"],
    }),

    getUserById: builder.query<TUser, number>({
      query: (userId) => `/user/${userId}`,
    }),

    updateUser: builder.mutation<TUser, Partial<TUser> & { userId: number }>({
      query: (updatedUser) => ({
        url: `/user/${updatedUser.userId}`,
        method: "PUT",
        body: updatedUser,
      }),
      invalidatesTags: ["Users"],
    }),

    deleteUser: builder.mutation<{ success: boolean; userId: number }, number>({
      query: (userId) => ({
        url: `/users/delete/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),

    getLandlords: builder.query<{ data: TUser[] }, void>({
      query: () => "/users/landlords_all",
      providesTags: ["Users"],
    }),
  }),
});

export const {
  useCreateUsersMutation,
  useVerifyUserMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
  useGetUserByIdQuery,
  useGetLandlordsQuery,
} = usersAPI;