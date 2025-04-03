import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
 const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const register = async (name, email, password) => {
    try {
      const { data } = await axios.post("http://localhost:3000/api/auth/register", { name, email, password }).then((response) => {
        if (response.status === 201) {

          return response.data;
        } else {
          throw new Error("Registration failed");
        }
      });
      // localStorage.setItem("user", JSON.stringify(data));
      // setUser(data);
    } catch (error) {
      console.error("Registration failed", error);
    }
  };

  const login = async (email, password, navigate) => {
    try {
       await axios.post("http://localhost:3000/api/auth/login", { email, password }).then((response) => {
        if (response.status === 200) { 
          localStorage.setItem("user", JSON.stringify({name:response.data.name, email:response.data.email}));
          localStorage.setItem("token", response.data.token);
          setIsAuthenticated(true);
          setUser(response);
          navigate("/dashboard");
         }
        return response.data;
      }).catch((error) => {
        console.log(error.response.data.message);
        toast.error(error.response.data.message );
      });
        
      
    } catch (error) {
      toast.error(error.message);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
