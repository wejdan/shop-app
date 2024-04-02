// In your hooks/actors/useGetActors.js file

import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "../../services/products";
import { useAuthQuery } from "../common/useAuthQuery";
import { fetchCart } from "../../services/cart";
import { useAuth } from "../../contexts/AuthContext";

export function useGetUserCart() {
  const queryResult = useAuthQuery(
    ["cart"], // queryKey
    fetchCart // queryFn
  );
  return {
    ...queryResult,
  };
}
