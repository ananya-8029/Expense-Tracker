import "./IntroPage.css";
const IntroPage = () => {
  return (
    <>
      <div className="main_container relative min-h-[100vh] w-full flex justify-center items-center ">
        <h1 className="text-[8vmax] absolute left-0 top-0 font-bold leading-[9vmax] tracking-tighter">
          Never
          <br /> lose the <br />
          track of your <br /> expenses <br /> again.
        </h1>
        <div className="sub_container h-[90vh] w-[80%] bg-[#9b86e74a] rounded-[2vmax] backdrop-blur-[4px] relative">
          <p className="absolute right-0 w-[50%] text-[1.1vmax] font-extralight p-[4vmax] top-[10%]">
            Your{" "}
            <span className="font-semibold text-[1.3vmax] text-[#624FA4]">
              MONEY MANAGER
            </span>{" "}
            is here now to help you to keep an accurate record of your money
            inflow and outflow.
            <div className="flex flex-col gap-2 py-[1.5vmax] font-medium text-[#2c2546] text-[1vmax]">
              <span className="flex">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  fill="rgba(123,101,196,1)"
                >
                  <path fill="none" d="M0 0h24v24H0z"></path>
                  <path d="M9.9997 15.1709L19.1921 5.97852L20.6063 7.39273L9.9997 17.9993L3.63574 11.6354L5.04996 10.2212L9.9997 15.1709Z"></path>
                </svg>
                Budget Management
              </span>
              <span className="flex">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  fill="rgba(123,101,196,1)"
                >
                  <path fill="none" d="M0 0h24v24H0z"></path>
                  <path d="M9.9997 15.1709L19.1921 5.97852L20.6063 7.39273L9.9997 17.9993L3.63574 11.6354L5.04996 10.2212L9.9997 15.1709Z"></path>
                </svg>
                Expense Analysis
              </span>
              <span className="flex">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  fill="rgba(123,101,196,1)"
                >
                  <path fill="none" d="M0 0h24v24H0z"></path>
                  <path d="M9.9997 15.1709L19.1921 5.97852L20.6063 7.39273L9.9997 17.9993L3.63574 11.6354L5.04996 10.2212L9.9997 15.1709Z"></path>
                </svg>
                Savings Tracking
              </span>
              <span className="flex">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  fill="rgba(123,101,196,1)"
                >
                  <path fill="none" d="M0 0h24v24H0z"></path>
                  <path d="M9.9997 15.1709L19.1921 5.97852L20.6063 7.39273L9.9997 17.9993L3.63574 11.6354L5.04996 10.2212L9.9997 15.1709Z"></path>
                </svg>
                Smart Spending
              </span>
            </div>
          </p>
          <button className="hover:text-[#fff] py-2 px-6 after:absolute after:h-1 after:hover:h-[200%] transition-all duration-500 hover:transition-all hover:duration-500 after:transition-all after:duration-500 after:hover:transition-all after:hover:duration-500 overflow-hidden z-20 after:z-[-20] after:bg-[#624FA4] after:rounded-t-full after:w-full after:bottom-0 after:left-0 text-[#372b63] absolute top-[55%] right-[30%] w-[12vmax] font-light h-[3vmax]">
            Get Started
          </button>
          <span className="font-bold tracking-[0.5vmax] text-white absolute right-[2%] text-[5vmax] top-[-2.2vmax]">
            BUDGETBUDDY
          </span>
        </div>
      </div>
    </>
  );
};

export default IntroPage;
