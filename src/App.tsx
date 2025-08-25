import { useEffect, useState } from "react";
import { Route, Routes } from "react-router";
import AuthContext from "./context/AuthContext";
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import HomePage from "./pages/HomePage";
import ProtectedRoutes from "./pages/ProtectedRoutes";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

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
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
        <Routes>
          <Route element={<ProtectedRoutes />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard" element={<HomePage />} />
          </Route>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </AuthContext.Provider>
    </QueryClientProvider>
  );
}

export default App;
