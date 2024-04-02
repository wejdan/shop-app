import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom
import { authenticate, logout, setTokens } from "../../store/authSlice";
import { toast } from "react-hot-toast";
import { useModalWindow } from "../../components/UI/Modal";
import { useAuth } from "../auth/useAuth";
import { useRefreshToken } from "../auth/useRefreshToken";

export const useAuthMutation = (mutationFn, config) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { getUser, logout } = useAuth();
  const user = getUser();
  // console.log("useAuthMutation user==", user);
  const { refreshToken } = useRefreshToken();
  const { closeAllModals } = useModalWindow();
  const mutation = useMutation({
    mutationFn: async (data) => {
      try {
        return await mutationFn(user.accessToken, data);
      } catch (error) {
        // if (error.status === 401) {
        //   // Assuming error.status is set correctly
        //   try {
        //     const newTokens = await refreshToken();
        //     // Retry the query with new tokens
        //     if (newTokens) {
        //       return await mutationFn(newTokens.accessToken, data);
        //     }
        //   } catch (refreshError) {
        //     // Refresh token failed; log out the user
        //     logout();
        //     throw new Error("Session expired. Please log in again.");
        //   }
        // } else {
        //   throw error; // For errors other than 401, re-throw them
        // }

        throw error;
      }
    },
    ...config,
    onError: (error) => {
      // Handle the error
      toast.dismiss(); // Dismiss any existing toast first

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
        navigate("/login");
      } else if (config.onError) {
        config.onError(error);
      }
    },
  });

  return mutation;
};
