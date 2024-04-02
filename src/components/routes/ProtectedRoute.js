import React from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useUserData } from "../../hooks/auth/useUserData";
import { useIsLoggedIn } from "../../hooks/auth/useIsLoggedIn";
import { useAuth } from "../../hooks/auth/useAuth";
import Loader from "../UI/Loader";

const ProtectedRoute = ({ children }) => {
  const { userData, isLoading } = useUserData(); // Use useUserData for user data
  console.log("ProtectedRoute", userData?.id);
  if (isLoading) {
    return <Loader />; // Ensure Loader is a component that represents a loading spinner or similar indicator
  }
  if (userData?.id) {
    return <>{children}</>;
  } else {
    return <Navigate to="/login" />;
  }

  // If user is logged in, render the child components
};

export default ProtectedRoute;
