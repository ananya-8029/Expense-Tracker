import { createSlice } from "@reduxjs/toolkit";

const initialState = {};
export const incomeSlice = createSlice({
  name: "income",
  initialState,
  reducers: {},
});

export const incomeReducer = incomeSlice.reducer;
