import { createSlice } from "@reduxjs/toolkit";

const initialState = { incomes: [] };
export const incomeSlice = createSlice({
  name: "income",
  initialState,
  reducers: {
    addIncome: (state, action) => {
      state.incomes = action.payload;
    },
    clearIncome: (state) => {
      state.incomes = [];
    },
  },
});

export const { addIncome, clearIncome } = incomeSlice.actions;
export const incomeReducer = incomeSlice.reducer;
