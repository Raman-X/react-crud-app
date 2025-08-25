import { useEffect, useState } from "react";
import { Route, Routes } from "react-router";
import AuthContext from "./context/AuthContext";
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import HomePage from "./pages/HomePage";
import ProtectedRoutes from "./pages/ProtectedRoutes";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Read from localStorage on first load
    const savedAuth = localStorage.getItem("isAuthenticated");
    return savedAuth === "true"; // convert string back to boolean
  });

  // Keep localStorage in sync whenever state changes
  useEffect(() => {
    localStorage.setItem("isAuthenticated", String(isAuthenticated));
  }, [isAuthenticated]);
  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      <Routes>
        <Route element={<ProtectedRoutes />}>
          <Route path="/" element={<HomePage />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </AuthContext.Provider>
  );
}

export default App;
