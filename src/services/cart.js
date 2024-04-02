import { customFetch } from "../utils/utils";

const URL = `${process.env.REACT_APP_API_URL}/cart`;

// Function to fetch the user's cart
export const fetchCart = async (token) => {
  return customFetch(`${URL}`, {
    method: "GET",
    token,
  });
};

// Function to add an item to the cart
export const addItemToCart = async (token, item) => {
  console.log("addItemToCart");
  console.log(token, item);
  const { productId, quantity } = item;
  return customFetch(`${URL}`, {
    method: "POST",
    body: JSON.stringify({ productId, quantity }),

    token,
  });
};

// Function to update an item's quantity in the cart
export const updateCartItem = async (token, item) => {
  const { productId, quantity } = item;
  return customFetch(`${URL}/${productId}`, {
    method: "PATCH",
    body: JSON.stringify({ quantity }),

    token,
  });
};

// Function to remove an item from the cart
export const removeItemFromCart = async (token, productId) => {
  return customFetch(`${URL}/${productId}`, {
    method: "DELETE",
    token,
  });
};

// Function to sync the cart with the server
export const syncCartWithServer = async (token, cart) => {
  console.log("syncCartWithServer", token, cart);
  return customFetch(`${URL}/sync`, {
    method: "POST",
    body: JSON.stringify({ cart }),

    token,
  });
};
export const fetchCartItemCount = async (token) => {
  return customFetch(`${URL}/cart-count`, {
    method: "GET",
    token,
  });
};
