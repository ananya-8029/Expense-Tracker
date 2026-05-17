import IntroPage from "./Components/Intro_Page/IntroPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./Components/Home_Page/HomePage";
import TransactionPage from "./Components/Transaction_Page/TransactionPage";
import DashboardPage from "./Components/Dashboard_Page/DashboardPage";
import IncomePage from "./Components/Income_Page/IncomePage";
import ExpensePage from "./Components/Expense_Page/ExpensePage";
import AdminPage from "./Components/Admin_Page/AdminPage";
import UserHomePage from "./Components/Home_Page/UserHomePage";
import ProfilePage from "./Components/Profile_Page/ProfilePage";
import SettingsPage from "./Components/Settings_Page/SettingsPage";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<IntroPage />} />
          <Route path="/home_page" element={<HomePage />} />
          <Route path="/home_page/home" element={<UserHomePage />} />
          <Route path="/home_page/transactions" element={<TransactionPage />} />
          <Route path="/home_page/dashboard" element={<DashboardPage />} />
          <Route path="/home_page/incomes" element={<IncomePage />} />
          <Route path="/home_page/expenses" element={<ExpensePage />} />
          <Route path="/admin/dashboard" element={<AdminPage />} />
          <Route path="/home_page/profile" element={<ProfilePage />} />
          <Route path="/home_page/settings" element={<SettingsPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
