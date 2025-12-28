import axios from "axios";
import { store } from "../app/store";
import { logout } from "../features/auth/authSlice";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
});

/* REQUEST INTERCEPTOR */
axiosClient.interceptors.request.use(config => {
  const token =
    store.getState().auth.token ||
    localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/* RESPONSE INTERCEPTOR */
axiosClient.interceptors.response.use(
  response => response,
  error => {
    const status = error?.response?.status;

    if (status === 401) {
      store.dispatch(logout());
    }

    return Promise.reject({
      status,
      message:
        error?.response?.data?.message ||
        "Something went wrong",
    });
  }
);

export default axiosClient;
