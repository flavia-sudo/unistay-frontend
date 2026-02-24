import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiDomain } from "../../utils/APIDomain";

export type TLoginResponse = {
    token: string;
    user: {
        userId: number;
        firstName: string;
        lastName: string;
        email: string;
        role: string;
    };
}

type LoginInputs = {
    email: string;
    password: string;
}

export const loginAPI = createApi({
    reducerPath: "loginAPI",
    baseQuery: fetchBaseQuery({ baseUrl: ApiDomain }),
    tagTypes: ['Login'],
    endpoints: (builder) => ({
        login: builder.mutation<TLoginResponse, LoginInputs>({
            query: (loginData) => ({
                url: "/auth/login",
                method: "POST",
                body: loginData,
            }),
            invalidatesTags: ['Login'],
        }),
    }),
})