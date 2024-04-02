// src/hooks/useLogin.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../contexts/AuthContext";
import { getUserData, loginService } from "../../services/auth";
import { useDispatch, useSelector } from "react-redux";
import { clearCart, syncCart } from "../../store/cartSlice";
import { syncCartWithServer } from "../../services/cart";
export const useLogin = () => {
  // const { login } = useAuth();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.items);
  const queryClient = useQueryClient();
  const { mutateAsync, isPending, isError, error } = useMutation({
    mutationFn: loginService,
    onSuccess: async (data) => {
      // Assuming 'data' contains the access token

      //  login(data.user.id, data.accessToken, data.refreshToken); // Update auth context with user info and tokens
      const authData = {
        uid: data.user.id,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      };
      queryClient.setQueryData(["user"], authData);
      localStorage.setItem("auth", JSON.stringify(authData));

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
      // Fetch and cache user data
      //queryClient.invalidateQueries(["cart"]);

      // Optionally, invalidate queries that depend on the user being logged in
    },
  });

  return { login: mutateAsync, isPending, isError, error };
};
