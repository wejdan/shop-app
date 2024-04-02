// In your hooks/actors/useGetActors.js file

import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "../../services/products";
import { useAuthQuery } from "../common/useAuthQuery";
import { fetchCart } from "../../services/cart";
import { fetchAllOrders, fetchUserOrders } from "../../services/orders";

export function useGetAllOrders(currentPage, limit) {
  const queryResult = useAuthQuery(
    ["orders", "all", currentPage, limit], // queryKey
    fetchAllOrders,
    {},
    currentPage,
    limit // queryFn
  );
  return {
    ...queryResult,
  };
}
