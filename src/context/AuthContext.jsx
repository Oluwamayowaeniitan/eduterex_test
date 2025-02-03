// context/AuthContext.js

import React, { createContext, useState, useEffect, useContext } from "react";
import { getToken, removeToken, setToken } from "../utils/tokenHelper";
import { getUser, removeUser, setUser } from "../utils/userHelper";
import { removeSchoolData } from "../utils/schoolHelper";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    user: null,
    accessToken: null,
    refreshToken: null,
    loading: true,
  });

  useEffect(() => {
    const loadUserData = () => {
      setAuthState({ ...authState, loading: true });
      try {
        const token = getToken();
        const user = getUser();
        if (token && user) {
          setAuthState({
            ...authState,
            isAuthenticated: true,
            accessToken: token,
            user: user,
            loading: false,
          });
        } else {
          setAuthState({ ...authState, loading: false });
        }
      } catch (error) {
        setAuthState({ ...authState, loading: false });
        console.log("Unable to fetch data", error);
      }
    };
    loadUserData();
  }, []);

  const login = (userData, tokens) => {
    setAuthState({
      ...authState,
      isAuthenticated: true,
      user: userData,
      ...tokens,
    });
    setToken(tokens.accessToken); // Save the access token
    setUser(userData);
  };

  const updateUser = (userData) => {
    setAuthState({ ...authState, user: userData });
    setUser(userData);
  };

  const logout = () => {
    setAuthState({ ...authState, isAuthenticated: false, user: null });
    removeToken(); // Remove the access token
    removeUser();
    removeSchoolData();
  };

  return (
    <AuthContext.Provider value={{ authState, updateUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
