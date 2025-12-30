import { createSlice } from "@reduxjs/toolkit";

export type Transaction = {
  id: string;
  creditId: string;
  buyerId: string;
  sellerId: string;
  price: number;
  status: "REQUESTED" | "COMPLETED" | "REJECTED";
};

const initialState = {
  transactions: [] as Transaction[],
};

const transactionSlice = createSlice({
  name: "transaction",
  initialState,
  reducers: {
    requestBuy(state, action) {
      state.transactions.push({
        id: crypto.randomUUID(),
        status: "REQUESTED",
        ...action.payload,
      });
    },
    completeTransaction(state, action) {
      const tx = state.transactions.find(t => t.id === action.payload);
      if (tx) tx.status = "COMPLETED";
    },
    rejectTransaction(state, action) {
      const tx = state.transactions.find(t => t.id === action.payload);
      if (tx) tx.status = "REJECTED";
    },
  },
});

export const {
  requestBuy,
  completeTransaction,
  rejectTransaction,
} = transactionSlice.actions;

export default transactionSlice.reducer;
