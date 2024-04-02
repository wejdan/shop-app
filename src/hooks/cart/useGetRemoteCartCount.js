import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { fetchCartItemCount } from "../../services/cart";

export function useGetRemoteCartCount() {
  const user = useSelector((state) => state.auth.user);
  const localCount = useSelector((state) => state.cart.totalCount);

  // Directly use useQuery with query key and query function
  const {
    data: remoteCount,
    isLoading,
    isError,
  } = useQuery(
    ["cartCount", user?.uid], // Query key
    () => fetchCartItemCount(user.token), // Query function
    {
      enabled: !!user?.token, // Only enable query if user token exists
    }
  );

  // You can add more sophisticated error handling or loading state handling here
  if (isLoading) return "Loading...";
  if (isError) return "An error occurred";

  // Conditionally return remote count or local count based on authentication status
  return user?.token ? remoteCount : localCount;
}
