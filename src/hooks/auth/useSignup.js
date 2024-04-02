import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "../../store/cartSlice";
import { useAuth } from "../../contexts/AuthContext";
import { getUserData, signUpService } from "../../services/auth";
import { syncCartWithServer } from "../../services/cart";

export const useSignup = () => {
  const { login } = useAuth();
  const cart = useSelector((state) => state.cart.items); // Assuming you're using Redux for cart state
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const {
    mutateAsync: signupMutate,
    isLoading: isSignupLoading,
    isError: isSignupError,
    error: signupError,
  } = useMutation({
    mutationFn: signUpService, // Function for final signup step, should return user data including tokens
    onSuccess: async (data) => {
      // Use login method from AuthContext to update context state
      login(data.user.id, data.accessToken, data.refreshToken);
      const userDataPromise = getUserData(data.accessToken);
      const syncCartPromise = syncCartWithServer(data.accessToken, cart);

      const [userData, syncCartResponse] = await Promise.all([
        userDataPromise,
        syncCartPromise,
      ]);

      // Cache user data and possibly updated cart
      queryClient.setQueryData(["userData"], userData);

      if (syncCartResponse && syncCartResponse.cart) {
        // Assuming syncCartWithServer response structure matches your expectation
        queryClient.setQueryData(["cart"], syncCartResponse.cart);
        dispatch(clearCart());
      }
    },
  });

  return {
    signup: signupMutate,
    isSignupLoading,
    isSignupError,
    signupError,
  };
};
