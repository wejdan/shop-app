import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useAuthMutation } from "../common/useAuthMutation";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { useModalWindow } from "../../components/UI/Modal";
import { createProduct, updateProduct } from "../../services/products";

export function useEditProduct(onSuccess, onMutationStart, onMutationEnd) {
  const queryClient = useQueryClient();
  const { onClose } = useModalWindow();

  const editProductMutation = useAuthMutation(updateProduct, {
    onMutate: async () => {
      // Called immediately before the mutation function is fired
      if (onMutationStart) onMutationStart();
    },
    onSuccess: () => {
      // Invalidate queries and call onSuccess from props
      queryClient.invalidateQueries(["products"]);

      onClose("edit-product")(); // Close the genres modal
      toast.success("product was added successfuly", {
        duration: 5000,
        // isClosable is not a supported option in react-hot-toast
      });
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

  return editProductMutation;
}
