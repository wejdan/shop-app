import React from "react";
import CartItem from "./CartItem";
import LocalItem from "./LocalItem";
import { useCheckOut } from "../../hooks/orders/useCheckout";
import Button from "../UI/Button";
import { NavLink } from "react-router-dom";

const Cart = ({ items, local }) => {
  return (
    <div className="mt-16">
      {items.length > 0 ? (
        <div className="flex flex-col">
          <ul>
            {items.map((item) =>
              local ? (
                <LocalItem item={item} key={item.productId} />
              ) : (
                <>
                  <CartItem item={item} key={item.productId} />
                </>
              )
            )}
          </ul>
          <NavLink
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded self-end transition-colors duration-200"
            to="/checkout"
          >
            Checkout
            <svg
              className="w-4 h-4 inline-block ml-2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M3 12h18m-6-6 6 6-6 6"></path>
            </svg>
          </NavLink>
        </div>
      ) : (
        <div className="text-center p-6 text-gray-500">
          <p className="text-lg font-semibold">Your cart is empty.</p>
          <p>Looks like you haven't added anything to your cart yet.</p>
        </div>
      )}
    </div>
  );
};

export default Cart;
