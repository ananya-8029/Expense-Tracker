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
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "../../Redux/Reducers/UsersSlice";
import { clearIncome } from "../../Redux/Reducers/IncomeSlice";
import { clearExpense } from "../../Redux/Reducers/ExpenseSlice";
import { Audio } from "react-loader-spinner";

const Tooltip = ({ label }) => (
  <span className="absolute left-full ml-3 bg-[#372b63] text-white text-[0.72vmax] font-medium px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-[9999] shadow-lg">
    {label}
  </span>
);

// eslint-disable-next-line react/prop-types
const MenuBar = ({ setBtnClick, btnClick }) => {
  const [icon, setIcon] = useState(btnClick ? btnClick : "");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.userReducer?.user);

  const handleActivebtn = (iconName) => {
    setIcon(iconName);
    setBtnClick(iconName);
  };

  const handleSignOut = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate("/");
    }, 2500);
    handleActivebtn("signOut");
    localStorage.removeItem("authTokenExpiration");
    localStorage.removeItem("authToken");
    dispatch(clearUser());
    dispatch(clearIncome());
    dispatch(clearExpense());
  };

  const navItems = [
    { key: "homeIcon",         icon: homeIcon,         label: "Home" },
    { key: "dashBoardIcon",    icon: dashBoardIcon,    label: "Dashboard" },
    { key: "transactionIcon",  icon: transactionIcon,  label: "Transactions" },
    { key: "viewIncomeIcon",   icon: viewIncomeIcon,   label: "Income" },
    { key: "viewExpensesIcon", icon: viewExpensesIcon, label: "Expenses" },
  ];

  return (
    <>
      {isLoading && (
        <div className="absolute top-0 left-0 w-screen h-screen flex justify-center items-center bg-black bg-opacity-50 z-[10000]">
          <Audio type="TailSpin" color="#ffffff" height={80} width={80} />
        </div>
      )}

      {/* ── Desktop sidebar (md and up) ── */}
      <div className="hidden md:flex h-screen w-[5vmax] justify-center items-center fixed z-[100]">
        <div className="h-[97%] w-[95%] bg-white rounded-xl mx-[0.5vmax] flex items-center flex-col">

          {/* Avatar + Home */}
          <div className="h-[25%] w-full flex justify-center items-center flex-col gap-10">
            <div className="h-[3vmax] w-[3vmax] rounded-full">
              <img
                className="object-fill rounded-full h-full w-full"
                src={userData?.picture || "https://picsum.photos/id/1/200/300"}
                alt={userData?.username || "User"}
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="group w-[85%] h-[25%] flex justify-center items-center relative">
              <div className={`relative overflow-hidden w-full h-full flex justify-center items-center ${icon === "homeIcon" ? "active" : ""}`}>
                <button onClick={() => handleActivebtn("homeIcon")} className="relative z-[2] hover:scale-90 transition-all duration-300">
                  {homeIcon}
                </button>
              </div>
              <Tooltip label="Home" />
            </div>
          </div>

          {/* Main nav icons */}
          <div className="flex flex-col justify-center items-center h-[45%] gap-[1.5vmax] border-y-[4px] w-[80%] border-[#F7F6F6]">
            <div className="group mt-[2vmax] w-full h-full flex justify-center items-center relative">
              <div className={`relative overflow-hidden w-full h-full flex justify-center items-center ${icon === "dashBoardIcon" ? "active" : ""}`}>
                <button onClick={() => handleActivebtn("dashBoardIcon")} className="relative z-[2] hover:scale-90 transition-all duration-300">
                  {dashBoardIcon}
                </button>
              </div>
              <Tooltip label="Dashboard" />
            </div>

            <div className="group w-full h-full flex justify-center items-center relative">
              <div className={`relative overflow-hidden w-full h-full flex justify-center items-center ${icon === "transactionIcon" ? "active" : ""}`}>
                <button onClick={() => handleActivebtn("transactionIcon")} className="relative z-[2] hover:scale-90 transition-all duration-300">
                  {transactionIcon}
                </button>
              </div>
              <Tooltip label="Transactions" />
            </div>

            <div className="group w-full h-full flex justify-center items-center relative">
              <div className={`relative overflow-hidden w-full h-full flex justify-center items-center ${icon === "viewIncomeIcon" ? "active" : ""}`}>
                <button onClick={() => handleActivebtn("viewIncomeIcon")} className="relative z-[2] hover:scale-90 transition-all duration-300">
                  {viewIncomeIcon}
                </button>
              </div>
              <Tooltip label="Income" />
            </div>

            <div className="group mb-[2vmax] w-full h-full flex justify-center items-center relative">
              <div className={`relative overflow-hidden w-full h-full flex justify-center items-center ${icon === "viewExpensesIcon" ? "active" : ""}`}>
                <button onClick={() => handleActivebtn("viewExpensesIcon")} className="relative z-[2] hover:scale-90 transition-all duration-300">
                  {viewExpensesIcon}
                </button>
              </div>
              <Tooltip label="Expenses" />
            </div>
          </div>

          {/* Sign Out */}
          <div className="h-[30%] w-[95%] flex justify-center items-end py-[2vmax]">
            <div className="group w-full h-[30%] flex justify-center items-center relative">
              <div className={`relative overflow-hidden w-full h-full flex justify-center items-center ${icon === "signOut" ? "active" : ""}`}>
                <button onClick={handleSignOut} className="relative z-[2] hover:scale-90 transition-all duration-300">
                  {signOuticon}
                </button>
              </div>
              <Tooltip label="Sign Out" />
            </div>
          </div>

        </div>
      </div>

      {/* ── Mobile bottom nav (below md) ── */}
      <div className="flex md:hidden fixed bottom-0 left-0 right-0 z-[100] bg-white border-t border-[#f0eef8] shadow-lg">
        <div className="w-full flex items-center justify-around h-14 px-1">
          {navItems.map(({ key, icon: navIcon, label }) => (
            <button
              key={key}
              onClick={() => handleActivebtn(key)}
              className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors ${
                icon === key ? "text-[#624FA4]" : "text-[#929090]"
              }`}
              aria-label={label}
            >
              <span className={`transition-transform ${icon === key ? "scale-110" : ""}`}>
                {navIcon}
              </span>
              <span className="text-[9px] font-medium">{label}</span>
            </button>
          ))}
          <button
            onClick={handleSignOut}
            className="flex flex-col items-center justify-center gap-0.5 flex-1 h-full text-[#929090] transition-colors"
            aria-label="Sign Out"
          >
            <span>{signOuticon}</span>
            <span className="text-[9px] font-medium">Sign Out</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default MenuBar;
