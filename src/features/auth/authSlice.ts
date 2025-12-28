import { createSlice,type PayloadAction } from "@reduxjs/toolkit";

export type UserRole = "government" | "ngo" | "farmer" | "company";

type AuthState = {
  userId: string | null;
  role: UserRole | null;
  token: string | null;
  isAuthenticated: boolean;
};

const initialState: AuthState = {
  userId: null,
  role: null,
  token: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<AuthState>) {
      Object.assign(state, action.payload);
      localStorage.setItem("session", JSON.stringify(action.payload));
    },
    logout(state) {
      Object.assign(state, initialState);
      localStorage.removeItem("session");
    },
    restoreSession(_, action: PayloadAction<AuthState>) {
      return action.payload;
    },
  },
});

export const { loginSuccess, logout, restoreSession } = authSlice.actions;
export default authSlice.reducer;
