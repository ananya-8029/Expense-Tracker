// import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import "../Login_Page/LoginPage.css";
import axios from "axios";
import { useState } from "react";
import { Audio } from "react-loader-spinner";

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMessage, setErrMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/api/auth/login",
        { email, password }
      );
      if (response.statusText === "OK") {
        navigate("/home_page");
      }
      setEmail("");
      setPassword("");
      setErrMessage(null);
    } catch (error) {
      setErrMessage(error.response.data.message);
    }
  };

  const handleSignupBtn = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate("/new_user");
    }, 2500);
  };
  return (
    <>
      {isLoading && (
        <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-50">
          <Audio type="TailSpin" color="#ffffff" height={80} width={80} />
        </div>
      )}
      <div className="min-h-screen h-screen w-full flex">
        <div className="w-[40%] h-full flex flex-col justify-center items-center">
          <div className="loginHeader flex flex-col items-center">
            <h1 className="text-[2.8vmax] font-bold">Welcome Back!</h1>
            <p className="text-[1.1vmax] font-light">
              Sign in to your account.
            </p>
          </div>
          <form className="loginform h-[30%] flex flex-col justify-center items-center w-[50%] gap-6">
            <div className="w-full flex justify-center items-center px-[1vmax]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="36"
                height="36"
                fill="rgba(98,79,164,1)"
              >
                <path fill="none" d="M0 0h24v24H0z"></path>
                <path d="M3 3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3ZM12.0606 11.6829L5.64722 6.2377L4.35278 7.7623L12.0731 14.3171L19.6544 7.75616L18.3456 6.24384L12.0606 11.6829Z"></path>
              </svg>
              <input
                type="email"
                name="email"
                placeholder="Email"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                required
                className="h-[3.5vmax] w-full focus:outline-none px-[1vmax]"
              />
            </div>
            <div className="w-full flex items-center px-[1vmax]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="36"
                height="36"
                fill="rgba(98,79,164,1)"
              >
                <path fill="none" d="M0 0h24v24H0z"></path>
                <path d="M19 10H20C20.5523 10 21 10.4477 21 11V21C21 21.5523 20.5523 22 20 22H4C3.44772 22 3 21.5523 3 21V11C3 10.4477 3.44772 10 4 10H5V9C5 5.13401 8.13401 2 12 2C15.866 2 19 5.13401 19 9V10ZM17 10V9C17 6.23858 14.7614 4 12 4C9.23858 4 7 6.23858 7 9V10H17ZM11 14V18H13V14H11Z"></path>
              </svg>
              <input
                type="password"
                name="password"
                placeholder="Password"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                required
                className="h-[3.5vmax] w-full focus:outline-none px-[1vmax]"
              />
            </div>
            {errMessage && (
              <span className="text-red-400 text-[0.9vmax]">{errMessage}</span>
            )}
          </form>
          <div className="btn flex flex-col justify-center items-center">
            <button
              onClick={handleSubmit}
              className="relative hover:text-[#fff] py-2 px-6 after:absolute after:h-1 after:hover:h-[200%] transition-all duration-500 hover:transition-all hover:duration-500 after:transition-all after:duration-500 after:hover:transition-all after:hover:duration-500 overflow-hidden z-20 after:z-[-20] after:bg-[#624FA4] after:rounded-t-full after:w-full after:bottom-0 after:left-0 text-[#372b63] w-[8vmax] font-semibold text-[1.1vmax]"
            >
              Login
            </button>
            <p className="text-[0.8vmax] py-[1vmax]">
              Don&apos;t have an account?
              <button
                onClick={handleSignupBtn}
                className="px-[0.5vmax] hover:text-[#624FA4] cursor-pointer"
              >
                Create One!
              </button>
            </p>
          </div>
        </div>
        <div
          className="w-[60%] h-full flex justify-center items-center
        "
        >
          <img src="src/assets/loginBg.jpg" className="h-[60%] w-[70%]" />
        </div>
      </div>
    </>
  );
};

export default LoginPage;
