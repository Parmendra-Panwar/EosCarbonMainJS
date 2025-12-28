import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../api/baseQuery";
import { API_ENDPOINTS } from "../api/apiEndpoints";

export const carbonCreditApi = createApi({
  reducerPath: "carbonCreditApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["CarbonCredit"],
  endpoints: builder => ({
    getCredits: builder.query({
      query: () => ({
        url: API_ENDPOINTS.COMMON.CREDITS,
        method: "GET",
      }),
      providesTags: ["CarbonCredit"],
    }),

    createCredit: builder.mutation({
      query: body => ({
        url: API_ENDPOINTS.FARMER.CREATE_CREDIT,
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["CarbonCredit"],
    }),
  }),
});

export const {
  useGetCreditsQuery,
  useCreateCreditMutation,
} = carbonCreditApi;
