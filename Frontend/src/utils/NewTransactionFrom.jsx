import { useEffect, useState } from "react";
import axios from "axios";

const NewTransactionFrom = () => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [date, setDate] = useState("");
  const [amount, setAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [transactionDetails, setTransactionDetails] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("income");
  const [attatchFile, setAttachFile] = useState(null)

  const handleTypeChange = (e) => {
    setType(e.target.value);
  };

  useEffect(() => {
    const date = new Date().toISOString().split("T")[0];
    setDate(date);
  }, [setDate]);

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
  return (
    <>
      <div className="absolute right-0 top-0 h-full bg-white w-[30%]">
        <form
          encType="multipart/form-data"
          className="font-poppins h-full w-full flex flex-col justify-start items-start pt-[1.5vmax] gap-5 px-[2vmax]"
        >
          <div className="flex flex-col justify-around w-full">
            <label className="text-[#624FA4] font-medium text-[1.1vmax]">
              Transaction Date
            </label>
            <input
              type="date"
              className="bg-[#F7F6F6] outline-none h-[2vmax] w-[80%] rounded-l my-[0.8vmax] p-[0.8vmax] text-[#a5a3a3]"
              id="transactionDate"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
              }}
            />
          </div>
          <div className="flex flex-col w-full">
            <label className="text-[#624FA4] font-medium text-[1.1vmax]">
              Amount
            </label>
            <input
              type="number"
              className="bg-[#F7F6F6] outline-none h-[2vmax] w-[80%] rounded-l my-[0.8vmax] p-[0.8vmax] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              placeholder="Enter the amount"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
              }}
            />
          </div>

          <div className="flex flex-col w-full">
            <label
              htmlFor="payment"
              className="text-[#624FA4] font-medium text-[1.1vmax]"
            >
              Payment Method
            </label>
            <select
              id="paymentMethod"
              value={selectedPaymentMethod}
              className="bg-[#F7F6F6] text-[#928f8f] outline-none h-[2vmax] w-[80%] rounded-l my-[0.8vmax] px-[0.8vmax]"
              onChange={(e) => setSelectedPaymentMethod(e.target.value)}
            >
              <option value="credit">Credit Card</option>
              <option value="debit">Debit Card</option>
              <option value="cash">Cash</option>
              <option value="Other">Other</option>
            </select>
            <input
              type="text"
              id="otherPaymentMethod"
              placeholder="Enter custom payment method"
              className="bg-[#F7F6F6] rounded-l outline-none h-[2vmax] w-[80%] p-[0.8vmax] hidden"
              onChange={(e) => {
                setPaymentMethod(e.target.value);
              }}
            />
          </div>

          <div className="flex flex-col w-full">
            <label
              htmlFor="transactionDetails"
              className="text-[#624FA4] font-medium text-[1.1vmax]"
            >
              Transaction Details
            </label>
            <input
              type="text"
              className="bg-[#F7F6F6] rounded-l outline-none h-[2vmax] w-[80%] p-[0.8vmax]"
              placeholder="Enter details"
              onChange={(e) => {
                setTransactionDetails(e.target.value);
              }}
            />
          </div>

          <div className="flex w-full gap-5">
            <div className="flex flex-col w-[45%]">
              <label className="text-[#624FA4] font-medium text-[1.1vmax]">
                Category
              </label>
              <input
                type="text"
                className="bg-[#F7F6F6] rounded-l outline-none h-[2vmax] w-full p-[0.8vmax]"
                placeholder="e.g., Rent"
                onChange={(e) => {
                  setCategory(e.target.value);
                }}
              />
            </div>
            <div className="flex flex-col w-[45%]">
              <label className="text-[#624FA4] font-medium text-[1.1vmax]">
                Type
              </label>
              <div className="flex flex-col justify-center items-start">
                <div className="flex justify-center items-center gap-3">
                  <input
                    type="radio"
                    name="type"
                    id="income"
                    onChange={handleTypeChange}
                  />
                  <label htmlFor="income">Income</label>
                </div>
                <div className="flex justify-center items-center gap-3">
                  <input
                    type="radio"
                    name="type"
                    onChange={handleTypeChange}
                    id="expense"
                  />
                  <label htmlFor="expense">Expense</label>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[#624FA4] font-medium text-[1.1vmax]">
              Attachments
            </label>
            <input type="file" />
          </div>

          <button className="hover:text-[#fff] py-2 px-6 after:absolute after:h-1 after:hover:h-[200%] transition-all duration-500 hover:transition-all hover:duration-500 after:transition-all after:duration-500 after:hover:transition-all after:hover:duration-500 overflow-hidden z-20 after:z-[-20] after:bg-[#624FA4] after:rounded-t-full after:w-full after:bottom-0 after:left-0 text-[#372b63] absolute bottom-0 left-[40%] my-[1vmax] font-light h-[2.5vmax]">
            Add
          </button>
        </form>
      </div>
    </>
  );
};

export default NewTransactionFrom;
