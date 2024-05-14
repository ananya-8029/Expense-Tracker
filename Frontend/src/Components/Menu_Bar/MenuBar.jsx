import { useState } from "react";
import {
  dashBoardIcon,
  homeIcon,
  signOuticon,
  transactionIcon,
  viewExpensesIcon,
  viewIncomeIcon,
} from "../../utils/Icons";
import "../Menu_Bar/MenuBar.css";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearUser } from "../../Redux/Reducers/UsersSlice";
import { clearIncome } from "../../Redux/Reducers/IncomeSlice";

// eslint-disable-next-line react/prop-types
const MenuBar = ({ setBtnClick, btnClick }) => {
  const [icon, setIcon] = useState(btnClick ? btnClick : "");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleActivebtn = (iconName) => {
    setIcon(iconName);
    setBtnClick(iconName);
  };

  const handleSignOut = () => {
    handleActivebtn("signOut");
    localStorage.removeItem("authTokenExpiration");
    localStorage.removeItem("authToken");
    dispatch(clearUser());
    dispatch(clearIncome())
    navigate("/user_login");
  };

  return (
    <>
      <div className="h-screen w-[5vmax] flex justify-center items-center fixed">
        <div className="h-[97%] w-[95%] bg-white rounded-xl mx-[0.5vmax] flex items-center flex-col">
          <div className="h-[25%] w-full flex justify-center items-center flex-col gap-10">
            <div className="h-[3vmax] w-[3vmax] rounded-full">
              <img
                className="object-fill rounded-full h-full w-full"
                src="https://picsum.photos/id/1/200/300"
                alt=""
              />
            </div>
            <div className="w-[85%] h-[25%] flex justify-center items-center relative overflow-hidden">
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
            <div className="mt-[2vmax] w-full h-full flex justify-center items-center cursor-pointer relative overflow-hidden">
              <div className={`${icon == "dashBoardIcon" ? "active" : ""}`}>
                <button
                  onClick={() => handleActivebtn("dashBoardIcon")}
                  className="relative z-[2] hover:scale-90 transition-all duration-300 hover:transition-all hover:duration-300"
                >
                  {dashBoardIcon}
                </button>
              </div>
            </div>
            <div className="w-full h-full flex justify-center items-center cursor-pointer hover:scale-90 transition-all duration-300 hover:transition-all hover:duration-300 relative overflow-hidden">
              <div className={`${icon == "transactionIcon" ? "active" : ""}`}>
                <button
                  onClick={() => handleActivebtn("transactionIcon")}
                  className="relative z-[2] hover:scale-90 transition-all duration-300 hover:transition-all hover:duration-300"
                >
                  {transactionIcon}
                </button>
              </div>
            </div>
            <div className="w-full h-full flex justify-center items-center cursor-pointer hover:scale-90 transition-all duration-300 hover:transition-all hover:duration-300 relative overflow-hidden">
              <div className={`${icon == "viewIncomeIcon" ? "active" : ""}`}>
                <button
                  onClick={() => handleActivebtn("viewIncomeIcon")}
                  className="relative z-[2] hover:scale-90 transition-all duration-300 hover:transition-all hover:duration-300"
                >
                  {viewIncomeIcon}
                </button>
              </div>
            </div>
            <div className="mb-[2vmax] w-full h-full flex justify-center items-center cursor-pointer relative overflow-hidden">
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
          <div className="h-[30%] w-[95%] flex justify-center items-end py-[2vmax]">
            <div className="w-full h-[30%] flex justify-center items-center relative overflow-hidden">
              <div className={`${icon == "signOut" ? "active" : ""}`}>
                <button
                  onClick={handleSignOut}
                  className="relative z-[2] hover:scale-90 transition-all duration-300 hover:transition-all hover:duration-300"
                >
                  {signOuticon}
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
