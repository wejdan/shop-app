import React, { useEffect, useRef } from "react";
import { useGetProductsWithInfiniteScroll } from "../../hooks/products/useGetProductsWithInfiniteScroll";
import ProductCard from "../../components/product/ProductCard";
import FilterComponent from "../../components/product/Filter";
import { useSearchParams } from "react-router-dom";

function ProductsList({ category }) {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("searchQuery") || "";
  const sortOption = searchParams.get("sortOption") || "createdAt_desc";
  const [sortBy, sortDir] = sortOption.split("_");

  const page = parseInt(searchParams.get("page") || "1", 10);

  // Pass the search parameters to the hook
  const { data, isLoading, fetchNextPage, hasNextPage } =
    useGetProductsWithInfiniteScroll(searchQuery, sortBy, sortDir, category);
  const lastProductRef = useRef();

  const handleScroll = () => {
    if (
      window.innerHeight + window.scrollY + 1 >= document.body.offsetHeight &&
      !isLoading &&
      hasNextPage
    ) {
      console.log("Reached end of page");
      fetchNextPage();
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [fetchNextPage, hasNextPage, isLoading]);

  const onAddToCart = () => {};
  const handleFilterChange = (filters) => {
    //fetchProducts(filters);
  };

  if (isLoading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <FilterComponent
        onFilterChange={handleFilterChange}
        pages={data?.totalPages}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {data?.pages.map((pageData, pageIndex) => (
          <React.Fragment key={pageIndex}>
            {pageData.products.map((product, productIndex) => {
              if (
                pageIndex === data.pages.length - 1 &&
                productIndex === pageData.products.length - 1
              ) {
                return (
                  <div key={product.id} ref={lastProductRef}>
                    <ProductCard product={product} onAddToCart={onAddToCart} />
                  </div>
                );
              } else {
                return (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={onAddToCart}
                  />
                );
              }
            })}
          </React.Fragment>
        ))}
      </div>
      {isLoading && (
        <div id="loadMore" className="text-center mt-10">
          Loading more...
        </div>
      )}
    </div>
  );
}

export default ProductsList;
