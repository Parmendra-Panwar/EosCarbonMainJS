import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../api/baseQuery";
import { API_ENDPOINTS } from "../api/apiEndpoints";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: axiosBaseQuery(),
  endpoints: builder => ({
    login: builder.mutation({
      query: body => ({
        url: API_ENDPOINTS.AUTH.LOGIN,
        method: "POST",
        data: body,
      }),
    }),

    signup: builder.mutation({
      query: body => ({
        url: API_ENDPOINTS.AUTH.SIGNUP,
        method: "POST",
        data: body,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
} = authApi;
