import { useQuery } from "@tanstack/react-query";
import { getAllProducts } from "../../services/products";

export function useGetProducts(
  searchQuery = "",
  currentPage = 1,
  sortBy,
  sortDir,
  category
) {
  const queryResult = useQuery({
    queryKey: ["products", searchQuery, currentPage, sortBy, sortDir, category],
    queryFn: () =>
      getAllProducts(searchQuery, currentPage, sortBy, sortDir, category),
    keepPreviousData: true, // Optional: Keep previous data while fetching the next page's data
  });

  return {
    ...queryResult,
  };
}
