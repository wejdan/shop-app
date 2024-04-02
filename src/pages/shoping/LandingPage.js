import React, { useEffect } from "react";
import { useGetProducts } from "../../hooks/products/useGetProductsWithInfiniteScroll";
import ProductCard from "../../components/product/ProductCard";
import FilterComponent from "../../components/product/Filter";
import { useSearchParams } from "react-router-dom";
import ProductsList from "../../components/product/ProductsList";
import { useOrder } from "../../contexts/OrderContext";

function LandingPage() {
  return <ProductsList />;
}

export default LandingPage;
