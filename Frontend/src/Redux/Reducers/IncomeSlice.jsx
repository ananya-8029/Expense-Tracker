import { createSlice } from "@reduxjs/toolkit";

const initialState = { incomes: [] };
export const incomeSlice = createSlice({
  name: "income",
  initialState,
  reducers: {
    addIncome: (state, action) => {
      const income = action.payload;
      state.incomes = [...state.incomes,income]
      // console.log(state.incomes)
    },
  },
});

export const { addIncome } = incomeSlice.actions;
export const incomeReducer = incomeSlice.reducer;
