import { createSlice } from "@reduxjs/toolkit";

const initialState = { user: null };

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      return action.payload;
    },
    clearUser: () => {
      return null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;

export const userReducer = userSlice.reducer;
