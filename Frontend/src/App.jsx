import IntroPage from "./Components/Intro_Page/IntroPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegisterPage from "./Components/Register_Page/RegisterPage";
import LoginPage from "./Components/Login_Page/LoginPage";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<IntroPage />} />
          <Route path="/newuser" element={<RegisterPage />} />
          <Route path="/existingUser" element={<LoginPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
