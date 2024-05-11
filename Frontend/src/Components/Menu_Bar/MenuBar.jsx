import { useState } from "react";
import {
  dashBoardIcon,
  homeIcon,
  transactionIcon,
  viewExpensesIcon,
  viewIncomeIcon,
} from "../../utils/Icons";
import "../Menu_Bar/MenuBar.css";

const MenuBar = () => {
  const [icon, setIcon] = useState("dashBoardIcon");
  const handleActivebtn = (iconName) => {
    setIcon(iconName);
  };

  console.log(icon);
  return (
    <>
      <div className="h-screen w-[5vmax] flex justify-center items-center">
        <div className="h-[97%] w-[95%] bg-white rounded-xl mx-[0.5vmax] flex items-center flex-col">
          <div className="h-[25%] w-full flex justify-center items-center flex-col gap-10">
            <div className="h-[3vmax] w-[3vmax] rounded-full">
              <img className="object-fill rounded-full h-full w-full" src="https://picsum.photos/id/1/200/300" alt="" />
            </div>
            <div className="w-[85%] h-[25%] flex justify-center items-center relative">
              <div className={`${icon == "homeIcon" ? "active" : ""}`}>
                <button
                  onClick={() => handleActivebtn("homeIcon")}
                  className="relative z-[2] hover:scale-90 transition-all duration-300 hover:transition-all hover:duration-300"
                >
                  {homeIcon}
                </button>
              </div>
            </div>
          </div>
          <div className=" flex flex-col justify-center items-center h-[45%] gap-[1.5vmax] border-y-[4px] w-[80%] border-[#F7F6F6]">
            <div className="mt-[2vmax] w-full h-full flex justify-center items-center cursor-pointer relative">
              <div className={`${icon == "dashBoardIcon" ? "active" : ""}`}>
                <button
                  onClick={() => handleActivebtn("dashBoardIcon")}
                  className="relative z-[2] hover:scale-90 transition-all duration-300 hover:transition-all hover:duration-300"
                >
                  {dashBoardIcon}
                </button>
              </div>
            </div>
            <div className="w-full h-full flex justify-center items-center cursor-pointer hover:scale-90 transition-all duration-300 hover:transition-all hover:duration-300 relative">
              <div className={`${icon == "transactionIcon" ? "active" : ""}`}>
                <button
                  onClick={() => handleActivebtn("transactionIcon")}
                  className="relative z-[2] hover:scale-90 transition-all duration-300 hover:transition-all hover:duration-300"
                >
                  {transactionIcon}
                </button>
              </div>
            </div>
            <div className="w-full h-full flex justify-center items-center cursor-pointer hover:scale-90 transition-all duration-300 hover:transition-all hover:duration-300 relative">
              <div className={`${icon == "viewIncomeIcon" ? "active" : ""}`}>
                <button
                  onClick={() => handleActivebtn("viewIncomeIcon")}
                  className="relative z-[2] hover:scale-90 transition-all duration-300 hover:transition-all hover:duration-300"
                >
                  {viewIncomeIcon}
                </button>
              </div>
            </div>
            <div className="mb-[2vmax] w-full h-full flex justify-center items-center cursor-pointer relative">
              <div className={`${icon == "viewExpensesIcon" ? "active" : ""}`}>
                <button
                  onClick={() => handleActivebtn("viewExpensesIcon")}
                  className="relative z-[2] hover:scale-90 transition-all duration-300 hover:transition-all hover:duration-300"
                >
                  {viewExpensesIcon}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MenuBar;
