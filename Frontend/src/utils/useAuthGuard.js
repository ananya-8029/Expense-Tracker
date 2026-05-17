import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearUser } from "../Redux/Reducers/UsersSlice";
import { clearIncome } from "../Redux/Reducers/IncomeSlice";
import { clearExpense } from "../Redux/Reducers/ExpenseSlice";

const useAuthGuard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const expiry = localStorage.getItem("authTokenExpiration");
    const isExpired = !token || (expiry && Date.now() > Number(expiry));

    if (isExpired) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("authTokenExpiration");
      dispatch(clearUser());
      dispatch(clearIncome());
      dispatch(clearExpense());
      navigate("/");
    }
  }, []);
};

export default useAuthGuard;
