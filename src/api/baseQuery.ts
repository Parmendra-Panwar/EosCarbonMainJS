import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import axiosClient from "./axiosClient";

export const axiosBaseQuery =
  (): BaseQueryFn =>
  async ({ url, method, data, params }) => {
    try {
      const result = await axiosClient({
        url,
        method,
        data,
        params,
      });

      return { data: result.data };
    } catch (error: any) {
      return {
        error: {
          status: error.status,
          message: error.message,
        },
      };
    }
  };
