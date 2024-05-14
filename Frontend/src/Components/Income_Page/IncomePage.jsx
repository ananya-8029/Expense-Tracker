import { useSelector } from "react-redux";
import "../Income_Page/IncomePage.css";
import NavBar from "../NavBar/NavBar";
import MenuBar from "../Menu_Bar/MenuBar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const IncomePage = () => {
  const allIncomes = useSelector((state) => state.incomeReducer.incomes[0]);
  const [btnClick, setBtnClick] = useState("viewIncomeIcon");
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
  }, [btnClick]);
  return (
    <>
      <div className="bg-[#f7f6f6] min-h-screen h-screen w-full">
        <div className="flex justify-end">
          <NavBar btnClick={btnClick} />
        </div>
        <MenuBar setBtnClick={setBtnClick} btnClick={btnClick}/>
        <div className="h-screen w-full">
          <div className="h-[60%] w-full  flex pt-[5vmax] pl-[5vmax]">
            {allIncomes &&
              allIncomes.map((income) => (
                <>
                  <div
                    className="income-content bg-white flex flex-col justify-between items-start m-[1vmax] w-[15vmax] h-[15vmax] rounded-xl p-[2vmax] gap-5"
                    key={income._id}
                  >
                    <div className="flex flex-col gap-5">
                      <div className="text-[1.4vmax] font-medium">
                        {income.title}
                      </div>
                      <div className="text-[0.8vmax] font-light">
                        {income.description}
                      </div>
                    </div>
                    <button className="bg-[#F7F6F6] w-[7vmax] h-[2vmax] rounded-lg font-extralight text-[0.8vmax] transition-all hover:transition-all hover:scale-[0.9]">
                      Know More
                    </button>
                  </div>
                </>
              ))}
          </div>
          <div className=" h-[40%] w-full"></div>
        </div>
      </div>
    </>
  );
};

export default IncomePage;
