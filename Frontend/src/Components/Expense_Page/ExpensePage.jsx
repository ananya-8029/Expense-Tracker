import { useSelector, useDispatch } from "react-redux";
import MenuBar from "../Menu_Bar/MenuBar";
import NavBar from "../NavBar/NavBar";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import axios from "axios";
import { fetchExpense } from "../../Redux/middleswares";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

const ExpensePage = () => {
  const allExpenses = useSelector((state) => state.expenseReducer.expenses);
  const dispatch = useDispatch();
  const [btnClick, setBtnClick] = useState("viewExpensesIcon");
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [error, setError] = useState("");

  const chartData = {
    labels: [...allExpenses].reverse().map((d) => moment(d.date).format("DD MMM")),
    datasets: [
      {
        label: "Expenses (₹)",
        data: [...allExpenses].reverse().map((d) => d.amount),
        backgroundColor: "#f87171",
        borderRadius: 6,
      },
    ],
  };

  const getRoute = () => {
    switch (btnClick) {
      case "dashBoardIcon": return "/home_page/dashboard";
      case "transactionIcon": return "/home_page/transactions";
      case "viewIncomeIcon": return "/home_page/incomes";
      case "viewExpensesIcon": return "/home_page/expenses";
    }
  };

  useEffect(() => {
    if (btnClick) navigate(getRoute());
  }, [btnClick]);

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!title || !amount || !category || !description || !date) {
      setError("All fields are required!");
      return;
    }
    const authToken = localStorage.getItem("authToken");
    try {
      await axios.post(
        "http://localhost:8000/api/transactions/addexpense",
        { title, amount: Number(amount), category, description, date },
        { headers: { "auth-token": authToken } }
      );
      dispatch(fetchExpense);
      setShowForm(false);
      setTitle(""); setAmount(""); setCategory(""); setDescription("");
      setDate(new Date().toISOString().split("T")[0]);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add expense.");
    }
  };

  const handleDelete = async (id) => {
    const authToken = localStorage.getItem("authToken");
    try {
      await axios.delete(
        `http://localhost:8000/api/transactions/deleteexpense/${id}`,
        { headers: { "auth-token": authToken } }
      );
      dispatch(fetchExpense);
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
        <div className="h-[89%] w-[95%] relative overflow-hidden">

          {/* Header row */}
          <div className="flex justify-between items-center px-[2vmax] pt-[1.5vmax] pb-[1vmax]">
            <h2 className="text-[1.3vmax] font-semibold text-[#372b63]">Expense Records</h2>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-red-400 text-white px-4 py-2 rounded-lg text-[0.85vmax] hover:bg-red-500 transition-colors"
            >
              {showForm ? "✕ Close" : "+ Add Expense"}
            </button>
          </div>

          {/* Main area */}
          <div className={`h-[calc(100%-4vmax)] transition-all duration-300 ${showForm ? "w-[70%]" : "w-full"}`}>
            <div className="h-[50%] flex flex-wrap pl-[2vmax] overflow-y-auto gap-1 content-start pt-[0.5vmax]">
              {allExpenses.length === 0 ? (
                <p className="text-[#929090] text-[0.9vmax] mt-4 pl-2">No expense records yet. Add your first one!</p>
              ) : (
                allExpenses.map((expense) => (
                  <div key={expense._id} className="bg-white flex flex-col justify-between items-start m-[0.4vmax] w-[14vmax] h-[13vmax] rounded-xl py-[1.2vmax] px-[1.5vmax]">
                    <div className="flex flex-col gap-1 w-full">
                      <div className="text-[1vmax] font-semibold truncate">{expense.title}</div>
                      <div className="text-[0.75vmax] font-light text-[#929090] truncate">{expense.description}</div>
                      <div className="text-[1.1vmax] font-bold text-red-400">₹{expense.amount.toLocaleString()}</div>
                      <span className="text-red-300 text-[0.65vmax] font-medium">
                        {moment(expense.date).format("DD MMM YYYY")}
                      </span>
                    </div>
                    <div className="flex gap-2 w-full mt-1">
                      <span className="bg-[#F7F6F6] flex-1 h-[1.8vmax] rounded-lg text-[0.65vmax] flex items-center justify-center text-red-400 font-medium truncate px-1">
                        {expense.category}
                      </span>
                      <button
                        onClick={() => handleDelete(expense._id)}
                        className="bg-red-50 text-red-400 h-[1.8vmax] px-2 rounded-lg text-[0.65vmax] hover:bg-red-100 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="h-[50%] px-[2vmax] py-[1vmax]">
              <Bar data={chartData} />
            </div>
          </div>

          {/* Add Expense side panel */}
          {showForm && (
            <div className="absolute right-0 top-0 h-full bg-white w-[30%] shadow-lg overflow-y-auto">
              <form
                onSubmit={handleAddExpense}
                className="h-full flex flex-col pt-[2vmax] px-[2vmax] gap-4"
              >
                <h3 className="text-[1.1vmax] font-semibold text-[#372b63]">Add Expense</h3>
                {error && <p className="text-red-500 text-[0.8vmax]">{error}</p>}
                {[
                  { label: "Title", value: title, set: setTitle, placeholder: "e.g., Rent", type: "text" },
                  { label: "Amount (₹)", value: amount, set: setAmount, placeholder: "0", type: "number" },
                  { label: "Category", value: category, set: setCategory, placeholder: "e.g., Food", type: "text" },
                  { label: "Description", value: description, set: setDescription, placeholder: "Brief description", type: "text" },
                ].map(({ label, value, set, placeholder, type }) => (
                  <div key={label} className="flex flex-col gap-1">
                    <label className="text-red-400 font-medium text-[0.85vmax]">{label}</label>
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
                  <label className="text-red-400 font-medium text-[0.85vmax]">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="bg-[#F7F6F6] outline-none rounded-lg p-[0.8vmax] text-[0.85vmax] text-[#929090]"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-red-400 text-white rounded-lg py-[0.8vmax] text-[0.9vmax] hover:bg-red-500 transition-colors"
                >
                  Save Expense
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpensePage;
