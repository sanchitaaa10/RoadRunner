import { createContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in (on page refresh)
  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          // Verify token logic could go here, for now we decode or just trust presence
          // Ideally, you'd hit /api/auth/profile to validate
          const userData = JSON.parse(localStorage.getItem("userInfo"));
          setUser(userData);
        } catch (error) {
          localStorage.removeItem("token");
        }
      }
      setLoading(false);
    };
    checkUser();
  }, []);

  // Login Function
  const login = async (email, password) => {
    try {
      const { data } = await axios.post("http://localhost:5001/api/auth/login", {
        email,
        password,
      });

      // Save to storage
      localStorage.setItem("token", data.token);
      localStorage.setItem("userInfo", JSON.stringify(data));
      setUser(data);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || "Login failed" 
      };
    }
  };

  // Logout Function
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;