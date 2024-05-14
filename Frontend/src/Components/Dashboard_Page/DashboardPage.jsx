import { useNavigate } from "react-router-dom";
import MenuBar from "../Menu_Bar/MenuBar";
import NavBar from "../NavBar/NavBar";
import { useEffect, useState } from "react";

const DashboardPage = () => {
  const [btnClick, setBtnClick] = useState("dashBoardIcon");
  const navigate = useNavigate();

  // eslint-disable-next-line react-hooks/exhaustive-deps
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
    if (btnClick) {
      navigate(getRoute());
    }
  },[btnClick]);
  
  return (
    <>
      <div className="bg-[#f7f6f6] min-h-screen h-screen w-full">
        <div className="flex justify-end">
          <NavBar btnClick={btnClick} />
        </div>
        <MenuBar setBtnClick={setBtnClick} />
        <div className="h-screen w-full"></div>
      </div>
    </>
  );
};

export default DashboardPage;
