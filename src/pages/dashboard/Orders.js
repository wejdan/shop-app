import React, { useState } from "react";
import { useGetAllOrders } from "../../hooks/orders/useGetAllOrders";
import Pagination from "../../components/UI/Pagination";

function Orders() {
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10; // Number of items per page

  const { data, isLoading } = useGetAllOrders(currentPage, limit);
  const orders = data?.orders;
  const totalPages = data?.totalPages;

  if (isLoading) {
    return <div className="text-center">Loading...</div>;
  }

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4 text-black">All Orders</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white text-black">
          <thead>
            <tr>
              <th className="border px-4 py-2">Order ID</th>
              <th className="border px-4 py-2">Customer</th>
              <th className="border px-4 py-2">Date</th>
              <th className="border px-4 py-2">Total</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td className="border px-4 py-2">{order._id}</td>
                <td className="border px-4 py-2">{order.user.email}</td>
                <td className="border px-4 py-2">
                  {new Date(order.orderDate).toLocaleDateString()}
                </td>
                <td className="border px-4 py-2">${order.totalAmount}</td>
                <td className="border px-4 py-2">{order.status}</td>
                <td className="border px-4 py-2">
                  {/* Replace # with a route to the order details */}
                  <a href="#" className="text-blue-600 hover:text-blue-800">
                    View
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}

export default Orders;
