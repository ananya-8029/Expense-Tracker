import { createSlice } from "@reduxjs/toolkit";

const initialState = { user: null };

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const newUser = action.payload;
      return { ...state, user: newUser };
    },
    clearUser: () => {
      return null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;

export const userReducer = userSlice.reducer;
