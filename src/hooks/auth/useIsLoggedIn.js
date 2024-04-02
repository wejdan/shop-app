import { useQueryClient } from "@tanstack/react-query";

export function useIsLoggedIn() {
  const queryClient = useQueryClient();
  const user = queryClient.getQueryData(["user"]);
  console.log("useIsLoggedIn", user, !!user && !!user.accessToken);
  return !!user && !!user.accessToken; // returns true if accessToken exists
}
