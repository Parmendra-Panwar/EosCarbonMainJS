import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import carbonCreditReducer from "../features/carbonCredit/carbonCreditSlice";
import transactionReducer from "../features/transaction/transactionSlice";

import { authApi } from "../services/authApi";
import { carbonCreditApi } from "../services/carbonCreditApi";
import { transactionApi } from "../services/transactionApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    carbonCredit: carbonCreditReducer,
    transaction: transactionReducer,

    // RTK Query reducers
    [authApi.reducerPath]: authApi.reducer,
    [carbonCreditApi.reducerPath]: carbonCreditApi.reducer,
    [transactionApi.reducerPath]: transactionApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      carbonCreditApi.middleware,
      transactionApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
