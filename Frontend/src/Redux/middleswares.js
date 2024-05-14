import { addIncome } from "./Reducers/IncomeSlice";
import axios from "axios";
import { setUser } from "./Reducers/UsersSlice";

// fetch user
export const fetchUser = async (dispatch) => {
  try {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      return;
    }
    const response = await axios.get("http://localhost:8000/api/user/getUser", {
      headers: {
        "auth-token": authToken,
      },
    });
    if (response.statusText !== "OK") {
      console.error("Failed to fetch all incomes: ", response.status);
      return;
    }

    const user = response.data;
    await dispatch(setUser(user.user));
    return;
  } catch (error) {
    console.log(error);
  }
};

// fetching incomes
export const fetchIncome = async (dispatch) => {
  console.log("From fetchIncome middleware")
  try {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      return;
    }
    const response = await axios.get(
      "http://localhost:8000/api/user/getincomes",
      {
        headers: {
          "auth-token": authToken,
        },
      }
    );
    if (response.statusText !== "OK") {
      console.error("Failed to fetch all incomes: ", response.status);
      return;
    }

    const incomes = response.data;
    await dispatch(addIncome(incomes));
  } catch (error) {
    console.log(error);
  }
};
