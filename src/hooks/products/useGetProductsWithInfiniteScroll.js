import { useInfiniteQuery } from "@tanstack/react-query";
import { getAllProducts } from "../../services/products";

export function useGetProductsWithInfiniteScroll(
  searchQuery = "",
  sortBy,
  sortDir,
  category
) {
  const queryResult = useInfiniteQuery({
    queryKey: ["products", searchQuery, sortBy, sortDir, category],
    queryFn: ({ pageParam = 1 }) =>
      getAllProducts(searchQuery, pageParam, sortBy, sortDir, category),
    getNextPageParam: (lastPage, allPages) => {
      // Calculate next page based on current data
      const currentPage = lastPage?.currentPage || 0;
      const totalPages = lastPage?.totalPages || 0;
      return currentPage < totalPages ? currentPage + 1 : null;
    },
    getPreviousPageParam: (firstPage, allPages) => {
      // Calculate previous page based on current data
      const currentPage = firstPage?.currentPage || 0;
      return currentPage > 1 ? currentPage - 1 : undefined;
    },
    keepPreviousData: true,
  });

  return {
    ...queryResult,
  };
}
