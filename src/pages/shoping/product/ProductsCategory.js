import React from "react";
import ProductsList from "../../../components/product/ProductsList";
import { useParams } from "react-router-dom";

function ProductsCategory() {
  const { categoryName } = useParams();
  return (
    <div>
      <h2>Category: {categoryName}</h2>
      <ProductsList category={categoryName} />
    </div>
  );
}

export default ProductsCategory;
