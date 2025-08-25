import { createContext, Dispatch, SetStateAction } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>;
}

// Provide a default value just to satisfy TS (won’t really be used)
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  setIsAuthenticated: () => {}, // placeholder
});

export default AuthContext;
