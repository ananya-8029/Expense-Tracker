import { addIncome } from "./Reducers/IncomeSlice";
import axios from "axios";

// fetching incomes
export const fetchIncome = async () => {
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
    console.log(incomes)
  } catch (error) {
    console.log(error);
  }
};
