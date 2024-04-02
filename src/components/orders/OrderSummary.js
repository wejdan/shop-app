import React, { useState } from "react";
import { BASE_URL } from "../../utils/constants";
import { handleDownloadInvoice } from "../../services/orders";
import Button from "../UI/Button";

const OrderSummary = ({ order }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(false);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  const onDownloadInvoiceClick = async (orderId) => {
    setLoading(true);
    await handleDownloadInvoice(orderId, true).catch((error) => {
      setLoading(false);
      console.error("Error downloading invoice:", error);
      // Optionally, display an error message to the user
    });
    setLoading(false);
  };
  return (
    <div className="mb-6 bg-white rounded-lg shadow-md">
      <div className="p-4">
        <div className="flex justify-between items-center">
          <div>
            <h5 className="text-lg font-bold">Order ID: {order._id}</h5>
            <p className="text-sm text-gray-600">
              Placed on {formatDate(order.orderDate)}
            </p>
          </div>
          <div>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white font-bold mr-3 rounded transition duration-300"
            >
              {showDetails ? "Hide Details" : "Show Details"}
            </button>
            <Button
              isLoading={loading}
              onClick={() => onDownloadInvoiceClick(order._id)}
              className="px-4 py-2 bg-green-500 hover:bg-green-700 text-white font-bold rounded transition duration-300"
            >
              Download Invoice
            </Button>
          </div>
        </div>
        {showDetails && (
          <div className="mt-4">
            {order.items.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between border-b-2 py-2"
              >
                <div className="flex items-center">
                  <img
                    src={`${BASE_URL}/` + item.product.imgs[0]}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded mr-4"
                  />
                  <div>
                    <p className="font-bold">{item.product.name}</p>
                    <p>Quantity: {item.quantity}</p>
                    <p>Price: ${item.product.price.toFixed(2)}</p>
                  </div>
                </div>
                <p className="text-lg font-bold">
                  ${(item.quantity * item.product.price).toFixed(2)}
                </p>
              </div>
            ))}
            <div className="text-right mt-2">
              <p className="text-lg font-bold">
                Total: ${order.totalAmount.toFixed(2)}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderSummary;
