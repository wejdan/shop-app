// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { refreshAuthToken } from "../services/auth";
import { syncCartWithServer } from "../services/cart";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState(() => {
    const storedAuth = localStorage.getItem("auth");
    return storedAuth ? JSON.parse(storedAuth) : null;
  });
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!authState && !!authState.accessToken
  );
  // Load the auth state from local storage or your storage solution on initial load
  const syncCart = async (accessToken, cart) => {
    if (!accessToken) return;
    console.log("syncCart", cart);
    await syncCartWithServer(accessToken, cart);
  };
  const login = (uid, accessToken, refreshToken, cart) => {
    console.log("login wass called", uid, accessToken, refreshToken);
    const authData = { uid, accessToken, refreshToken };
    setAuthState(authData);
    localStorage.setItem("auth", JSON.stringify(authData));
    //   syncCart(accessToken, cart);
  };

  const logout = () => {
    console.log("logout*************");
    setAuthState({
      accessToken: null,
      refreshToken: null,
      uid: null,
    });
    localStorage.removeItem("auth");
    // Additional cleanup if necessary
  };
  const refreshAccessToken = async () => {
    // Ensure there's a refreshToken to use
    if (!authState || !authState.refreshToken) {
      console.error("No refresh token available.");
      logout(); // Consider logging out or handling this scenario appropriately
      return;
    }

    try {
      const { accessToken, refreshToken } = await refreshAuthToken(
        authState.refreshToken
      );

      // Assuming refreshAuthToken returns new tokens successfully

      login(authState.uid, accessToken, refreshToken); // This will update both the context and local storage
      return accessToken; // Return the new tokens
    } catch (error) {
      console.error("Failed to refresh token:", error);
      logout(); // If the refresh token is invalid/expired, logout the user
    }
  };
  useEffect(() => {
    console.log("authState was changed", authState);
    setIsLoggedIn(!!authState && !!authState.accessToken);
  }, [authState]);

  return (
    <AuthContext.Provider
      value={{
        authState,
        refreshAccessToken,
        login,
        logout,
        isLoggedIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
