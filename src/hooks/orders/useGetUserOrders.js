// In your hooks/actors/useGetActors.js file

import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "../../services/products";
import { useAuthQuery } from "../common/useAuthQuery";
import { fetchCart } from "../../services/cart";
import { fetchUserOrders } from "../../services/orders";

export function useGetUserOrders(currentPage, itemsPerPage) {
  const queryResult = useAuthQuery(
    ["orders", currentPage, itemsPerPage], // queryKey
    fetchUserOrders, // queryFn
    {},
    currentPage,
    itemsPerPage
  );
  return {
    ...queryResult,
  };
}
