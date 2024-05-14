import NavBar from "../NavBar/NavBar";
import MenuBar from "../Menu_Bar/MenuBar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [btnClick, setBtnClick] = useState("dashBoardIcon");
  const navigate = useNavigate();

  const getRoute = () => {
    switch (btnClick) {
      case "dashBoardIcon":
        return "/home_page/dashboard";
      case "transactionIcon":
        return "/home_page/transactions";
      case "viewIncomeIcon":
        return "/home_page/incomes";
      case "viewExpensesIcon":
        return "/home_page/expenses";
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const authToken = localStorage.getItem("authToken");

      if (!authToken) {
        navigate("/user_login");
      } else {
        navigate(getRoute());
      }
    }
  });
  return (
    <>
      <div className="bg-[#f7f6f6] min-h-screen h-screen w-full">
        <div className="flex justify-end">
          <NavBar btnClick={btnClick} />
        </div>
        <MenuBar setBtnClick={setBtnClick} />
      </div>
    </>
  );
};

export default HomePage;
