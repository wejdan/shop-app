// In your hooks/actors/useGetActors.js file

import { useQuery } from "@tanstack/react-query";
import { fetchProductData } from "../../services/products";

export function useGetProductDetails(productId) {
  const queryResult = useQuery({
    queryKey: ["product", productId],
    queryFn: ({ signal }) => fetchProductData(signal, productId),
    keepPreviousData: true, // Optional: Keep previous data while fetching the next page's data
  });

  return {
    ...queryResult,
  };
}
