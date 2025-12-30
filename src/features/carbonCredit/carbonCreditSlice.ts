import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export type CreditStatus =
  | "PENDING"
  | "VERIFIED_L1"
  | "VERIFIED_L2"
  | "REJECTED"
  | "LISTED"
  | "SOLD";

export type CarbonCredit = {
  id: string;
  farmerId: string;
  landId: string;
  quantity: number;
  price?: number;
  status: CreditStatus;
};

type State = {
  credits: CarbonCredit[];
  loading: boolean;
};

const initialState: State = {
  credits: [],
  loading: false,
};

/* MOCK ASYNC APIs */
export const addCarbonCredit = createAsyncThunk(
  "carbon/add",
  async (credit: Omit<CarbonCredit, "id" | "status">) => {
    return {
      ...credit,
      id: crypto.randomUUID(),
      status: "PENDING" as CreditStatus,
    };
  }
);

export const carbonCreditSlice = createSlice({
  name: "carbonCredit",
  initialState,
  reducers: {
    verifyL1(state, action) {
      const credit = state.credits.find(c => c.id === action.payload);
      if (credit) credit.status = "VERIFIED_L1";
    },
    verifyL2(state, action) {
      const credit = state.credits.find(c => c.id === action.payload);
      if (credit) credit.status = "VERIFIED_L2";
    },
    rejectCredit(state, action) {
      const credit = state.credits.find(c => c.id === action.payload);
      if (credit) credit.status = "REJECTED";
    },
    listForSale(state, action) {
      const { id, price } = action.payload;
      const credit = state.credits.find(c => c.id === id);
      if (credit) {
        credit.status = "LISTED";
        credit.price = price;
      }
    },
    markSold(state, action) {
      const credit = state.credits.find(c => c.id === action.payload);
      if (credit) credit.status = "SOLD";
    },
  },
  extraReducers: builder => {
    builder
      .addCase(addCarbonCredit.pending, s => {
        s.loading = true;
      })
      .addCase(addCarbonCredit.fulfilled, (s, a) => {
        s.credits.push(a.payload);
        s.loading = false;
      });
  },
});

export const {
  verifyL1,
  verifyL2,
  rejectCredit,
  listForSale,
  markSold,
} = carbonCreditSlice.actions;

export default carbonCreditSlice.reducer;
