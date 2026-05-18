import "./IntroPage.css";
import styled from "styled-components";
import { Audio } from "react-loader-spinner";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkIcon } from "../../utils/Icons";
import { useGoogleLogin } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import { setUser } from "../../Redux/Reducers/UsersSlice";
import axios from "axios";

const IntroAppStyle = styled.div`
  background-color: #fff;
`;

const GradientText = styled.div`
  font-family: "Montserrat", sans-serif;
  background: -webkit-linear-gradient(#b39efe, #091384);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: -5px 7px 4px rgba(0, 0, 0, 0.5);
`;

const features = [
  "Budget Management",
  "Expense Analysis",
  "Savings Tracking",
  "Smart Spending",
];

const IntroPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await axios.post("http://localhost:8000/api/auth/google", {
          accessToken: tokenResponse.access_token,
        });
        localStorage.setItem("authToken", res.data.authToken);
        localStorage.setItem("authTokenExpiration", Date.now() + 3600 * 1000);
        dispatch(setUser(res.data.user));
        setIsLoading(false);
        const role = res.data.user?.role;
        navigate(role === "admin" ? "/admin/dashboard" : "/home_page/home");
      } catch {
        setIsLoading(false);
        setError("Sign-in failed. Please try again.");
      }
    },
    onError: () => {
      setIsLoading(false);
      setError("Google sign-in was cancelled.");
    },
  });

  const handleSubmit = () => {
    setIsLoading(true);
    setError("");
    googleLogin();
  };

  return (
    <>
      {isLoading && (
        <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-50">
          <Audio type="TailSpin" color="#ffffff" height={80} width={80} />
        </div>
      )}

      <IntroAppStyle className="relative min-h-screen w-full overflow-x-hidden">

        {/* ── Mobile layout (< 768px) ── */}
        <div className="flex md:hidden flex-col min-h-screen px-6 py-10 gap-6">
          <span className="font-bold tracking-widest text-[#624FA4] text-xl">
            BUDGETBUDDY
          </span>

          <GradientText className="text-5xl font-bold leading-tight tracking-tighter">
            Never lose<br />track of your<br />expenses again.
          </GradientText>

          <div className="sub_container flex-1 bg-[#9b86e74a] rounded-3xl backdrop-blur-sm p-6 flex flex-col justify-between">
            <div>
              <p className="text-sm font-extralight text-gray-700 leading-relaxed">
                Your{" "}
                <span className="font-semibold text-[#624FA4]">MONEY MANAGER</span>{" "}
                is here to help you keep an accurate record of your money inflow and outflow.
              </p>
              <div className="flex flex-col gap-3 mt-5 font-medium text-[#2c2546] text-sm">
                {features.map((f) => (
                  <span key={f} className="flex items-center gap-1">
                    {checkIcon}{f}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-8 flex flex-col items-center gap-3">
              <button
                onClick={handleSubmit}
                className="relative hover:text-white py-3 px-10 after:absolute after:h-1 after:hover:h-[200%] transition-all duration-500 after:transition-all after:duration-500 overflow-hidden z-20 after:z-[-20] after:bg-[#624FA4] after:rounded-t-full after:w-full after:bottom-0 after:left-0 text-[#372b63] font-medium text-base border border-[#c4b8f0] rounded-lg w-full"
              >
                Get Started
              </button>
              {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            </div>
          </div>
        </div>

        {/* ── Tablet layout (768px – 1023px) ── */}
        <div className="hidden md:flex lg:hidden min-h-screen flex-col px-10 py-10 gap-8">
          {/* Brand */}
          <div className="flex items-center justify-between">
            <span className="font-bold tracking-[0.3em] text-[#624FA4] text-2xl">
              BUDGETBUDDY
            </span>
          </div>

          {/* Two-column body */}
          <div className="flex flex-1 gap-10 items-center">
            {/* Left — gradient headline */}
            <div className="flex-1">
              <GradientText className="text-6xl font-bold leading-tight tracking-tighter">
                Never<br />lose the<br />track of<br />your<br />expenses<br />again.
              </GradientText>
            </div>

            {/* Right — card */}
            <div className="flex-1">
              <div className="sub_container bg-[#9b86e74a] rounded-3xl backdrop-blur-sm p-8 flex flex-col gap-6 h-full">
                <p className="text-base font-extralight text-gray-700 leading-relaxed">
                  Your{" "}
                  <span className="font-semibold text-[#624FA4]">MONEY MANAGER</span>{" "}
                  is here now to help you keep an accurate record of your money inflow and outflow.
                </p>

                <div className="flex flex-col gap-3 font-medium text-[#2c2546] text-sm">
                  {features.map((f) => (
                    <span key={f} className="flex items-center gap-1.5">
                      {checkIcon}{f}
                    </span>
                  ))}
                </div>

                <div className="mt-auto flex flex-col items-start gap-2">
                  <button
                    onClick={handleSubmit}
                    className="relative hover:text-white py-2.5 px-8 after:absolute after:h-1 after:hover:h-[200%] transition-all duration-500 after:transition-all after:duration-500 overflow-hidden z-20 after:z-[-20] after:bg-[#624FA4] after:rounded-t-full after:w-full after:bottom-0 after:left-0 text-[#372b63] font-medium text-base border border-[#c4b8f0] rounded-lg"
                  >
                    Get Started
                  </button>
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Desktop layout (≥ 1024px) — original design preserved ── */}
        <div className="hidden lg:flex relative min-h-screen justify-center items-center">
          <GradientText className="text-[8vmax] absolute left-0 top-0 font-bold leading-[9vmax] tracking-tighter z-0">
            Never
            <br /> lose the <br />
            track of your <br /> expenses <br /> again.
          </GradientText>

          <div className="sub_container h-[90vh] w-[80%] bg-[#9b86e74a] rounded-[2vmax] backdrop-blur-[4px] relative z-10">
            <span className="font-bold tracking-[0.5vmax] text-white absolute right-[2%] text-[5vmax] top-[-2.2vmax]">
              BUDGETBUDDY
            </span>

            <div className="absolute right-0 w-[50%] text-[1.1vmax] font-extralight p-[4vmax] top-[10%]">
              Your{" "}
              <span className="font-semibold text-[1.3vmax] text-[#624FA4]">
                MONEY MANAGER
              </span>{" "}
              is here now to help you to keep an accurate record of your money
              inflow and outflow.
              <div className="flex flex-col gap-2 py-[1.5vmax] font-medium text-[#2c2546] text-[1vmax]">
                {features.map((f) => (
                  <span key={f} className="flex">
                    {checkIcon}{f}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={handleSubmit}
              className="hover:text-[#fff] py-2 px-6 after:absolute after:h-1 after:hover:h-[200%] transition-all duration-500 hover:transition-all hover:duration-500 after:transition-all after:duration-500 after:hover:transition-all after:hover:duration-500 overflow-hidden z-20 after:z-[-20] after:bg-[#624FA4] after:rounded-t-full after:w-full after:bottom-0 after:left-0 text-[#372b63] absolute top-[55%] right-[30%] w-[12vmax] font-light h-[3vmax]"
            >
              Get Started
            </button>

            {error && (
              <p className="absolute top-[65%] right-[25%] text-red-500 text-[0.8vmax]">
                {error}
              </p>
            )}
          </div>
        </div>

      </IntroAppStyle>
    </>
  );
};

export default IntroPage;
