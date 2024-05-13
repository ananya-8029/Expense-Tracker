import NavBar from "../NavBar/NavBar";
import MenuBar from "../Menu_Bar/MenuBar";
import DashboardPage from "../Dashboard_Page/DashboardPage";
import { useEffect, useState } from "react";
import TransactionPage from "../Transaction_Page/TransactionPage";
import IncomePage from "../Income_Page/IncomePage";
import ExpensePage from "../Expense_Page/ExpensePage";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [btnClick, setBtnClick] = useState("dashBoardIcon");
  const navigate = useNavigate();

  const displayData = () => {
    switch (btnClick) {
      case "dashBoardIcon":
        return <DashboardPage />;
      case "transactionIcon":
        return <TransactionPage />;
      case "viewIncomeIcon":
        return <IncomePage />;
      case "viewExpensesIcon":
        return <ExpensePage />;
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const authToken = localStorage.getItem("authToken");
      
      if (!authToken) {
        navigate("/user_login");
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
        {displayData()}
      </div>
    </>
  );
};

export default HomePage;
