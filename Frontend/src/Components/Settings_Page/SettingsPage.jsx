import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../NavBar/NavBar";
import MenuBar from "../Menu_Bar/MenuBar";
import useAuthGuard from "../../utils/useAuthGuard";
import { clearUser } from "../../Redux/Reducers/UsersSlice";
import { clearIncome } from "../../Redux/Reducers/IncomeSlice";
import { clearExpense } from "../../Redux/Reducers/ExpenseSlice";

const SettingsPage = () => {
  useAuthGuard();
  const [btnClick, setBtnClick] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.userReducer?.user);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleMenuClick = (icon) => {
    setBtnClick(icon);
    if (userData?.role === "admin") { navigate("/admin/dashboard"); return; }
    const routes = {
      homeIcon: "/home_page/home",
      dashBoardIcon: "/home_page/dashboard",
      transactionIcon: "/home_page/transactions",
      viewIncomeIcon: "/home_page/incomes",
      viewExpensesIcon: "/home_page/expenses",
    };
    if (routes[icon]) navigate(routes[icon]);
  };

  const handleSignOut = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authTokenExpiration");
    dispatch(clearUser());
    dispatch(clearIncome());
    dispatch(clearExpense());
    navigate("/");
  };

  const sections = [
    {
      title: "Account",
      items: [
        {
          label: "Profile Information",
          description: "View your name, email, and account details",
          action: () => navigate("/home_page/profile"),
          actionLabel: "View Profile",
          variant: "default",
        },
        {
          label: "Sign Out",
          description: "Sign out from your account on this device",
          action: handleSignOut,
          actionLabel: "Sign Out",
          variant: "warning",
        },
      ],
    },
    {
      title: "About",
      items: [
        {
          label: "App Version",
          description: "BudgetBuddy v1.0.0",
          action: null,
          actionLabel: null,
        },
        {
          label: "AI Model",
          description: "Powered by Google Gemini Flash",
          action: null,
          actionLabel: null,
        },
        {
          label: "Data Storage",
          description: "Your data is securely stored in MongoDB Atlas",
          action: null,
          actionLabel: null,
        },
      ],
    },
  ];

  const isAdmin = userData?.role === "admin";

  return (
    <div className="bg-[#f7f6f6] min-h-screen h-screen w-full">
      {!isAdmin && (
        <div className="flex justify-end">
          <NavBar btnClick={btnClick} pageTitle="Settings" />
        </div>
      )}
      {!isAdmin && <MenuBar setBtnClick={handleMenuClick} btnClick={btnClick} />}

      <div className="h-screen w-full flex items-end justify-end">
        <div className={`${isAdmin ? "h-full w-full pt-[1.5vmax]" : "h-[89%] w-[95%]"} flex flex-col px-[2vmax] pb-[1.5vmax] gap-[1.5vmax] overflow-y-auto`}>

          {/* Header */}
          <div>
            {userData?.role === "admin" && (
              <button
                onClick={() => navigate("/admin/dashboard")}
                className="flex items-center gap-1 text-[#624FA4] hover:text-[#372b63] text-[0.78vmax] mb-[0.6vmax] transition-colors"
              >
                ← Back to Admin Dashboard
              </button>
            )}
            <h1 className="text-[1.8vmax] font-bold text-[#372b63]">Settings</h1>
            <p className="text-[#929090] text-[0.82vmax]">Manage your account and preferences</p>
          </div>

          {/* User summary */}
          <div className="bg-gradient-to-r from-[#624FA4] to-[#372b63] rounded-2xl px-[2vmax] py-[1.5vmax] flex items-center gap-[1.5vmax]">
            <img
              src={userData?.picture || "https://picsum.photos/id/1/200/300"}
              alt={userData?.username}
              referrerPolicy="no-referrer"
              className="h-[4vmax] w-[4vmax] rounded-full object-cover border-2 border-white border-opacity-40 flex-shrink-0"
            />
            <div>
              <p className="text-white text-[1.1vmax] font-bold">{userData?.username || "User"}</p>
              <p className="text-white text-opacity-70 text-[0.78vmax]">{userData?.email}</p>
            </div>
            <div className="ml-auto">
              <span className={`text-[0.7vmax] px-3 py-1 rounded-full font-medium ${
                userData?.role === "admin" ? "bg-white bg-opacity-20 text-white" : "bg-white bg-opacity-20 text-white"
              }`}>
                {userData?.role === "admin" ? "Administrator" : "User"}
              </span>
            </div>
          </div>

          {/* Settings sections */}
          {sections.map((section) => (
            <div key={section.title} className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="px-[2vmax] py-[1vmax] border-b border-[#f7f6f6]">
                <h3 className="text-[#372b63] text-[0.9vmax] font-semibold">{section.title}</h3>
              </div>
              <div className="divide-y divide-[#f7f6f6]">
                {section.items.map((item) => (
                  <div key={item.label} className="flex items-center justify-between px-[2vmax] py-[1.2vmax]">
                    <div>
                      <p className="text-[#454242] text-[0.85vmax] font-medium">{item.label}</p>
                      <p className="text-[#929090] text-[0.75vmax] mt-0.5">{item.description}</p>
                    </div>
                    {item.action && (
                      <button
                        onClick={item.action}
                        className={`text-[0.78vmax] px-[1.2vmax] py-[0.5vmax] rounded-lg font-medium transition-colors ${
                          item.variant === "warning"
                            ? "text-red-400 hover:bg-red-50 border border-red-200"
                            : item.variant === "danger"
                            ? "text-white bg-red-400 hover:bg-red-500"
                            : "text-[#624FA4] hover:bg-[#ede9fb] border border-[#c4b8f0]"
                        }`}
                      >
                        {item.actionLabel}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
