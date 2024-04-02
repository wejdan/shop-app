import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { authenticate, logout, setTokens } from "../../store/authSlice";
import { refreshAuthToken } from "../../services/auth";
import { useIsLoggedIn } from "../auth/useIsLoggedIn";
import { useGetUser } from "../auth/useGetUser";
import { useLogout } from "../auth/useLogout";
import { useRefreshToken } from "../auth/useRefreshToken";
import { useAuth } from "../auth/useAuth";
import toast from "react-hot-toast";
import { useModalWindow } from "../../components/UI/Modal";
import { useNavigate } from "react-router-dom";

export const useAuthQuery = (queryKey, queryFn, config = {}, ...args) => {
  const { getUser, logout } = useAuth();
  const { refreshToken } = useRefreshToken();

  const queryClient = useQueryClient();
  const user = getUser();
  const isQueryEnabled = user !== null;
  // console.log(queryKey, user);
  // console.log("useAuthQuery isQueryEnabled,", queryKey, isQueryEnabled);
  // console.log("user", user);
  const { closeAllModals } = useModalWindow();

  const enhancedQueryFn = async (...queryArgs) => {
    // This function will automatically attempt to refresh the token if needed
    // and retry the queryFn with the new token
    async function executeQueryWithRefresh() {
      try {
        const result = await queryFn(user.accessToken, ...queryArgs);
        // Attempt to run the original query function first

        return result;
      } catch (error) {
        console.log("error", queryKey, error);
        // If the original query fails due to token expiration, try to refresh the token
        // if (error.status === 401) {
        //   try {
        //     const newTokens = await refreshToken();
        //     if (newTokens) {
        //       // Retry the query with new tokens
        //       return queryFn(newTokens.accessToken, ...args);
        //     }
        //   } catch (refreshError) {
        //     // If token refresh fails, logout the user
        //     logout();
        //     throw new Error("Session expired. Please log in again.");
        //   }
        // } else {
        //   // For other errors, just throw them
        //   throw error;
        // }

        if (
          error.status === 403 ||
          error.status === 401 ||
          error.message === "No refresh token available"
        ) {
          toast.dismiss();
          toast.error("Session expired. Please log in again.", {
            duration: 5000,
            // isClosable is not a supported option in react-hot-toast
          });
          closeAllModals();
          logout();
          //   navigate("/login");
        } else {
          throw error;
        }
      }
    }

    return executeQueryWithRefresh();
  };
  //s console.log(user, "isQueryEnabled=", isQueryEnabled);
  return useQuery({
    queryKey: [...queryKey],
    queryFn: enhancedQueryFn,
    ...config,
    enabled: isQueryEnabled,
  });
};
