import { json } from "react-router-dom";
import { customFetch } from "../utils/utils";

const URL = `${process.env.REACT_APP_API_URL}/products`;

export const fetchCategories = (signal) => {
  return customFetch(`${URL}/categories`, { signal });
};
export async function createProduct(token, productData) {
  const formData = new FormData();
  formData.append("name", productData.name);
  formData.append("price", productData.price);
  formData.append("description", productData.description);
  formData.append("category", productData.category);
  formData.append("quantity", productData.quantity);

  // Append images if available
  productData.imgs.forEach((image, index) => {
    formData.append(`imgs`, image); // Assuming `img` is the field name for product images
  });

  return customFetch(`${URL}`, {
    method: "POST",
    body: formData,
    token, // Pass the token directly; customFetch will handle Authorization header
  });
}

export async function updateProduct(
  token,

  productData
) {
  const formData = new FormData();
  const {
    id: productId,
    newImgs,
    retainedImgs,
    removedImgs,
    ...restOfData
  } = productData;

  console.log(newImgs, retainedImgs, removedImgs);

  // Append standard fields to formData (excluding image-related fields)

  // Append standard fields to formData
  Object.entries(restOfData).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });

  // Append new images as 'newImgs'
  if (newImgs.length > 0) {
    console.log("newImgs is bigger than 0");
    newImgs.forEach((imageFile) => {
      formData.append("newImgs", imageFile);
    });
  }
  if (retainedImgs.length > 0) {
    formData.append("retainedImgs", JSON.stringify(retainedImgs));
  } else {
    formData.append("retainedImgs", JSON.stringify([]));
  }

  if (removedImgs.length > 0) {
    formData.append("removedImgs", JSON.stringify(removedImgs));
  } else {
    formData.append("removedImgs", JSON.stringify([]));
  }
  console.log(formData);
  return customFetch(`${URL}/${productId}`, {
    method: "PATCH",
    body: formData,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export const getAllProducts = async (
  searchQuery = "",
  pageParam = 1, // Default to page 1 if not provided
  sortBy,
  sortDir,
  category
) => {
  const params = new URLSearchParams({
    query: searchQuery,
    page: pageParam, // Use pageParam instead of the "page" argument
    sortBy,
    sortDir,
  });
  const apiURL = category
    ? `${URL}/category/${category}?${params.toString()}`
    : `${URL}?${params.toString()}`;
  return customFetch(apiURL);
};

export const deleteProduct = async (token, productId) => {
  return customFetch(`${URL}/${productId}`, {
    method: "DELETE",
    token,
  });
};
export const fetchProductsByCategory = async (
  signal,
  categoryId,
  page = 1,
  pageSize = 10
) => {
  const params = new URLSearchParams({ page, pageSize });
  return customFetch(`${URL}/category/${categoryId}?${params.toString()}`, {
    signal,
  });
};
export const fetchProductData = async (signal, productId) => {
  return customFetch(`${URL}/${productId}`, { signal });
};
