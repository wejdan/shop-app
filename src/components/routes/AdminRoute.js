import React from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Error from "../UI/Error";
import { useUserData } from "../../hooks/auth/useUserData";
import { useAuth } from "../../contexts/AuthContext";
import { useIsAdmin } from "../../hooks/auth/useIsAdmin";
import { useIsLoggedIn } from "../../hooks/auth/useIsLoggedIn";
import Loader from "../UI/Loader";

const AdminRoute = ({ children }) => {
  const { userData, isLoading, isError } = useUserData();

  // Define a state or memoized value that indicates whether the user is an admin
  const isAdmin = userData && userData.role === "admin";
  // If the user is an admin, render the children components
  if (isLoading) {
    return <Loader />; // Ensure Loader is a component that represents a loading spinner or similar indicator
  }
  if (isAdmin) {
    return <>{children}</>;
  } else if (userData?.id && !isAdmin) {
    return (
      <Error msg="Access Denied: You do not have permission to view this page." />
    );
  } else {
    // Redirect to login page if not logged in
    return <Navigate to="/login" />;
  }
};

export default AdminRoute;
