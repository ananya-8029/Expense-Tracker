import "../NavBar/NavBar.css";
import { dropDownList, searchIcon } from "../../utils/Icons";
import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearUser } from "../../Redux/Reducers/UsersSlice";
import { clearIncome } from "../../Redux/Reducers/IncomeSlice";
import { clearExpense } from "../../Redux/Reducers/ExpenseSlice";

const UserIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const SettingsIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const SignOutIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

// eslint-disable-next-line react/prop-types
const NavBar = ({ btnClick, pageTitle }) => {
  const [header, setHeader] = useState("Dashboard");
  const [isDropdown, setIsDropdown] = useState(false);
  const userData = useSelector((state) => state.userReducer?.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (pageTitle) { setHeader(pageTitle); return; }
    switch (btnClick) {
      case "homeIcon":        setHeader("Home"); break;
      case "dashBoardIcon":   setHeader("Dashboard"); break;
      case "transactionIcon": setHeader("Transaction Logs"); break;
      case "viewIncomeIcon":  setHeader("Income Insights"); break;
      case "viewExpensesIcon":setHeader("Spending Summary"); break;
      default:                setHeader("Dashboard"); break;
    }
  }, [btnClick, pageTitle]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdown(false);
      }
    };
    if (isDropdown) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDropdown]);

  const handleSignOut = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authTokenExpiration");
    dispatch(clearUser());
    dispatch(clearIncome());
    dispatch(clearExpense());
    navigate("/");
  };

  const menuItems = [
    { label: "Profile", icon: <UserIcon />, path: "/home_page/profile" },
    { label: "Settings", icon: <SettingsIcon />, path: "/home_page/settings" },
  ];

  return (
    <div className="h-12 md:h-[4vmax] w-full md:w-[95%] flex justify-center items-center fixed z-[5000]">
      <div className="h-full w-full md:w-[99%] flex justify-end items-center bg-white mt-2 md:mt-[1.5vmax] gap-3 md:gap-10 rounded-xl px-3 md:px-0">
        <div className="w-full flex justify-start">
          <span className="nav_header text-base md:text-[2vmax] font-bold mx-3 md:mx-[2vmax]">{header}</span>
        </div>
        <div className="hidden md:flex h-[60%] w-[45vmax] items-center relative">
          <div className="absolute left-2">{searchIcon}</div>
          <input
            className="search_bar bg-[#f7f6f6] h-full w-full rounded-xl py-[1vmax] px-[2.5vmax] focus:outline-none focus:ring-1 focus:ring-[#ab9ce3] focus:border-transparent text-[0.9vmax] font-light"
            type="text"
            placeholder="Search for transactions, expenses etc."
          />
        </div>

        {/* Profile dropdown container */}
        <div ref={dropdownRef} className="bg-[#f7f6f6] h-9 md:h-[3.2vmax] min-w-[120px] md:w-[30%] mx-2 md:mx-[1vmax] rounded-xl flex justify-center items-center relative flex-shrink-0">
          <div className="flex h-7 w-7 md:h-[2.8vmax] md:w-[3vmax] rounded-full mx-2 md:mx-[1vmax] flex-shrink-0">
            <img
              className="object-fill rounded-full h-full w-full"
              src={userData?.picture || "https://picsum.photos/id/1/200/300"}
              alt={userData?.username || "User"}
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="profile font-poppins flex-1 hidden sm:flex flex-col justify-center items-center">
            <span className="text-[#454242] text-sm md:text-[1.1vmax] font-medium">{userData?.username || ""}</span>
            <span className="text-[#929090] text-xs md:text-[0.8vmax] font-light">{userData?.email || ""}</span>
          </div>
          <button
            onClick={() => setIsDropdown((prev) => !prev)}
            className="flex items-center justify-center mx-2 md:mx-[1vmax] flex-shrink-0"
          >
            <span className={`transition-transform duration-200 ${isDropdown ? "rotate-180" : ""}`}>
              {dropDownList}
            </span>
          </button>

          {/* Dropdown menu */}
          {isDropdown && (
            <div className="absolute top-10 md:top-[3.8vmax] right-0 w-44 md:w-[16vmax] bg-white rounded-xl shadow-xl border border-[#f0eef8] z-50 overflow-hidden">
              {/* User info header */}
              <div className="px-[1.2vmax] py-[1vmax] border-b border-[#f0eef8] flex items-center gap-[0.8vmax]">
                <img
                  src={userData?.picture || "https://picsum.photos/id/1/200/300"}
                  referrerPolicy="no-referrer"
                  className="h-[2.2vmax] w-[2.2vmax] rounded-full object-cover flex-shrink-0"
                  alt=""
                />
                <p className="text-[#372b63] text-[0.85vmax] font-semibold truncate">{userData?.username}</p>
              </div>

              {/* Nav items */}
              <div className="py-1">
                {menuItems.map(({ label, icon, path }) => (
                  <button
                    key={label}
                    onClick={() => { navigate(path); setIsDropdown(false); }}
                    className="w-full flex items-center gap-[0.8vmax] px-[1.2vmax] py-[0.8vmax] text-[0.82vmax] text-[#454242] hover:bg-[#f7f6f6] hover:text-[#624FA4] transition-colors"
                  >
                    <span className="text-[#929090]">{icon}</span>
                    {label}
                  </button>
                ))}
              </div>

              {/* Sign out */}
              <div className="border-t border-[#f0eef8] py-1">
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-[0.8vmax] px-[1.2vmax] py-[0.8vmax] text-[0.82vmax] text-red-400 hover:bg-red-50 transition-colors"
                >
                  <span><SignOutIcon /></span>
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavBar;
