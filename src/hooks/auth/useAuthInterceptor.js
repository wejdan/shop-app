import { useQueryClient } from "@tanstack/react-query";
import { useRefreshToken } from "./useRefreshToken";
import { useEffect } from "react";

// Custom React Query interceptor for automatic token refresh
export const useAuthInterceptor = () => {
  const queryClient = useQueryClient();
  const refresh = useRefreshToken(); // Assume this is adapted to return a promise

  useEffect(() => {
    const interceptor = queryClient.getQueryCache().subscribe((event) => {
      if (
        event.type === "queryFailed" &&
        event.query.state.error?.status === 401
      ) {
        // Attempt to refresh token
        refresh()
          .then(() => {
            // On success, retry the original query
            queryClient.invalidateQueries(event.query.queryKey);
          })
          .catch((error) => {
            // Handle token refresh error (e.g., logout user)
          });
      }
    });

    return () => interceptor.unsubscribe();
  }, [queryClient, refresh]);
};
