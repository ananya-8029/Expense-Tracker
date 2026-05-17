import { useSelector } from "react-redux";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../NavBar/NavBar";
import MenuBar from "../Menu_Bar/MenuBar";
import useAuthGuard from "../../utils/useAuthGuard";
import axios from "axios";

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
};

const SUGGESTIONS = [
  "What's my total income so far?",
  "How much have I spent in total?",
  "What's my current net balance?",
  "Which is my biggest expense category?",
  "Am I spending more than I earn?",
  "Give me a quick financial summary.",
];

const SparkleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5z" />
  </svg>
);

const SendIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const UserHomePage = () => {
  useAuthGuard();
  const [btnClick, setBtnClick] = useState("homeIcon");
  const navigate = useNavigate();
  const userData = useSelector((state) => state.userReducer?.user);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  const getRoute = () => {
    switch (btnClick) {
      case "homeIcon":         return "/home_page/home";
      case "dashBoardIcon":    return "/home_page/dashboard";
      case "transactionIcon":  return "/home_page/transactions";
      case "viewIncomeIcon":   return "/home_page/incomes";
      case "viewExpensesIcon": return "/home_page/expenses";
      default:                 return "/home_page/home";
    }
  };

  useEffect(() => {
    if (btnClick !== "homeIcon") navigate(getRoute());
  }, [btnClick]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const sendMessage = async (text) => {
    const prompt = text.trim();
    if (!prompt || isLoading) return;

    const userMsg = { role: "user", content: prompt };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const authToken = localStorage.getItem("authToken");
      const history = messages.slice(-6).map(({ role, content }) => ({ role, content }));
      const res = await axios.post(
        "http://localhost:8000/api/ai/ask",
        { prompt, history },
        { headers: { "auth-token": authToken } }
      );
      setMessages((prev) => [...prev, { role: "assistant", content: res.data.response }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I couldn't process that. Please check your API key or try again." },
      ]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div className="bg-[#f7f6f6] min-h-screen h-screen w-full">
      <div className="flex justify-end">
        <NavBar btnClick={btnClick} />
      </div>
      <MenuBar setBtnClick={setBtnClick} btnClick={btnClick} />

      <div className="h-screen w-full flex items-end justify-end">
        <div className="h-[89%] w-[95%] flex flex-col px-[2vmax] pt-[1.5vmax] pb-[1.5vmax] gap-[1.2vmax]">

          {/* Greeting banner */}
          <div className="bg-gradient-to-r from-[#624FA4] to-[#372b63] rounded-xl px-[2vmax] py-[1.5vmax] flex items-center gap-[1.5vmax] flex-shrink-0">
            <img
              src={userData?.picture || "https://picsum.photos/id/1/200/300"}
              alt={userData?.username}
              referrerPolicy="no-referrer"
              className="h-[4vmax] w-[4vmax] rounded-full object-cover border-2 border-white border-opacity-40 flex-shrink-0"
            />
            <div className="flex-1">
              <p className="text-white text-opacity-70 text-[0.8vmax]">{getGreeting()},</p>
              <p className="text-white text-[1.6vmax] font-bold leading-tight">
                {userData?.username || "User"} 👋
              </p>
            </div>
            <div className="flex items-center gap-2 bg-white bg-opacity-15 rounded-full px-3 py-1.5">
              <span className="text-white"><SparkleIcon /></span>
              <span className="text-white text-[0.75vmax] font-medium">BudgetBuddy AI</span>
            </div>
          </div>

          {/* Chat area */}
          <div className="flex-1 bg-white rounded-xl shadow-sm flex flex-col overflow-hidden">

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-[2vmax] py-[1.5vmax] flex flex-col gap-[1vmax]">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center gap-[2vmax]">
                  <div className="flex flex-col items-center gap-3">
                    <div className="bg-[#e8e3f7] h-[4vmax] w-[4vmax] rounded-full flex items-center justify-center text-[#624FA4]">
                      <SparkleIcon />
                    </div>
                    <p className="text-[#372b63] text-[1vmax] font-semibold">Ask me anything about your finances</p>
                    <p className="text-[#929090] text-[0.82vmax]">I have access to your income and expense data</p>
                  </div>
                  <div className="flex flex-wrap justify-center gap-[0.8vmax] max-w-[60vmax]">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        onClick={() => sendMessage(s)}
                        className="bg-[#f7f6f6] hover:bg-[#e8e3f7] hover:text-[#624FA4] text-[#454242] text-[0.78vmax] px-[1.2vmax] py-[0.6vmax] rounded-full transition-colors duration-200 border border-transparent hover:border-[#c4b8f0]"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} gap-[0.8vmax] items-end`}>
                      {msg.role === "assistant" && (
                        <div className="h-[2.2vmax] w-[2.2vmax] rounded-full bg-[#e8e3f7] flex items-center justify-center text-[#624FA4] flex-shrink-0 mb-0.5">
                          <SparkleIcon />
                        </div>
                      )}
                      <div
                        className={`max-w-[60%] px-[1.2vmax] py-[0.9vmax] rounded-2xl text-[0.85vmax] leading-relaxed ${
                          msg.role === "user"
                            ? "bg-[#624FA4] text-white rounded-br-md"
                            : "bg-[#f7f6f6] text-[#372b63] rounded-bl-md"
                        }`}
                      >
                        {msg.content}
                      </div>
                      {msg.role === "user" && (
                        <img
                          src={userData?.picture || "https://picsum.photos/id/1/200/300"}
                          referrerPolicy="no-referrer"
                          className="h-[2.2vmax] w-[2.2vmax] rounded-full object-cover flex-shrink-0 mb-0.5"
                          alt=""
                        />
                      )}
                    </div>
                  ))}

                  {/* Typing indicator */}
                  {isLoading && (
                    <div className="flex justify-start gap-[0.8vmax] items-end">
                      <div className="h-[2.2vmax] w-[2.2vmax] rounded-full bg-[#e8e3f7] flex items-center justify-center text-[#624FA4] flex-shrink-0">
                        <SparkleIcon />
                      </div>
                      <div className="bg-[#f7f6f6] px-[1.2vmax] py-[0.9vmax] rounded-2xl rounded-bl-md flex gap-1 items-center">
                        <span className="w-1.5 h-1.5 bg-[#624FA4] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-1.5 h-1.5 bg-[#624FA4] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-1.5 h-1.5 bg-[#624FA4] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  )}
                  <div ref={bottomRef} />
                </>
              )}
            </div>

            {/* Input bar */}
            <div className="border-t border-[#f7f6f6] px-[1.5vmax] py-[1vmax] flex items-center gap-[1vmax]">
              {messages.length > 0 && (
                <button
                  onClick={() => setMessages([])}
                  className="text-[0.72vmax] text-[#929090] hover:text-red-400 transition-colors whitespace-nowrap"
                >
                  Clear chat
                </button>
              )}
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about your income, expenses, balance..."
                className="flex-1 bg-[#f7f6f6] rounded-full px-[1.5vmax] py-[0.8vmax] text-[0.85vmax] outline-none focus:ring-2 focus:ring-[#c4b8f0] transition-all placeholder-[#b0aeae]"
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || isLoading}
                className="h-[2.8vmax] w-[2.8vmax] rounded-full bg-[#624FA4] hover:bg-[#372b63] disabled:bg-[#c4b8f0] disabled:cursor-not-allowed flex items-center justify-center text-white transition-colors flex-shrink-0"
              >
                <SendIcon />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default UserHomePage;
