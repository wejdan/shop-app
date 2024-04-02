import React from "react";
import { useSelector } from "react-redux";
import RemoteCart from "../../../components/cart/RemoteCart";
import LocalCart from "../../../components/cart/LocalCart";
import { useUserData } from "../../../hooks/auth/useUserData";
import { useAuth } from "../../../hooks/auth/useAuth";
import { useIsAdmin } from "../../../hooks/auth/useIsAdmin";

function CartPage() {
  const { userData, isLoading, isError } = useUserData();

  // Define a state or memoized value that indicates whether the user is an admin
  const isAdmin = userData && userData.role === "admin";

  // Check if the user is an admin

  if (isAdmin) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h2 className="text-lg font-semibold">Admin User Detected</h2>
        <p className="mt-2">
          Admin users do not have access to cart functionality. Please create or
          use a regular user account to add items to the cart and proceed with
          checkout.
        </p>
      </div>
    );
  }

  // Render RemoteCart if the user is logged in and not an admin, otherwise render LocalCart
  return <div>{userData?.id ? <RemoteCart /> : <LocalCart />}</div>;
}

export default CartPage;
