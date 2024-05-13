import { configureStore } from "@reduxjs/toolkit";
import { incomeReducer } from "./Reducers/IncomeSlice";
import { userReducer } from "./Reducers/UsersSlice";

// eslint-disable-next-line react-refresh/only-export-components
export default configureStore({
  reducer: { incomeReducer, userReducer },
});
