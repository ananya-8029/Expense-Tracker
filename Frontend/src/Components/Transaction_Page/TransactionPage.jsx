import MenuBar from "../Menu_Bar/MenuBar";
import NavBar from "../NavBar/NavBar";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AddTansactionButton from "../../utils/AddTansactionButton";

const TransactionPage = () => {
  const [btnClick, setBtnClick] = useState("transactionIcon");
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [btnClick]);

  return (
    <>
      <div className="bg-[#f7f6f6] min-h-screen h-screen w-full">
        <div className="flex justify-end">
          <NavBar btnClick={btnClick} />
        </div>
        <MenuBar setBtnClick={setBtnClick} btnClick={btnClick} />
        <div className="h-screen w-full flex items-end justify-end">
          <div className="h-[89%] w-[95%] flex justify-center">
            <div className="px-[1vmax] w-full h-14 flex justify-between items-center mx-1 font-poppins">
              <div>Filter By:</div>
              <div className="">
                <AddTansactionButton />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TransactionPage;
