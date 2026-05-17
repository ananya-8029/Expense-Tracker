import { useNavigate } from "react-router-dom";
import MenuBar from "../Menu_Bar/MenuBar";
import NavBar from "../NavBar/NavBar";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import moment from "moment";
import useAuthGuard from "../../utils/useAuthGuard";

const DashboardPage = () => {
  const [btnClick, setBtnClick] = useState("dashBoardIcon");
  const [recentTransactions, setRecentTransactions] = useState([]);
  const navigate = useNavigate();

  useAuthGuard();
  const allIncomes = useSelector((state) => state.incomeReducer.incomes);
  const allExpenses = useSelector((state) => state.expenseReducer.expenses);

  const totalIncome = allIncomes.reduce((sum, i) => sum + i.amount, 0);
  const totalExpense = allExpenses.reduce((sum, e) => sum + e.amount, 0);
  const netBalance = totalIncome - totalExpense;

  const getRoute = () => {
    switch (btnClick) {
      case "homeIcon":         return "/home_page/home";
      case "dashBoardIcon":    return "/home_page/dashboard";
      case "transactionIcon":  return "/home_page/transactions";
      case "viewIncomeIcon":   return "/home_page/incomes";
      case "viewExpensesIcon": return "/home_page/expenses";
      default:                 return "/home_page/dashboard";
    }
  };

  useEffect(() => {
    if (btnClick) navigate(getRoute());
  }, [btnClick]);

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) return;
    axios
      .get("http://localhost:8000/api/transactions/gettransactions", {
        headers: { "auth-token": authToken },
      })
      .then((res) => setRecentTransactions(res.data.slice(0, 5)))
      .catch(console.log);
  }, []);

  return (
    <div className="bg-[#f7f6f6] min-h-screen h-screen w-full">
      <div className="flex justify-end">
        <NavBar btnClick={btnClick} />
      </div>
      <MenuBar setBtnClick={setBtnClick} btnClick={btnClick} />
      <div className="h-screen w-full flex items-end justify-end">
        <div className="h-[89%] w-[95%] flex flex-col pt-[2vmax] px-[2vmax] gap-[1.5vmax] overflow-auto">

          {/* Stats cards */}
          <div className="flex gap-[1.5vmax]">
            <div className="bg-white rounded-xl p-[2vmax] flex-1 flex flex-col gap-2 shadow-sm">
              <span className="text-[0.85vmax] text-[#929090] font-light uppercase tracking-wider">Total Income</span>
              <span className="text-[2vmax] font-bold text-[#624FA4]">₹{totalIncome.toLocaleString()}</span>
              <span className="text-[0.75vmax] text-green-500">{allIncomes.length} records</span>
            </div>
            <div className="bg-white rounded-xl p-[2vmax] flex-1 flex flex-col gap-2 shadow-sm">
              <span className="text-[0.85vmax] text-[#929090] font-light uppercase tracking-wider">Total Expenses</span>
              <span className="text-[2vmax] font-bold text-red-400">₹{totalExpense.toLocaleString()}</span>
              <span className="text-[0.75vmax] text-red-400">{allExpenses.length} records</span>
            </div>
            <div className="bg-white rounded-xl p-[2vmax] flex-1 flex flex-col gap-2 shadow-sm">
              <span className="text-[0.85vmax] text-[#929090] font-light uppercase tracking-wider">Net Balance</span>
              <span className={`text-[2vmax] font-bold ${netBalance >= 0 ? "text-green-500" : "text-red-400"}`}>
                ₹{Math.abs(netBalance).toLocaleString()}
              </span>
              <span className={`text-[0.75vmax] ${netBalance >= 0 ? "text-green-500" : "text-red-400"}`}>
                {netBalance >= 0 ? "Surplus" : "Deficit"}
              </span>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white rounded-xl p-[2vmax] flex-1 shadow-sm overflow-auto">
            <h2 className="text-[1.1vmax] font-semibold text-[#372b63] mb-[1.5vmax]">Recent Transactions</h2>
            {recentTransactions.length === 0 ? (
              <p className="text-[#929090] text-[0.9vmax]">No transactions yet.</p>
            ) : (
              <table className="w-full text-[0.85vmax]">
                <thead>
                  <tr className="text-[#929090] font-light border-b border-[#f7f6f6]">
                    <th className="text-left pb-3 font-normal">Date</th>
                    <th className="text-left pb-3 font-normal">Details</th>
                    <th className="text-left pb-3 font-normal">Category</th>
                    <th className="text-left pb-3 font-normal">Method</th>
                    <th className="text-left pb-3 font-normal">Type</th>
                    <th className="text-right pb-3 font-normal">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.map((t) => (
                    <tr key={t._id} className="border-b border-[#f7f6f6] hover:bg-[#fafafa]">
                      <td className="py-3">{moment(t.date).format("DD MMM YYYY")}</td>
                      <td className="py-3">{t.transactionDetails}</td>
                      <td className="py-3">{t.category}</td>
                      <td className="py-3 capitalize">{t.paymentMethod}</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded-full text-[0.7vmax] font-medium ${
                          t.type === "Income" ? "bg-purple-100 text-[#624FA4]" : "bg-red-50 text-red-400"
                        }`}>
                          {t.type}
                        </span>
                      </td>
                      <td className={`py-3 text-right font-semibold ${t.type === "Income" ? "text-[#624FA4]" : "text-red-400"}`}>
                        {t.type === "Income" ? "+" : "-"}₹{t.amount.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
