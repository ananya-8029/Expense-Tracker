import { addIncome } from "./Reducers/IncomeSlice";
import axios from "axios";

// fetching incomes
export const fetchIncome = async () => {
    try {
        const response = await axios.get("http://localhost:8000/api/user/getincomes")
    } catch (error) {
        console.log(error)
    }
};
