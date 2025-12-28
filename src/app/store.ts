import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice"
import carbonCreditReducer from "../features/carbonCredit/carbonCreditSlice"
import transactionReducer from "../features/transaction/transactionSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    carbonCredit: carbonCreditReducer,
    transaction: transactionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
