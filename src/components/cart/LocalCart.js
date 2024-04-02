// LocalCart.js
import React from "react";
import { useSelector } from "react-redux";
import Cart from "./Cart";

const LocalCart = () => {
  // Use useSelector to get cart items from the Redux store
  const cartItems = useSelector((state) => state.cart.items);

  return (
    <div>
      {/* Pass cartItems to the Cart component as props */}
      <Cart local={true} items={cartItems} />
    </div>
  );
};

export default LocalCart;
