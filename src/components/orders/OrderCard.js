import React from "react";
import StatusTag from "./StatusTag";
import { BASE_URL } from "../../utils/constants";

function OrderCard({ order }) {
  const orderDate = new Date(order.orderDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="mb-6 p-4 bg-white rounded shadow">
      <StatusTag status={order.status} />
      <div className="flex items-center space-x-4">
        <img
          src={`${BASE_URL}/${order.items[0].product.imgs[0]}`}
          alt="Product"
          className="w-24 h-24 object-cover rounded"
        />
        <div>
          <div className="font-bold">
            {order.items.map((item) => item.product.name).join(", ")}
          </div>
          <div className="text-gray-600">{orderDate}</div>
        </div>
      </div>
      <div className="flex justify-between items-center mt-4">
        <div className="font-semibold">Total: ${order.totalAmount}</div>
        <button className="text-blue-600 hover:text-blue-800">Details</button>
      </div>
    </div>
  );
}

export default OrderCard;
