import {
  dashBoardIcon,
  transactionIcon,
  viewExpensesIcon,
  viewIncomeIcon,
} from "../../utils/Icons";

const MenuBar = () => {
  return (
    <>
      <div className="h-screen w-[5vmax] flex justify-center items-center">
        <div className="h-[97%] w-[95%] bg-white rounded-xl mx-[0.5vmax] flex items-center flex-col">
          <div className="h-[25%] w-full flex justify-center items-center">
            <div className="h-[3vmax] w-[3vmax] rounded-full border-2 border-purple-500"></div>
          </div>
          <div className=" flex flex-col justify-center items-center h-[45%] gap-[3vmax] border-y-[4px] w-[80%] border-[#F7F6F6]">
            <div className="mt-[2vmax] w-full h-[20%] flex justify-center items-center cursor-pointer hover:scale-90 transition-all duration-300 hover:transition-all hover:duration-300 relative">
              <div className="before:h-full before:w-[150%] before:absolute before:bg-[#F7F6F6] before:rounded-md before:top-0 before:left-0">
                <span className="relative z-[2]">{dashBoardIcon}</span>
              </div>
            </div>
            <div className="w-full h-[20%] flex justify-center items-center cursor-pointer hover:scale-90 transition-all duration-300 hover:transition-all hover:duration-300 relative">
              <div className="before:h-full before:w-[150%] before:absolute before:bg-[#F7F6F6] before:rounded-md before:top-0 before:left-0">
                <span className="relative z-[2]">{transactionIcon}</span>
              </div>
            </div>
            <div className="bg-orange-400 w-full h-[20%] flex justify-center items-center cursor-pointer hover:scale-90 transition-all duration-300 hover:transition-all hover:duration-300">
              <div>{viewIncomeIcon}</div>
            </div>
            <div className="bg-red-400 w-full h-[20%] flex justify-center items-center cursor-pointer hover:scale-90 transition-all duration-300 hover:transition-all hover:duration-300">
              <div>{viewExpensesIcon}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MenuBar;
