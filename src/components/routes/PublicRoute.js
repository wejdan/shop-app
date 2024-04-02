import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useIsLoggedIn } from "../../hooks/auth/useIsLoggedIn";
import { useAuth } from "../../hooks/auth/useAuth";
import { useUserData } from "../../hooks/auth/useUserData";
import Loader from "../UI/Loader";

function PublicRoute({ children }) {
  const { userData, isLoading, isError } = useUserData();
  if (isLoading) {
    return <Loader />; // Ensure Loader is a component that represents a loading spinner or similar indicator
  }
  if (!userData) {
    return <>{children}</>;
  } else {
    return <Navigate to="/" replace />;
  }

  // If user is logged in, render the child components
}

export default PublicRoute;
