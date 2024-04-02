import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { syncCartWithServer } from "../../services/cart";
import { clearCart } from "../../store/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  getUserData,
  loginService,
  refreshAuthToken,
  signUpService,
} from "../../services/auth";
import { useUserData } from "./useUserData";

export function useAuth() {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.items);
  // Rehydrate auth state from localStorage
  // Sign up mutation
  const {
    mutateAsync: signupMutate,
    isPending: isSignupLoading,
    isError: isSignupError,
    error: signupError,
  } = useMutation({
    mutationFn: signUpService,
    onSuccess: async (data) => {
      const authData = {
        uid: data.user.id,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      };
      queryClient.setQueryData(["auth"], authData);
      localStorage.setItem("auth", JSON.stringify(authData));
      queryClient.invalidateQueries();
      await syncUserDataAndCart(data.accessToken);
    },
  });

  // Login mutation
  const {
    mutateAsync: loginMutate,
    isPending: isLoginLoading,
    isError: isLoginError,
    error: loginError,
  } = useMutation({
    mutationFn: loginService,
    onSuccess: async (data) => {
      const authData = {
        uid: data.user.id,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      };
      //   queryClient.setQueryData(["auth"], authData);
      localStorage.setItem("auth", JSON.stringify(authData));
      queryClient.invalidateQueries();

      await syncUserDataAndCart(data.accessToken);
    },
  });

  // Logout function
  const logout = () => {
    localStorage.removeItem("auth");
    //queryClient.invalidateQueries();
    queryClient.removeQueries();
    // throw Error("test");
  };

  // Refresh token mutation

  // Use this function to sync user data and cart upon login or sign up
  const syncUserDataAndCart = async (accessToken) => {
    // You might need to adjust this function based on your actual implementations
    const userDataPromise = getUserData(accessToken);
    const syncCartPromise = syncCartWithServer(accessToken, cart);

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
  };

  const isLoggedIn = useQuery({
    queryKey: ["isLoggedIn"],
    queryFn: () => {
      const authData = queryClient.getQueryData(["auth"]);
      return !!authData && !!authData.accessToken;
    },
    select: (data) => data,
    cacheTime: Infinity,
  });

  // Define a query for isAdmin

  function getUser() {
    //  const authData = queryClient.getQueryData(["auth"]);
    const authDataString = localStorage.getItem("auth");
    return authDataString ? JSON.parse(authDataString) : null;
  }
  // Rehydrate auth state on initial load

  return {
    signup: signupMutate,
    isSignupLoading,
    isSignupError,
    signupError,
    login: loginMutate,
    isLoginLoading,
    isLoginError,
    loginError,
    logout,
    isLoggedIn: isLoggedIn.data,
    getUser,
  };
}
