// In your hooks/actors/useGetActors.js file

import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "../../services/products";
import { useAuthQuery } from "../common/useAuthQuery";
import { fetchAddresses } from "../../services/addresses";

export function useGetAllUserAddresses() {
  //console.log("useGetAllUserAddresses");
  const queryResult = useAuthQuery(
    ["addresses"], // queryKey
    fetchAddresses // queryFn
  );
  return {
    ...queryResult,
  };
}
