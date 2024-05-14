import IntroPage from "./Components/Intro_Page/IntroPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegisterPage from "./Components/Register_Page/RegisterPage";
import LoginPage from "./Components/Login_Page/LoginPage";
import HomePage from "./Components/Home_Page/HomePage";
import TransactionPage from "./Components/Transaction_Page/TransactionPage";
import DashboardPage from "./Components/Dashboard_Page/DashboardPage";
import IncomePage from "./Components/Income_Page/IncomePage";
import ExpensePage from "./Components/Expense_Page/ExpensePage";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<IntroPage />} />
          <Route path="/new_user" element={<RegisterPage />} />
          <Route path="/user_login" element={<LoginPage />} />
          <Route path="/home_page" element={<HomePage />} />
          <Route path="/home_page/transactions" element={<TransactionPage />} />
          <Route path="/home_page/dashboard" element={<DashboardPage />} />
          <Route path="/home_page/incomes" element={<IncomePage />} />
          <Route path="/home_page/expenses" element={<ExpensePage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
