import { configureStore } from "@reduxjs/toolkit";
import { incomeReducer } from "./Reducers/IncomeSlice";
import { userReducer } from "./Reducers/UsersSlice";
import { fetchIncome, fetchUser } from "./middleswares";

const store = configureStore({
  reducer: { incomeReducer, userReducer },
});

store.dispatch(fetchIncome);
store.dispatch(fetchUser);

export default store;
