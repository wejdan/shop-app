// In a component or hook
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../contexts/AuthContext";
import { getUserData } from "../../services/auth";
import { useAuthQuery } from "../common/useAuthQuery";

export const useUserData = () => {
  const {
    data: userData,
    isLoading,
    isError,
    error,
  } = useAuthQuery(
    ["userData"], // queryKey
    getUserData,
    { staleTime: Infinity } // queryFn
  );

  return { userData, isLoading, isError, error, isLoaggedIn: userData?.id };
};
