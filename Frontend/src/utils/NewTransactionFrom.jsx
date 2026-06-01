import { useEffect, useState } from "react";
import axios from "axios";

const NewTransactionFrom = ({ onSuccess }) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("credit");
  const [date, setDate] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("credit");
  const [transactionDetails, setTransactionDetails] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("Income");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setDate(new Date().toISOString().split("T")[0]);
  }, []);

  useEffect(() => {
    const otherInput = document.getElementById("otherPaymentMethod");
    setPaymentMethod(selectedPaymentMethod);
    if (selectedPaymentMethod === "Other") {
      otherInput.classList.remove("hidden");
      otherInput.classList.add("block");
    } else {
      otherInput.classList.remove("block");
      otherInput.classList.add("hidden");
      otherInput.value = "";
    }
  }, [selectedPaymentMethod]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!date || !amount || !transactionDetails || !category || !paymentMethod) {
      setError("All fields are required!");
      return;
    }
    const authToken = localStorage.getItem("authToken");
    if (!authToken) return;

    const formData = new FormData();
    formData.append("date", date);
    formData.append("amount", amount);
    formData.append("paymentMethod", paymentMethod);
    formData.append("transactionDetails", transactionDetails);
    formData.append("category", category);
    formData.append("type", type);
    if (file) formData.append("file", file);

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/transactions/addnewtransaction`,
        formData,
        { headers: { "auth-token": authToken } }
      );
      setSuccess(true);
      setAmount(""); setTransactionDetails(""); setCategory(""); setFile(null);
      setDate(new Date().toISOString().split("T")[0]);
      setTimeout(() => setSuccess(false), 2000);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add transaction.");
    }
  };

  return (
    <div className="absolute right-0 top-0 h-full bg-white w-[30%] shadow-lg overflow-y-auto">
      <form
        encType="multipart/form-data"
        onSubmit={handleSubmit}
        className="font-poppins h-full w-full flex flex-col justify-start items-start pt-[1.5vmax] gap-4 px-[2vmax]"
      >
        <h3 className="text-[1.1vmax] font-semibold text-[#372b63]">Add Transaction</h3>
        {error && <p className="text-red-500 text-[0.8vmax]">{error}</p>}
        {success && <p className="text-green-500 text-[0.8vmax]">Transaction added!</p>}

        <div className="flex flex-col w-full gap-1">
          <label className="text-[#624FA4] font-medium text-[0.9vmax]">Date</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
            className="bg-[#F7F6F6] outline-none rounded-lg p-[0.8vmax] text-[0.85vmax] text-[#929090]" />
        </div>

        <div className="flex flex-col w-full gap-1">
          <label className="text-[#624FA4] font-medium text-[0.9vmax]">Amount</label>
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter the amount"
            className="bg-[#F7F6F6] outline-none rounded-lg p-[0.8vmax] text-[0.85vmax] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
        </div>

        <div className="flex flex-col w-full gap-1">
          <label className="text-[#624FA4] font-medium text-[0.9vmax]">Payment Method</label>
          <select value={selectedPaymentMethod} onChange={(e) => setSelectedPaymentMethod(e.target.value)}
            className="bg-[#F7F6F6] text-[#928f8f] outline-none rounded-lg p-[0.8vmax] text-[0.85vmax]">
            <option value="credit">Credit Card</option>
            <option value="debit">Debit Card</option>
            <option value="cash">Cash</option>
            <option value="upi">UPI</option>
            <option value="Other">Other</option>
          </select>
          <input type="text" id="otherPaymentMethod" placeholder="Enter custom payment method"
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="bg-[#F7F6F6] rounded-lg outline-none p-[0.8vmax] text-[0.85vmax] hidden mt-1" />
        </div>

        <div className="flex flex-col w-full gap-1">
          <label className="text-[#624FA4] font-medium text-[0.9vmax]">Transaction Details</label>
          <input type="text" value={transactionDetails} onChange={(e) => setTransactionDetails(e.target.value)}
            placeholder="Enter details"
            className="bg-[#F7F6F6] rounded-lg outline-none p-[0.8vmax] text-[0.85vmax]" />
        </div>

        <div className="flex w-full gap-3">
          <div className="flex flex-col flex-1 gap-1">
            <label className="text-[#624FA4] font-medium text-[0.9vmax]">Category</label>
            <input type="text" value={category} onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g., Rent"
              className="bg-[#F7F6F6] rounded-lg outline-none p-[0.8vmax] text-[0.85vmax]" />
          </div>
          <div className="flex flex-col flex-1 gap-1">
            <label className="text-[#624FA4] font-medium text-[0.9vmax]">Type</label>
            <div className="flex flex-col gap-1 pt-1">
              <label className="flex items-center gap-2 text-[0.85vmax] cursor-pointer">
                <input type="radio" name="type" value="Income" checked={type === "Income"}
                  onChange={(e) => setType(e.target.value)} />
                Income
              </label>
              <label className="flex items-center gap-2 text-[0.85vmax] cursor-pointer">
                <input type="radio" name="type" value="Expense" checked={type === "Expense"}
                  onChange={(e) => setType(e.target.value)} />
                Expense
              </label>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1 w-full">
          <label className="text-[#624FA4] font-medium text-[0.9vmax]">Attachment (optional)</label>
          <input type="file" name="file" onChange={(e) => setFile(e.target.files[0])}
            className="text-[0.8vmax] text-[#929090]" />
        </div>

        <button type="submit"
          className="w-full bg-[#624FA4] text-white rounded-lg py-[0.8vmax] text-[0.9vmax] hover:bg-[#372b63] transition-colors">
          Add Transaction
        </button>
      </form>
    </div>
  );
};

export default NewTransactionFrom;
