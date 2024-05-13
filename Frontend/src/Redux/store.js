import { configureStore } from "@reduxjs/toolkit";
import { incomeReducer } from "./Reducers/IncomeSlice";
import { userReducer } from "./Reducers/UsersSlice";
import { fetchIncome } from "./middleswares";

const store = configureStore({
  reducer: { incomeReducer, userReducer },
});

store.dispatch(fetchIncome)

export default store;
