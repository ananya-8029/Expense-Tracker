// import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import "../Login_Page/LoginPage.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { Audio } from "react-loader-spinner";
import { emailIcon, passwordIcon } from "../../utils/Icons";
import { useDispatch } from "react-redux";
import { setUser } from "../../Redux/Reducers/UsersSlice";

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMessage, setErrMessage] = useState(null);
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/api/auth/login",
        { email, password }
      );
      if (response.statusText === "OK") {
        const { authToken, user } = response.data;
        dispatch(setUser(user));

        const expirationTime = new Date().getTime() + 60 * 60 * 1000; // 1 hour in milliseconds

        localStorage.setItem("authToken", authToken);
        localStorage.setItem("authTokenExpiration", expirationTime);

        axios.defaults.headers.common["auth-token"] = authToken;
        setIsLoading(true);
        setTimeout(() => {
          setIsLoading(false);
          navigate("/home_page");
        }, 2500);
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

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    const expirationTime = localStorage.getItem("authTokenExpiration");

    const expirationDate = new Date(expirationTime);

    if (!authToken) {
      handleSubmit();
    } else {
      if (new Date().getTime() > parseInt(expirationDate, 10)) {
        localStorage.removeItem("authTokenExpiration");
        localStorage.removeItem("authToken");
        handleSubmit();
      } else {
        setTimeout(() => {
          setIsLoading(false);
          navigate("/home_page");
        }, 2500);
      }
    }
  });
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
              {emailIcon}
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
              {passwordIcon}
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
