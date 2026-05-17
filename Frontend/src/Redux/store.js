import { configureStore } from "@reduxjs/toolkit";
import { incomeReducer } from "./Reducers/IncomeSlice";
import { expenseReducer } from "./Reducers/ExpenseSlice";
import { userReducer } from "./Reducers/UsersSlice";
import { fetchIncome, fetchExpense, fetchUser } from "./middleswares";

const store = configureStore({
  reducer: { incomeReducer, expenseReducer, userReducer },
});

store.dispatch(fetchUser);
store.dispatch(fetchIncome);
store.dispatch(fetchExpense);

export default store;
