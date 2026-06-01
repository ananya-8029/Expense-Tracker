import { addIncome } from "./Reducers/IncomeSlice";
import { setExpenses } from "./Reducers/ExpenseSlice";
import axios from "axios";
import { setUser } from "./Reducers/UsersSlice";

const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const fetchUser = async (dispatch) => {
  try {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) return;
    const response = await axios.get(`${API}/api/auth/getUser`, {
      headers: { "auth-token": authToken },
    });
    dispatch(setUser(response.data.user));
  } catch (error) {
    console.log(error);
  }
};

export const fetchIncome = async (dispatch) => {
  try {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) return;
    const response = await axios.get(
      `${API}/api/transactions/getincomes`,
      { headers: { "auth-token": authToken } }
    );
    dispatch(addIncome(response.data));
  } catch (error) {
    console.log(error);
  }
};

export const fetchExpense = async (dispatch) => {
  try {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) return;
    const response = await axios.get(
      `${API}/api/transactions/getexpenses`,
      { headers: { "auth-token": authToken } }
    );
    dispatch(setExpenses(response.data));
  } catch (error) {
    console.log(error);
  }
};
