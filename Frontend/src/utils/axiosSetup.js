import axios from "axios";
import store from "../Redux/store";
import { clearUser } from "../Redux/Reducers/UsersSlice";
import { clearIncome } from "../Redux/Reducers/IncomeSlice";
import { clearExpense } from "../Redux/Reducers/ExpenseSlice";

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("authTokenExpiration");
      store.dispatch(clearUser());
      store.dispatch(clearIncome());
      store.dispatch(clearExpense());
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);
