import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { User } from "../../types/types";
import { ApiDomain } from "../../utils/ApiDomain";


export interface TLoginResponse {
    token: string;
    user: User;
}

export interface LoginFormData {
    email: string;
    password: string;
}


export const loginAPI = createApi({
    reducerPath: 'loginAPI',
    baseQuery: fetchBaseQuery({ baseUrl: ApiDomain }),
    tagTypes: ['Login'],
    endpoints: (builder) => ({
        loginUser: builder.mutation<TLoginResponse, LoginFormData>({
            query: (user) => ({
                url: 'login',
                method: 'POST',
                body: user,
            }),
        }),
        // logout
    }),
});