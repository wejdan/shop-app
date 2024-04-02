import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useAuthMutation } from "../common/useAuthMutation";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";

import { checkout } from "../../services/orders";
import { useNavigate } from "react-router-dom";
import { useOrder } from "../../contexts/OrderContext";

export function useCheckOut(onSuccess, onMutationStart, onMutationEnd) {
  const queryClient = useQueryClient();
  const { markOrderAsPlaced } = useOrder();

  const checkoutMutation = useAuthMutation(checkout, {
    onMutate: async () => {
      // Called immediately before the mutation function is fired
      if (onMutationStart) onMutationStart();
    },
    onSuccess: (data) => {
      // Invalidate queries and call onSuccess from props
      queryClient.invalidateQueries(["cart"]);

      toast.success("order was placed successfuly", {
        duration: 5000,
        // isClosable is not a supported option in react-hot-toast
      });
      //  console.log("********************", data);
      markOrderAsPlaced(data.orderId);
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

  return checkoutMutation;
}
