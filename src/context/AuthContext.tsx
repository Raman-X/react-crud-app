import { createContext } from "react";

// we'll pass an object with both state and updater
const AuthContext = createContext({
  isAuthenticated: false,
  setIsAuthenticated: () => {},
});

export default AuthContext;
