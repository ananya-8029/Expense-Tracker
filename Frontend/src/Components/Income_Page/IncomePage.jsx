import { useSelector, useDispatch } from "react-redux";
import "../Income_Page/IncomePage.css";
import NavBar from "../NavBar/NavBar";
import MenuBar from "../Menu_Bar/MenuBar";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import IncomeTrendsChart from "../../utils/IncomeTrendsChart";
import axios from "axios";
import { fetchIncome } from "../../Redux/middleswares";
import useAuthGuard from "../../utils/useAuthGuard";

const IncomePage = () => {
  useAuthGuard();
  const allIncomes = useSelector((state) => state.incomeReducer.incomes);
  const dispatch = useDispatch();
  const [btnClick, setBtnClick] = useState("viewIncomeIcon");
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);

  const chartData = {
    labels: [...allIncomes].reverse().map((d) => moment(d.date).format("DD MMM")),
    datasets: [
      {
        label: "Income (₹)",
        data: [...allIncomes].reverse().map((d) => d.amount),
        backgroundColor: "#624FA4",
        borderRadius: 6,
      },
    ],
  };

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
    dispatch(fetchIncome);
  }, []);

  useEffect(() => {
    if (btnClick) navigate(getRoute());
  }, [btnClick]);

  const resetForm = () => {
    setTitle(""); setAmount(""); setCategory(""); setDescription("");
    setDate(new Date().toISOString().split("T")[0]);
    setError(""); setEditingId(null); setShowForm(false);
  };

  const handleEditClick = (income) => {
    setEditingId(income._id);
    setTitle(income.title);
    setAmount(String(income.amount));
    setCategory(income.category);
    setDescription(income.description);
    setDate(new Date(income.date).toISOString().split("T")[0]);
    setError("");
    setShowForm(true);
  };

  const handleAddIncome = async (e) => {
    e.preventDefault();
    if (!title || !amount || !category || !description || !date) {
      setError("All fields are required!"); return;
    }
    const authToken = localStorage.getItem("authToken");
    try {
      if (editingId) {
        await axios.put(
          `http://localhost:8000/api/transactions/updateincome/${editingId}`,
          { title, amount: Number(amount), category, description, date },
          { headers: { "auth-token": authToken } }
        );
      } else {
        await axios.post(
          "http://localhost:8000/api/transactions/addincome",
          { title, amount: Number(amount), category, description, date },
          { headers: { "auth-token": authToken } }
        );
      }
      dispatch(fetchIncome);
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save income.");
    }
  };

  const handleDelete = async (id) => {
    const authToken = localStorage.getItem("authToken");
    try {
      await axios.delete(
        `http://localhost:8000/api/transactions/deleteincome/${id}`,
        { headers: { "auth-token": authToken } }
      );
      dispatch(fetchIncome);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="bg-[#f7f6f6] min-h-screen h-screen w-full">
      <div className="flex justify-end">
        <NavBar btnClick={btnClick} />
      </div>
      <MenuBar setBtnClick={setBtnClick} btnClick={btnClick} />
      <div className="h-screen w-full flex items-end justify-end">
        <div className="h-[calc(100%-3rem)] md:h-[89%] w-full md:w-[95%] relative overflow-hidden pb-16 md:pb-0">

          {/* Header row */}
          <div className="flex justify-between items-center px-3 md:px-[2vmax] pt-3 md:pt-[1.5vmax] pb-2 md:pb-[1vmax]">
            <h2 className="text-base md:text-[1.3vmax] font-semibold text-[#372b63]">Income Records</h2>
            <button
              onClick={() => showForm ? resetForm() : setShowForm(true)}
              className="bg-[#624FA4] text-white px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-xs md:text-[0.85vmax] hover:bg-[#372b63] transition-colors"
            >
              {showForm ? "✕ Close" : "+ Add Income"}
            </button>
          </div>

          {/* Main area — shrinks when form is open */}
          <div className={`h-[calc(100%-4vmax)] transition-all duration-300 ${showForm ? "w-full md:w-[70%]" : "w-full"}`}>
            <div className="h-full flex flex-wrap pl-[2vmax] overflow-y-auto gap-1 content-start pt-[0.5vmax]">
              {allIncomes.length === 0 ? (
                <p className="text-[#929090] text-[0.9vmax] mt-4 pl-2">No income records yet. Add your first one!</p>
              ) : (
                allIncomes.map((income) => (
                  <div key={income._id} className="income-content relative bg-white flex flex-col justify-between items-start m-1 md:m-[0.4vmax] w-[calc(50%-8px)] sm:w-[calc(33%-8px)] md:w-[14vmax] min-h-[160px] md:h-[13vmax] rounded-xl py-3 md:py-[1.2vmax] px-3 md:px-[1.5vmax]">
                    <button
                      onClick={() => handleEditClick(income)}
                      className="absolute top-2 md:top-[0.6vmax] right-2 md:right-[0.6vmax] w-6 h-6 md:w-[1.6vmax] md:h-[1.6vmax] flex items-center justify-center rounded-md bg-[#ede9fb] text-[#624FA4] hover:bg-[#c4b8f0] transition-colors z-10"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[0.75vmax] h-[0.75vmax]">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </button>
                    <div className="flex flex-col gap-1 w-full">
                      <div className="text-sm md:text-[1vmax] font-semibold truncate pr-8 md:pr-[2vmax]">{income.title}</div>
                      <div className="text-xs md:text-[0.75vmax] font-light text-[#929090] truncate">{income.description}</div>
                      <div className="income-amount text-base md:text-[1.1vmax] font-bold text-[#624FA4]">₹{income.amount.toLocaleString()}</div>
                      <span className="text-[#a89cd6] text-[10px] md:text-[0.65vmax] font-medium">
                        {moment(income.date).format("DD MMM YYYY")}
                      </span>
                    </div>
                    <div className="flex gap-1.5 w-full mt-1">
                      <span className="bg-[#F7F6F6] flex-1 h-6 md:h-[1.8vmax] rounded-lg text-[10px] md:text-[0.65vmax] flex items-center justify-center text-[#624FA4] font-medium truncate px-1">
                        {income.category}
                      </span>
                      <button
                        onClick={() => handleDelete(income._id)}
                        className="bg-red-50 text-red-400 h-6 md:h-[1.8vmax] px-2 rounded-lg text-[10px] md:text-[0.65vmax] hover:bg-red-100 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Click-outside overlay (desktop only) */}
          {showForm && (
            <div
              className="hidden md:block absolute left-0 top-0 h-full w-[70%] z-10"
              onClick={() => setShowForm(false)}
            />
          )}

          {/* Add Income side panel */}
          {showForm && (
            <div className="absolute right-0 top-0 h-full bg-white w-full md:w-[30%] shadow-lg overflow-y-auto z-20">
              <form
                onSubmit={handleAddIncome}
                className="h-full flex flex-col pt-[2vmax] px-[2vmax] gap-4"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-[1.1vmax] font-semibold text-[#372b63]">{editingId ? "Edit Income" : "Add Income"}</h3>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="text-[#929090] hover:text-[#372b63] text-[1.1vmax] transition-colors leading-none"
                  >
                    ✕
                  </button>
                </div>
                {error && <p className="text-red-500 text-[0.8vmax]">{error}</p>}
                {[
                  { label: "Title", value: title, set: setTitle, placeholder: "e.g., Salary", type: "text" },
                  { label: "Amount (₹)", value: amount, set: setAmount, placeholder: "0", type: "number" },
                  { label: "Category", value: category, set: setCategory, placeholder: "e.g., Freelance", type: "text" },
                  { label: "Description", value: description, set: setDescription, placeholder: "Brief description", type: "text" },
                ].map(({ label, value, set, placeholder, type }) => (
                  <div key={label} className="flex flex-col gap-1">
                    <label className="text-[#624FA4] font-medium text-[0.85vmax]">{label}</label>
                    <input
                      type={type}
                      value={value}
                      onChange={(e) => set(e.target.value)}
                      placeholder={placeholder}
                      className="bg-[#F7F6F6] outline-none rounded-lg p-[0.8vmax] text-[0.85vmax] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>
                ))}
                <div className="flex flex-col gap-1">
                  <label className="text-[#624FA4] font-medium text-[0.85vmax]">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="bg-[#F7F6F6] outline-none rounded-lg p-[0.8vmax] text-[0.85vmax] text-[#929090]"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-[#624FA4] text-white rounded-lg py-[0.8vmax] text-[0.9vmax] hover:bg-[#372b63] transition-colors"
                >
                  {editingId ? "Update Income" : "Save Income"}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IncomePage;
