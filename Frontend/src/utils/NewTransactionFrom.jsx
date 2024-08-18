import { useEffect } from "react";

const NewTransactionFrom = () => {
  useEffect(() => {
    const date = new Date().toISOString().split("T")[0];
    document.getElementById("transactionDate").value = date;
  });
  return (
    <>
      <div className="absolute right-0 top-0 h-full bg-white w-[30%]">
        <form className="font-poppins h-full w-full flex flex-col justify-center items-start gap-5 px-[2vmax]">
          <div className="flex flex-col justify-around w-full">
            <label className="text-[#624FA4] font-medium text-[1.1vmax]">
              Transaction Date
            </label>
            <input
              type="date"
              className="bg-[#F7F6F6] outline-none h-[2vmax] w-[80%] rounded-l my-[0.8vmax] p-[0.8vmax] text-[#a5a3a3]"
              id="transactionDate"
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
            />
          </div>

          <div className="flex flex-col">
            <label className="text-[#624FA4] font-medium text-[1.1vmax]">
              Payment Method
            </label>
            <select name="" id=""></select>
          </div>

          <div className="flex flex-col">
            <label className="text-[#624FA4] font-medium text-[1.1vmax]">
              Transaction Details
            </label>{" "}
            <input type="text" />
          </div>

          <div className="flex">
            <div className="flex flex-col">
              <label className="text-[#624FA4] font-medium text-[1.1vmax]">
                Category
              </label>
              <input type="text" />
            </div>
            <div className="flex flex-col">
              <label className="text-[#624FA4] font-medium text-[1.1vmax]">
                Type
              </label>{" "}
              <input type="text" />
            </div>
          </div>

          <div>
            <label className="text-[#624FA4] font-medium text-[1.1vmax]">
              Attachments
            </label>
            <input type="file" />
          </div>
        </form>
      </div>
    </>
  );
};

export default NewTransactionFrom;
