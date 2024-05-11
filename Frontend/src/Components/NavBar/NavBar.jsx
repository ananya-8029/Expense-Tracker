import "../NavBar/NavBar.css";
import { dropDownList, searchIcon } from "../../utils/Icons";
import { useEffect, useState } from "react";

// eslint-disable-next-line react/prop-types
const NavBar = ({ btnClick }) => {
  const [header, setHeader] = useState("Dashboard");
  useEffect(() => {
    switch (btnClick) {
      case "dashBoardIcon":
        setHeader("Dashboard");
        break;
      case "transactionIcon":
        setHeader("Transactions");
        break;
      case "viewIncomeIcon":
        setHeader("Income");
        break;
      case "viewExpensesIcon":
        setHeader("Expenses");
        break;
      default:
        setHeader("Dashboard");
        break;
    }
  }, [btnClick]);

  return (
    <>
      <div className="h-[4vmax] w-[95%] flex justify-center items-center fixed">
        <div className="h-full w-[99%] flex justify-end items-center bg-white mt-[1.5vmax] gap-10 rounded-xl">
          <div className="w-full flex justify-start mx-[]">
            <span className="nav_header text-[2vmax] font-bold mx-[2vmax]">
              {header}
            </span>
          </div>
          <div className="h-[60%] w-[45vmax] flex items-center relative">
            <div className="absolute left-2">{searchIcon}</div>
            <input
              className="search_bar bg-[#f7f6f6] h-full w-full rounded-xl py-[1vmax]
              px-[2.5vmax] focus:outline-none focus:ring-1 focus:ring-[#ab9ce3] focus:border-transparent text-[0.9vmax] font-light"
              type="text"
              placeholder="Search for transactions, expenses etc."
            />
          </div>
          <div className="bg-[#f7f6f6] h-[3.2vmax] w-[17%] mx-[1vmax] rounded-xl flex justify-center items-center">
            <div className="flex flex-3 h-[2.8vmax] w-[3vmax] rounded-full mx-[1vmax]">
              <img
                className="object-fill rounded-full h-full w-full"
                src="https://picsum.photos/id/1/200/300"
                alt=""
              />
            </div>
            <div className="profile flex-1 flex flex-col justify-center items-center">
              <span className="text-[#454242] text-[1.1vmax] font-medium">
                User Name
              </span>
              <span className="text-[#929090] text-[0.8vmax] font-light">
                abc@gmail.com
              </span>
            </div>
            <button className="flex-2 flex items-center justify-center mx-[1vmax]">
              {dropDownList}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default NavBar;
