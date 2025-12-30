import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../api/baseQuery";
import { API_ENDPOINTS } from "../api/apiEndpoints";

export const transactionApi = createApi({
  reducerPath: "transactionApi",
  baseQuery: axiosBaseQuery(),
  endpoints: builder => ({
    listTransactions: builder.query({
      query: () => ({
        url: API_ENDPOINTS.COMMON.TRANSACTIONS,
        method: "GET",
      }),
    }),

    buyCredit: builder.mutation({
      query: body => ({
        url: API_ENDPOINTS.COMPANY.BUY_CREDIT,
        method: "POST",
        data: body,
      }),
    }),
  }),
});

export const {
  useListTransactionsQuery,
  useBuyCreditMutation,
} = transactionApi;
