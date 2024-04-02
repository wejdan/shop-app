import { useQueryClient } from "@tanstack/react-query";

export const useGetUser = () => {
  const queryClient = useQueryClient();
  const user = queryClient.getQueryData(["user"]);

  return user;
};
