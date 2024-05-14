import "./IntroPage.css";
import styled from "styled-components";
import { Audio } from "react-loader-spinner";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkIcon } from "../../utils/Icons";

const IntroPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const IntroAppStyle = styled.div`
    background-color: #fff;
  `;

  const IntroAppStyleHeader = styled.div`
    font-family: "Montserrat", sans-serif;
    background: -webkit-linear-gradient(#b39efe, #091384);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-shadow: -5px 7px 4px rgba(0, 0, 0, 0.5);
  `;

  const handleSubmit = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate("/user_login");
    }, 2500);
  };

  return (
    <>
      {isLoading && (
        <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-50">
          <Audio type="TailSpin" color="#ffffff" height={80} width={80} />
        </div>
      )}
      <IntroAppStyle className="relative min-h-[100vh] w-full flex justify-center items-center ">
        <IntroAppStyleHeader className="text-[8vmax] absolute left-0 top-0 font-bold leading-[9vmax] tracking-tighter">
          Never
          <br /> lose the <br />
          track of your <br /> expenses <br /> again.
        </IntroAppStyleHeader>
        <div className="sub_container h-[90vh] w-[80%] bg-[#9b86e74a] rounded-[2vmax] backdrop-blur-[4px] relative">
          <div className="absolute right-0 w-[50%] text-[1.1vmax] font-extralight p-[4vmax] top-[10%]">
            Your{" "}
            <span className="font-semibold text-[1.3vmax] text-[#624FA4]">
              MONEY MANAGER
            </span>{" "}
            is here now to help you to keep an accurate record of your money
            inflow and outflow.
            <div className="flex flex-col gap-2 py-[1.5vmax] font-medium text-[#2c2546] text-[1vmax]">
              <span className="flex">
                {checkIcon}
                Budget Management
              </span>
              <span className="flex">
                {checkIcon}
                Expense Analysis
              </span>
              <span className="flex">
                {checkIcon}
                Savings Tracking
              </span>
              <span className="flex">
                {checkIcon}
                Smart Spending
              </span>
            </div>
          </div>
          <button
            onClick={handleSubmit}
            className="hover:text-[#fff] py-2 px-6 after:absolute after:h-1 after:hover:h-[200%] transition-all duration-500 hover:transition-all hover:duration-500 after:transition-all after:duration-500 after:hover:transition-all after:hover:duration-500 overflow-hidden z-20 after:z-[-20] after:bg-[#624FA4] after:rounded-t-full after:w-full after:bottom-0 after:left-0 text-[#372b63] absolute top-[55%] right-[30%] w-[12vmax] font-light h-[3vmax]"
          >
            Get Started
          </button>
          <span className="font-bold tracking-[0.5vmax] text-white absolute right-[2%] text-[5vmax] top-[-2.2vmax]">
            BUDGETBUDDY
          </span>
        </div>
      </IntroAppStyle>
    </>
  );
};

export default IntroPage;
