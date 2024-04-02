// MyOrdersPage.jsx
import React, { useState } from "react";
import { useGetUserOrders } from "../../hooks/orders/useGetUserOrders";
import OrderCard from "../../components/orders/OrderCard";
import Pagination from "../../components/UI/Pagination";
import OrderSummary from "../../components/orders/OrderSummary";

function MyOrdersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Set the number of items per page

  // Pass currentPage and itemsPerPage to your fetching hook
  const { data, isLoading } = useGetUserOrders(currentPage, itemsPerPage);
  const orders = data?.orders;
  const totalPages = data?.totalPages;

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
  if (isLoading) {
    return <div>Loading ...</div>;
  }
  return (
    <div className="container mx-auto p-4">
      <div className="text-3xl font-semibold mb-4">My Orders</div>
      {orders?.length === 0 ? (
        <div>No orders found.</div>
      ) : (
        orders?.map((order) => <OrderSummary key={order._id} order={order} />)
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default MyOrdersPage;
