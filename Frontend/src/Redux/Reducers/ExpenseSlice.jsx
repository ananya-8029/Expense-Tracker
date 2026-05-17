import { createSlice } from "@reduxjs/toolkit";

const initialState = { expenses: [] };

export const expenseSlice = createSlice({
  name: "expense",
  initialState,
  reducers: {
    setExpenses: (state, action) => {
      state.expenses = action.payload;
    },
    clearExpense: () => initialState,
  },
});

export const { setExpenses, clearExpense } = expenseSlice.actions;
export const expenseReducer = expenseSlice.reducer;
