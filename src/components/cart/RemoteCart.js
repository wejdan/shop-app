// LocalCart.js
import React from "react";
import { useSelector } from "react-redux";
import Cart from "./Cart";
import Button from "../UI/Button";

import { useGetUserCart } from "../../hooks/cart/useGetUserCart";
import { useUpdateCart } from "../../hooks/cart/useUpdateCart";
import { useCheckOut } from "../../hooks/orders/useCheckout";

const RemoteCart = () => {
  // Use useSelector to get cart items from the Redux store
  const { data: cartItems, isLoading } = useGetUserCart();

  if (isLoading) {
    return <div>Loading ....</div>;
  }

  return (
    <div>
      {/* Pass cartItems to the Cart component as props */}
      <Cart items={cartItems} />
    </div>
  );
};

export default RemoteCart;
