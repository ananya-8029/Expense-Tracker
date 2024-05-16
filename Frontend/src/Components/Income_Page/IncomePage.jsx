import { useSelector } from "react-redux";
import "../Income_Page/IncomePage.css";
import NavBar from "../NavBar/NavBar";
import MenuBar from "../Menu_Bar/MenuBar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import IncomeTrendsChart from "../../utils/IncomeTrendsChart";

const IncomePage = () => {
  const allIncomes = useSelector((state) => state.incomeReducer.incomes[0]);
  const [btnClick, setBtnClick] = useState("viewIncomeIcon");
  const navigate = useNavigate();

  const [incomeData, setIncomeData] = useState({
    labels: allIncomes.map((data) => data.date),
    datasets: [
      {
        label: "Users Gained",
        data: allIncomes.map((data) => data.amount),
      },
    ],
  });

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
        <MenuBar setBtnClick={setBtnClick} btnClick={btnClick} />
        <div className="h-screen w-full">
          <div className="h-[60%] w-full  flex pt-[5vmax] pl-[5vmax]">
            {allIncomes &&
              allIncomes.map((income) => (
                <div key={income._id}>
                  <div className="income-content bg-white flex flex-col justify-between items-start m-[1vmax] w-[15vmax] h-[15vmax] rounded-xl py-[1.5vmax] px-[2vmax] gap-3">
                    <div className="flex flex-col gap-1">
                      <div className="text-[1.3vmax] font-medium h-[4vmax]">
                        {income.title}
                      </div>
                      <div className="text-[0.8vmax] font-light h-[3vmax]">
                        {income.description}
                      </div>
                      <span className="income-content-timeStamp text-[#624FA4] text-[0.7vmax] text-[] font-semibold">
                        Timestamp:&nbsp;
                        {moment(income.date).format("YYYY-MM-DD")}
                      </span>
                    </div>
                    <button className="income-content-btn bg-[#F7F6F6] w-[7vmax] h-[2vmax] rounded-lg font-extralight text-[0.8vmax] transition-all hover:transition-all hover:scale-[0.9]">
                      Know More
                    </button>
                  </div>
                </div>
              ))}
          </div>
          <div className=" h-[40%] w-full">
            <IncomeTrendsChart incomeData={incomeData} />
          </div>
        </div>
      </div>
    </>
  );
};

export default IncomePage;
