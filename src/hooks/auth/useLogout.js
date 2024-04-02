import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../contexts/AuthContext";
import { useUserData } from "./useUserData"; // Adjust the path as needed

export const useLogout = () => {
  const queryClient = useQueryClient();

  const logout = () => {
    localStorage.removeItem("auth");
    queryClient.removeQueryData("user");
    // Optionally perform other cleanup actions
  };
  // Define a state or memoized value that indicates whether the user is an admin

  return { logout };
};
