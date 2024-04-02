import { useQueryClient } from "@tanstack/react-query";
import { refreshAuthToken } from "../../services/auth";

let refreshInProgress = null;

export const useRefreshToken = () => {
  const queryClient = useQueryClient();

  const refreshToken = async () => {
    // Return the existing promise if a refresh is already in progress
    if (refreshInProgress) return refreshInProgress;

    // Otherwise, start a new refresh operation
    refreshInProgress = (async () => {
      try {
        const authData = queryClient.getQueryData(["auth"]);
        const result = await refreshAuthToken(authData?.refreshToken);
        if (result) {
          const { accessToken, refreshToken, uid } = result;
          const updatedAuthData = { uid, accessToken, refreshToken };
          localStorage.setItem("auth", JSON.stringify(updatedAuthData));
          queryClient.setQueryData(["auth"], updatedAuthData);
          return updatedAuthData;
        }
      } catch (error) {
        console.error("Failed to refresh token:", error);
        throw error;
      } finally {
        refreshInProgress = null; // Reset after completion
      }
    })();

    return refreshInProgress;
  };

  return { refreshToken };
};
