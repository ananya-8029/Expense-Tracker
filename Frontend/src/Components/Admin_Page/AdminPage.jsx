import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import moment from "moment";
import { Bar, Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import { clearUser } from "../../Redux/Reducers/UsersSlice";
import { clearIncome } from "../../Redux/Reducers/IncomeSlice";
import { clearExpense } from "../../Redux/Reducers/ExpenseSlice";
import defaultAvatar from "../../utils/defaultAvatar";

const MONTHS = Array.from({ length: 6 }, (_, i) => {
  const d = new Date();
  d.setMonth(d.getMonth() - (5 - i));
  return { year: d.getFullYear(), month: d.getMonth() + 1, label: moment(d).format("MMM YY") };
});

const mapMonthlyData = (mongoData) =>
  MONTHS.map((m) => {
    const found = mongoData.find(
      (d) => d._id.year === m.year && d._id.month === m.month
    );
    return found?.total || 0;
  });

const DropdownArrow = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDropdown, setIsDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const adminUser = useSelector((state) => state.userReducer?.user);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsDropdown(false);
    };
    if (isDropdown) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDropdown]);

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) { navigate("/"); return; }
    const headers = { "auth-token": authToken };

    const API = import.meta.env.VITE_API_URL || "http://localhost:8000";
    Promise.all([
      axios.get(`${API}/api/admin/users`, { headers }),
      axios.get(`${API}/api/admin/analytics`, { headers }),
    ])
      .then(([usersRes, analyticsRes]) => {
        setUsers(usersRes.data);
        setAnalytics(analyticsRes.data);
        setLoading(false);
      })
      .catch((err) => {
        if (err.response?.status === 403) navigate("/");
        setLoading(false);
      });
  }, [navigate]);

  const handleSignOut = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authTokenExpiration");
    dispatch(clearUser());
    dispatch(clearIncome());
    dispatch(clearExpense());
    navigate("/");
  };

  const regularUsers = users.filter((u) => u.role === "user");
  const totalIncome = users.reduce((s, u) => s + u.totalIncome, 0);
  const totalExpense = users.reduce((s, u) => s + u.totalExpense, 0);
  const totalRecords = users.reduce(
    (s, u) => s + u.incomeCount + u.expenseCount + u.transactionCount, 0
  );

  // Monthly trends chart
  const trendsChartData = analytics
    ? {
        labels: MONTHS.map((m) => m.label),
        datasets: [
          {
            label: "Income",
            data: mapMonthlyData(analytics.monthlyIncome),
            borderColor: "#624FA4",
            backgroundColor: "rgba(98,79,164,0.1)",
            tension: 0.4,
            fill: true,
            pointBackgroundColor: "#624FA4",
          },
          {
            label: "Expenses",
            data: mapMonthlyData(analytics.monthlyExpense),
            borderColor: "#f87171",
            backgroundColor: "rgba(248,113,113,0.1)",
            tension: 0.4,
            fill: true,
            pointBackgroundColor: "#f87171",
          },
        ],
      }
    : null;

  // Per-user income vs expense (top 8 by activity)
  const topUsers = [...regularUsers]
    .sort((a, b) => (b.totalIncome + b.totalExpense) - (a.totalIncome + a.totalExpense))
    .slice(0, 8);

  const userComparisonData = {
    labels: topUsers.map((u) => u.username.split(" ")[0]),
    datasets: [
      {
        label: "Income",
        data: topUsers.map((u) => u.totalIncome),
        backgroundColor: "rgba(98,79,164,0.8)",
        borderRadius: 4,
      },
      {
        label: "Expenses",
        data: topUsers.map((u) => u.totalExpense),
        backgroundColor: "rgba(248,113,113,0.8)",
        borderRadius: 4,
      },
    ],
  };

  // Top expense categories
  const expenseCatData = analytics
    ? {
        labels: analytics.topExpenseCategories.map((c) => c._id || "Other"),
        datasets: [
          {
            label: "Total (₹)",
            data: analytics.topExpenseCategories.map((c) => c.total),
            backgroundColor: [
              "rgba(248,113,113,0.85)",
              "rgba(251,146,60,0.85)",
              "rgba(250,204,21,0.85)",
              "rgba(74,222,128,0.85)",
              "rgba(96,165,250,0.85)",
              "rgba(167,139,250,0.85)",
            ],
            borderRadius: 4,
          },
        ],
      }
    : null;

  // Top income categories
  const incomeCatData = analytics
    ? {
        labels: analytics.topIncomeCategories.map((c) => c._id || "Other"),
        datasets: [
          {
            label: "Total (₹)",
            data: analytics.topIncomeCategories.map((c) => c.total),
            backgroundColor: [
              "rgba(98,79,164,0.85)",
              "rgba(129,140,248,0.85)",
              "rgba(96,165,250,0.85)",
              "rgba(52,211,153,0.85)",
              "rgba(251,191,36,0.85)",
              "rgba(244,114,182,0.85)",
            ],
            borderRadius: 4,
          },
        ],
      }
    : null;

  const chartOptions = (title) => ({
    responsive: true,
    plugins: { legend: { display: true }, title: { display: false } },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: "#f3f4f6" } },
    },
  });

  return (
    <div className="bg-[#f7f6f6] min-h-screen w-full" style={{ fontFamily: "Poppins, sans-serif" }}>

      {/* Top bar */}
      <div className="bg-white h-[4.5vmax] flex items-center justify-between px-[3vmax] shadow-sm fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center gap-3">
          <span className="text-[1.8vmax] font-bold tracking-tight text-[#372b63]">BUDGETBUDDY</span>
          <span className="bg-[#624FA4] text-white text-[0.65vmax] font-semibold px-2 py-1 rounded-full uppercase tracking-wider">
            Admin
          </span>
        </div>
        <div ref={dropdownRef} className="relative">
          <button
            onClick={() => setIsDropdown((p) => !p)}
            className="flex items-center gap-2 bg-[#f7f6f6] hover:bg-[#ede9fb] rounded-xl px-[1vmax] py-[0.5vmax] transition-colors"
          >
            <img
              src={adminUser?.picture || defaultAvatar}
              alt="admin"
              referrerPolicy="no-referrer"
              className="h-[2.2vmax] w-[2.2vmax] rounded-full object-cover"
            />
            <span className="text-[0.85vmax] text-[#454242] font-medium">{adminUser?.username}</span>
            <span className={`text-[#929090] transition-transform duration-200 ${isDropdown ? "rotate-180" : ""}`}>
              <DropdownArrow />
            </span>
          </button>

          {isDropdown && (
            <div className="absolute top-[3.2vmax] right-0 w-[16vmax] bg-white rounded-xl shadow-xl border border-[#f0eef8] z-50 overflow-hidden">
              <div className="px-[1.2vmax] py-[1vmax] border-b border-[#f0eef8] flex items-center gap-[0.8vmax]">
                <img
                  src={adminUser?.picture || defaultAvatar}
                  referrerPolicy="no-referrer"
                  className="h-[2.2vmax] w-[2.2vmax] rounded-full object-cover flex-shrink-0"
                  alt=""
                />
                <p className="text-[#372b63] text-[0.85vmax] font-semibold truncate">{adminUser?.username}</p>
              </div>
              <div className="py-1">
                {[
                  { label: "Profile", path: "/home_page/profile" },
                  { label: "Settings", path: "/home_page/settings" },
                ].map(({ label, path }) => (
                  <button
                    key={label}
                    onClick={() => { navigate(path); setIsDropdown(false); }}
                    className="w-full text-left px-[1.2vmax] py-[0.8vmax] text-[0.82vmax] text-[#454242] hover:bg-[#f7f6f6] hover:text-[#624FA4] transition-colors"
                  >
                    {label}
                  </button>
                ))}
              </div>
              <div className="border-t border-[#f0eef8] py-1">
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-[1.2vmax] py-[0.8vmax] text-[0.82vmax] text-red-400 hover:bg-red-50 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="pt-[6vmax] px-[3vmax] pb-[4vmax]">
        <h1 className="text-[1.4vmax] font-semibold text-[#372b63] mb-[2vmax]">Analytics Dashboard</h1>

        {loading ? (
          <p className="text-[#929090] text-[0.9vmax]">Loading analytics...</p>
        ) : (
          <>
            {/* Summary cards */}
            <div className="grid grid-cols-4 gap-[1.5vmax] mb-[2vmax]">
              {[
                { label: "Registered Users", value: regularUsers.length, color: "text-[#624FA4]", sub: `${users.length} total accounts` },
                { label: "Platform Income", value: `₹${totalIncome.toLocaleString()}`, color: "text-green-500", sub: `${users.reduce((s, u) => s + u.incomeCount, 0)} records` },
                { label: "Platform Expenses", value: `₹${totalExpense.toLocaleString()}`, color: "text-red-400", sub: `${users.reduce((s, u) => s + u.expenseCount, 0)} records` },
                {
                  label: "Net Balance",
                  value: `₹${Math.abs(totalIncome - totalExpense).toLocaleString()}`,
                  color: totalIncome - totalExpense >= 0 ? "text-green-500" : "text-red-400",
                  sub: totalIncome - totalExpense >= 0 ? "Surplus" : "Deficit",
                },
              ].map(({ label, value, color, sub }) => (
                <div key={label} className="bg-white rounded-xl p-[1.8vmax] shadow-sm">
                  <p className="text-[0.75vmax] text-[#929090] uppercase tracking-wider mb-1">{label}</p>
                  <p className={`text-[1.9vmax] font-bold ${color}`}>{value}</p>
                  <p className="text-[0.75vmax] text-[#b0aeae] mt-1">{sub}</p>
                </div>
              ))}
            </div>

            {/* Monthly Trends — full width */}
            {trendsChartData && (
              <div className="bg-white rounded-xl p-[2vmax] shadow-sm mb-[2vmax]">
                <h2 className="text-[1vmax] font-semibold text-[#372b63] mb-[1.5vmax]">
                  Platform Monthly Trends — Last 6 Months
                </h2>
                <div className="h-[20vmax]">
                  <Line
                    data={trendsChartData}
                    options={{ ...chartOptions(), maintainAspectRatio: false }}
                  />
                </div>
              </div>
            )}

            {/* User comparison + Top categories side by side */}
            <div className="flex gap-[1.5vmax] mb-[2vmax]">

              {/* Per-user Income vs Expense */}
              <div className="bg-white rounded-xl p-[2vmax] shadow-sm flex-[3]">
                <h2 className="text-[1vmax] font-semibold text-[#372b63] mb-[1.5vmax]">
                  Income vs Expense per User
                </h2>
                {topUsers.length === 0 ? (
                  <p className="text-[#929090] text-[0.85vmax]">No user data yet.</p>
                ) : (
                  <div className="h-[18vmax]">
                    <Bar
                      data={userComparisonData}
                      options={{ ...chartOptions(), maintainAspectRatio: false }}
                    />
                  </div>
                )}
              </div>

              {/* Top Expense Categories */}
              <div className="bg-white rounded-xl p-[2vmax] shadow-sm flex-[2]">
                <h2 className="text-[1vmax] font-semibold text-[#372b63] mb-[1.5vmax]">
                  Top Expense Categories
                </h2>
                {expenseCatData && expenseCatData.labels.length > 0 ? (
                  <div className="h-[18vmax]">
                    <Bar
                      data={expenseCatData}
                      options={{
                        ...chartOptions(),
                        maintainAspectRatio: false,
                        indexAxis: "y",
                        plugins: { legend: { display: false } },
                      }}
                    />
                  </div>
                ) : (
                  <p className="text-[#929090] text-[0.85vmax]">No expense data yet.</p>
                )}
              </div>

              {/* Top Income Categories */}
              <div className="bg-white rounded-xl p-[2vmax] shadow-sm flex-[2]">
                <h2 className="text-[1vmax] font-semibold text-[#372b63] mb-[1.5vmax]">
                  Top Income Categories
                </h2>
                {incomeCatData && incomeCatData.labels.length > 0 ? (
                  <div className="h-[18vmax]">
                    <Bar
                      data={incomeCatData}
                      options={{
                        ...chartOptions(),
                        maintainAspectRatio: false,
                        indexAxis: "y",
                        plugins: { legend: { display: false } },
                      }}
                    />
                  </div>
                ) : (
                  <p className="text-[#929090] text-[0.85vmax]">No income data yet.</p>
                )}
              </div>
            </div>

            {/* Users table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="px-[2vmax] py-[1.5vmax] border-b border-[#f7f6f6] flex items-center justify-between">
                <h2 className="text-[1.1vmax] font-semibold text-[#372b63]">All Users</h2>
                <span className="text-[0.8vmax] text-[#929090]">{users.length} accounts</span>
              </div>
              <table className="w-full text-[0.83vmax]">
                <thead>
                  <tr className="bg-[#f7f6f6] text-[#929090] font-normal">
                    <th className="text-left p-3 font-normal">User</th>
                    <th className="text-left p-3 font-normal">Email</th>
                    <th className="text-left p-3 font-normal">Role</th>
                    <th className="text-left p-3 font-normal">Member Since</th>
                    <th className="text-right p-3 font-normal">Incomes</th>
                    <th className="text-right p-3 font-normal">Total Income</th>
                    <th className="text-right p-3 font-normal">Expenses</th>
                    <th className="text-right p-3 font-normal">Total Expense</th>
                    <th className="text-right p-3 font-normal">Transactions</th>
                    <th className="text-right p-3 font-normal">Net</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => {
                    const net = u.totalIncome - u.totalExpense;
                    return (
                      <tr key={u._id} className="border-t border-[#f7f6f6] hover:bg-[#fafafa]">
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <div className="h-[2vmax] w-[2vmax] rounded-full bg-[#e8e3f7] flex items-center justify-center text-[#624FA4] font-semibold text-[0.75vmax] uppercase flex-shrink-0">
                              {u.username?.charAt(0)}
                            </div>
                            <span className="truncate max-w-[8vmax]">{u.username}</span>
                          </div>
                        </td>
                        <td className="p-3 text-[#929090]">{u.email}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-[0.7vmax] font-semibold ${
                            u.role === "admin"
                              ? "bg-[#e8e3f7] text-[#624FA4]"
                              : "bg-blue-50 text-blue-500"
                          }`}>
                            {u.role === "admin" ? "Admin" : "User"}
                          </span>
                        </td>
                        <td className="p-3 text-[#929090]">{moment(u.memberSince).format("DD MMM YYYY")}</td>
                        <td className="p-3 text-right">{u.incomeCount}</td>
                        <td className="p-3 text-right font-medium text-green-500">
                          ₹{u.totalIncome.toLocaleString()}
                        </td>
                        <td className="p-3 text-right">{u.expenseCount}</td>
                        <td className="p-3 text-right font-medium text-red-400">
                          ₹{u.totalExpense.toLocaleString()}
                        </td>
                        <td className="p-3 text-right">{u.transactionCount}</td>
                        <td className={`p-3 text-right font-semibold ${net >= 0 ? "text-green-500" : "text-red-400"}`}>
                          {net >= 0 ? "+" : "-"}₹{Math.abs(net).toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
