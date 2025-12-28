import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import axiosClient from "./axiosClient";
import { hardcodedUsers } from "../mock/authMock";

const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === "true";

export const axiosBaseQuery =
  (): BaseQueryFn =>
  async ({ url, method, data }) => {
    // ---------------- MOCK MODE ----------------
    if (USE_MOCK) {
      await new Promise(res => setTimeout(res, 800));

      // LOGIN
      if (url === "/auth/login" && method === "POST") {
        const { mobile, password, role } = data;

        const user = hardcodedUsers.find(
          u =>
            u.mobile === mobile &&
            u.password === password &&
            u.role === role
        );

        if (!user) {
          return {
            error: {
              status: 401,
              data: { message: "Invalid credentials" },
            },
          };
        }

        return { data: user };
      }

      // SIGNUP (ONLY farmer & company)
      if (url === "/auth/signup" && method === "POST") {
        if (!["farmer", "company"].includes(data.role)) {
          return {
            error: {
              status: 403,
              data: { message: "Signup not allowed for this role" },
            },
          };
        }

        return {
          data: {
            ...data,
            id: Date.now().toString(),
            token: "mock-token",
          },
        };
      }
    }

    // ---------------- REAL API MODE ----------------
    try {
      const result = await axiosClient({
        url,
        method,
        data,
      });

      return { data: result.data };
    } catch (error: any) {
      return {
        error: {
          status: error.response?.status,
          data: error.response?.data || { message: "Server error" },
        },
      };
    }
  };
