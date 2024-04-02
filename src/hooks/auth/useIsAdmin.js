import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../contexts/AuthContext";
import { useIsLoggedIn } from "./useIsLoggedIn";
import { useUserData } from "./useUserData"; // Adjust the path as needed

export const useIsAdmin = () => {
  const { userData, isLoading, isError } = useUserData();

  // Define a state or memoized value that indicates whether the user is an admin
  const isAdmin = userData && userData.role === "admin";

  return { isAdmin, isLoading, isError };
};
