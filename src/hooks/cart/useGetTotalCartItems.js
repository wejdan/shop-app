import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { fetchCartItemCount } from "../../services/cart";
import { useGetUserCart } from "./useGetUserCart";
import { useAuth } from "../auth/useAuth";
import { useUserData } from "../auth/useUserData";

export function useGetTotalCartItems() {
  const { userData } = useUserData(); // Use useUserData for user data

  const localCount = useSelector((state) => state.cart.totalCount);
  const { data: cartItems, isLoading, isError } = useGetUserCart();

  // Directly use useQuery with query key and query function
  // You can add more sophisticated error handling or loading state handling here
  //if (isLoading) return 0;
  //  console.log("useGetTotalCartItems called", isLoggedIn);
  if (userData?.id && localCount !== 0) {
    return null;
  }
  // Conditionally return remote count or local count based on authentication status
  if (userData?.id && !isLoading) {
    // When the user is authenticated, calculate the sum of quantities of all cart items
    const totalItems = cartItems?.reduce((total, currentItem) => {
      return total + currentItem.quantity;
    }, 0);
    // console.log("useGetTotalCartItems totalItems", totalItems);

    return totalItems;
  } else {
    // Return local count when the user is not authenticated
    return localCount;
  }
}
