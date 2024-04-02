import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useAuthMutation } from "../common/useAuthMutation";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { useModalWindow } from "../../components/UI/Modal";
import { createProduct } from "../../services/products";
import { addItemToCart } from "../../services/cart";

export function useAddToCart(onSuccess, onMutationStart, onMutationEnd) {
  const queryClient = useQueryClient();
  console.log("useAddToCart");
  const addToCartMutation = useAuthMutation(addItemToCart, {
    onMutate: async () => {
      // Called immediately before the mutation function is fired
      if (onMutationStart) onMutationStart();
    },
    onSuccess: () => {
      // Invalidate queries and call onSuccess from props
      queryClient.invalidateQueries(["cart"]);

      if (onSuccess) onSuccess();
    },
    onError: (err) => {
      // Handle error

      toast.error(err.message, {
        duration: 5000,
        // isClosable is not a supported option in react-hot-toast
      });
    },
    onSettled: () => {
      // Called on either success or error
      if (onMutationEnd) onMutationEnd();
    },
  });

  return addToCartMutation;
}
