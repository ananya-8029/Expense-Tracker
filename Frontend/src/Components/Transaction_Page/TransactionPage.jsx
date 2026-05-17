import MenuBar from "../Menu_Bar/MenuBar";
import NavBar from "../NavBar/NavBar";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import AddTansactionButton from "../../utils/AddTansactionButton";
import NewTransactionFrom from "../../utils/NewTransactionFrom";
import axios from "axios";
import moment from "moment";
import useAuthGuard from "../../utils/useAuthGuard";

const TransactionPage = () => {
  const [btnClick, setBtnClick] = useState("transactionIcon");
  const [addbtnClick, setAddbtnClick] = useState(false);
  useAuthGuard();
  const [transactions, setTransactions] = useState([]);
  const navigate = useNavigate();

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

  const fetchTransactions = useCallback(async () => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) return;
    try {
      const res = await axios.get(
        "http://localhost:8000/api/transactions/gettransactions",
        { headers: { "auth-token": authToken } }
      );
      setTransactions(res.data);
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => { fetchTransactions(); }, [fetchTransactions]);

  const handleDelete = async (id) => {
    const authToken = localStorage.getItem("authToken");
    try {
      await axios.delete(
        `http://localhost:8000/api/transactions/deletetransaction/${id}`,
        { headers: { "auth-token": authToken } }
      );
      fetchTransactions();
    } catch (err) {
      console.log(err);
    }
  };

  const handleAddbtn = () => setAddbtnClick((c) => !c);

  useEffect(() => {
    const transactionForm = document.querySelector(".addnewTransaction");
    const addbtn = document.querySelector(".addbtn");
    if (!transactionForm || !addbtn) return;
    const handler = (event) => {
      if (addbtnClick && !transactionForm.contains(event.target) && !addbtn.contains(event.target)) {
        setAddbtnClick(false);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [addbtnClick]);

  useEffect(() => {
    if (btnClick) navigate(getRoute());
  }, [btnClick]);

  return (
    <div className="bg-[#f7f6f6] min-h-screen h-screen w-full">
      <div className="flex justify-end">
        <NavBar btnClick={btnClick} />
      </div>
      <MenuBar setBtnClick={setBtnClick} btnClick={btnClick} />
      <div className="h-screen w-full flex items-end justify-end">
        <div className="h-[89%] w-[95%] flex justify-center relative">

          {/* Header + table */}
          <div className={`h-full flex flex-col transition-all duration-300 ${addbtnClick ? "w-[70%]" : "w-full"}`}>
            <div className="px-[1.5vmax] py-[1vmax] flex justify-between items-center">
              <h2 className="text-[1.3vmax] font-semibold text-[#372b63]">Transaction Logs</h2>
              <div onClick={handleAddbtn} className="addbtn cursor-pointer">
                <AddTansactionButton />
              </div>
            </div>

            <div className="flex-1 overflow-auto px-[1.5vmax]">
              {transactions.length === 0 ? (
                <p className="text-[#929090] text-[0.9vmax] mt-4">No transactions yet. Add your first one!</p>
              ) : (
                <table className="w-full text-[0.85vmax] bg-white rounded-xl overflow-hidden">
                  <thead>
                    <tr className="bg-[#f7f6f6] text-[#929090] font-normal">
                      <th className="text-left p-3 font-normal">Date</th>
                      <th className="text-left p-3 font-normal">Details</th>
                      <th className="text-left p-3 font-normal">Category</th>
                      <th className="text-left p-3 font-normal">Method</th>
                      <th className="text-left p-3 font-normal">Type</th>
                      <th className="text-right p-3 font-normal">Amount</th>
                      <th className="text-right p-3 font-normal"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((t) => (
                      <tr key={t._id} className="border-t border-[#f7f6f6] hover:bg-[#fafafa]">
                        <td className="p-3">{moment(t.date).format("DD MMM YYYY")}</td>
                        <td className="p-3">{t.transactionDetails}</td>
                        <td className="p-3">{t.category}</td>
                        <td className="p-3 capitalize">{t.paymentMethod}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-[0.7vmax] font-medium ${
                            t.type === "Income" ? "bg-purple-100 text-[#624FA4]" : "bg-red-50 text-red-400"
                          }`}>
                            {t.type}
                          </span>
                        </td>
                        <td className={`p-3 text-right font-semibold ${t.type === "Income" ? "text-[#624FA4]" : "text-red-400"}`}>
                          {t.type === "Income" ? "+" : "-"}₹{Number(t.amount).toLocaleString()}
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => handleDelete(t._id)}
                            className="text-[#929090] hover:text-red-400 transition-colors text-[0.8vmax]"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Add transaction form panel */}
          <div className="addnewTransaction">
            {addbtnClick && (
              <NewTransactionFrom onSuccess={() => { fetchTransactions(); setAddbtnClick(false); }} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionPage;
