import { useSelector } from "react-redux";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../NavBar/NavBar";
import MenuBar from "../Menu_Bar/MenuBar";
import useAuthGuard from "../../utils/useAuthGuard";
import axios from "axios";
import defaultAvatar from "../../utils/defaultAvatar";

const getGreeting = () => {
  const h = new Date().getHours();
  if (h >= 5  && h < 12) return "Good morning";
  if (h >= 12 && h < 17) return "Good afternoon";
  return "Good evening";
};

const SUGGESTIONS = [
  { text: "What's my total income so far?",      emoji: "💰" },
  { text: "How much have I spent in total?",      emoji: "💸" },
  { text: "What's my current net balance?",       emoji: "📊" },
  { text: "Which is my biggest expense category?",emoji: "📌" },
  { text: "Am I spending more than I earn?",      emoji: "⚖️" },
  { text: "Give me a quick financial summary.",   emoji: "📋" },
];

const SparkleIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5z" />
  </svg>
);

const SendIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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

    setMessages((prev) => [...prev, { role: "user", content: prompt }]);
    setInput("");
    setIsLoading(true);

    try {
      const authToken = localStorage.getItem("authToken");
      const history = messages.slice(-6).map(({ role, content }) => ({ role, content }));
      const res = await axios.post(
        "${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/ai/ask",
        { prompt, history },
        { headers: { "auth-token": authToken } }
      );
      setMessages((prev) => [...prev, { role: "assistant", content: res.data.response }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I couldn't process that. Please try again." },
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
    <div className="bg-gradient-to-br from-[#f0ecfc] via-[#f7f6f6] to-[#f7f6f6] min-h-screen h-screen w-full">
      <div className="flex justify-end">
        <NavBar btnClick={btnClick} />
      </div>
      <MenuBar setBtnClick={setBtnClick} btnClick={btnClick} />

      <div className="h-screen w-full flex items-end justify-end">
        <div className="h-[calc(100%-3rem)] md:h-[89%] w-full md:w-[95%] flex flex-col px-3 md:px-[2vmax] pt-2 md:pt-[1vmax] pb-[4.5rem] md:pb-[1.5vmax]">

          {/* Chat area */}
          <div className="flex-1 bg-white rounded-2xl shadow-sm flex flex-col overflow-hidden border border-[#ede9fb]">

            {/* Chat header */}
            <div className="flex items-center gap-2 px-[1.8vmax] py-[1vmax] border-b border-[#f3f0fb]">
              <div className="h-[1.8vmax] w-[1.8vmax] rounded-full bg-gradient-to-br from-[#624FA4] to-[#9b7fe8] flex items-center justify-center text-white flex-shrink-0">
                <SparkleIcon size={10} />
              </div>
              <span className="text-[#372b63] text-[0.82vmax] font-semibold">BudgetBuddy AI</span>
              <span className="ml-auto text-[0.7vmax] text-[#b0aeae]">Powered by Gemini</span>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-[2vmax] py-[1.5vmax] flex flex-col gap-[1vmax]">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center gap-[1.8vmax]">
                  {/* Icon + greeting */}
                  <div className="flex flex-col items-center gap-[0.8vmax]">
                    <div className="h-[5vmax] w-[5vmax] rounded-full bg-gradient-to-br from-[#624FA4] to-[#9b7fe8] flex items-center justify-center text-white shadow-lg">
                      <SparkleIcon size={22} />
                    </div>
                    <div className="text-center">
                      <p className="text-[#372b63] text-[1.4vmax] font-bold">
                        {getGreeting()}, {userData?.username?.split(" ")[0] || "there"}
                      </p>
                      <p className="text-[#929090] text-[0.82vmax] mt-1">
                        Ask me anything about your finances — I have access to your data.
                      </p>
                    </div>
                  </div>

                  {/* Suggestion chips */}
                  <div className="grid grid-cols-3 gap-[0.7vmax] w-full max-w-[55vmax]">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s.text}
                        onClick={() => sendMessage(s.text)}
                        className="flex items-start gap-2 bg-[#f7f6f6] hover:bg-[#ede9fb] border border-transparent hover:border-[#c4b8f0] rounded-xl px-[1vmax] py-[0.8vmax] text-left transition-all duration-200 group"
                      >
                        <span className="text-[0.9vmax] flex-shrink-0 mt-0.5">{s.emoji}</span>
                        <span className="text-[#454242] group-hover:text-[#624FA4] text-[0.75vmax] leading-snug">{s.text}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} gap-[0.8vmax] items-end`}>
                      {msg.role === "assistant" && (
                        <div className="h-[2vmax] w-[2vmax] rounded-full bg-gradient-to-br from-[#624FA4] to-[#9b7fe8] flex items-center justify-center text-white flex-shrink-0 mb-0.5 shadow-sm">
                          <SparkleIcon size={10} />
                        </div>
                      )}
                      <div className={`max-w-[60%] px-[1.2vmax] py-[0.9vmax] rounded-2xl text-[0.85vmax] leading-relaxed shadow-sm ${
                        msg.role === "user"
                          ? "bg-gradient-to-br from-[#624FA4] to-[#372b63] text-white rounded-br-sm"
                          : "bg-[#f7f6f6] text-[#372b63] rounded-bl-sm border border-[#ede9fb]"
                      }`}>
                        {msg.content}
                      </div>
                      {msg.role === "user" && (
                        <img
                          src={userData?.picture || defaultAvatar}
                          referrerPolicy="no-referrer"
                          className="h-[2vmax] w-[2vmax] rounded-full object-cover flex-shrink-0 mb-0.5 shadow-sm"
                          alt=""
                        />
                      )}
                    </div>
                  ))}

                  {/* Typing indicator */}
                  {isLoading && (
                    <div className="flex justify-start gap-[0.8vmax] items-end">
                      <div className="h-[2vmax] w-[2vmax] rounded-full bg-gradient-to-br from-[#624FA4] to-[#9b7fe8] flex items-center justify-center text-white flex-shrink-0 shadow-sm">
                        <SparkleIcon size={10} />
                      </div>
                      <div className="bg-[#f7f6f6] px-[1.2vmax] py-[0.9vmax] rounded-2xl rounded-bl-sm border border-[#ede9fb] flex gap-1.5 items-center">
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
            <div className="border-t border-[#f3f0fb] px-[1.5vmax] py-[1vmax] flex items-center gap-[0.8vmax] bg-[#fdfcff]">
              {messages.length > 0 && (
                <button
                  onClick={() => setMessages([])}
                  className="text-[0.7vmax] text-[#b0aeae] hover:text-red-400 transition-colors whitespace-nowrap flex-shrink-0"
                >
                  Clear
                </button>
              )}
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about your income, expenses, balance..."
                className="flex-1 bg-[#f3f0fb] rounded-full px-[1.5vmax] py-[0.75vmax] text-[0.85vmax] outline-none focus:ring-2 focus:ring-[#c4b8f0] transition-all placeholder-[#b0aeae] text-[#372b63]"
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || isLoading}
                className="h-[2.6vmax] w-[2.6vmax] rounded-full bg-gradient-to-br from-[#624FA4] to-[#372b63] hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-white transition-all flex-shrink-0 shadow-sm"
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
