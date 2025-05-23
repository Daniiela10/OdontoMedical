import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const savedToken = localStorage.getItem("token");
    return savedToken ? jwtDecode(savedToken) : null;
  });

  // Guardar token y usuario al hacer login
  const login = (jwt) => {
    localStorage.setItem("token", jwt);
    setToken(jwt);
    setUser(jwtDecode(jwt));
  };

  // Eliminar token y usuario al hacer logout
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  // Verificar expiración del token
  useEffect(() => {
    if (token) {
      const { exp } = jwtDecode(token);
      const now = Date.now() / 1000;
      if (exp < now) {
        logout();
      }
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};