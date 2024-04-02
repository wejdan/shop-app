import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useOrder } from "../../../contexts/OrderContext";

const OrderSuccessPage = () => {
  const { orderPlaced, orderId, resetOrderState } = useOrder();
  const navigate = useNavigate();

  useEffect(() => {
    if (!orderPlaced) {
      navigate("/"); // Redirect to home page or cart
      return;
    }

    // Optional: Reset order state when leaving the page
  }, [orderPlaced, navigate, resetOrderState]);

  return (
    <div className="container mx-auto mt-20 px-4">
      <div
        className="bg-green-100 border-t-4 border-green-500 rounded-b text-teal-900 px-4 py-3 shadow-md"
        role="alert"
      >
        <div className="flex">
          <div className="py-1">
            <svg
              className="fill-current h-6 w-6 text-teal-500 mr-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M10 20a10 10 0 110-20 10 10 0 010 20zm-1-9V8a1 1 0 012 0v3a1 1 0 01-2 0zm0 4a1 1 0 100-2 1 1 0 000 2z" />
            </svg>
          </div>
          <div>
            <p className="font-bold">Order Placed Successfully!</p>
            <p>Your order ID is: {orderId}</p>

            <p className="text-sm">
              Thank you for your order. You will receive a confirmation email
              shortly.
            </p>
          </div>
        </div>
      </div>
      <div className="mt-6 text-center">
        <Link
          to="/"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
