import React, { createContext, useContext, useState } from "react";

const OrderContext = createContext();

export const useOrder = () => useContext(OrderContext);

export const OrderProvider = ({ children }) => {
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const markOrderAsPlaced = (id) => {
    setOrderPlaced(true);
    setOrderId(id);
  };

  const resetOrderState = () => {
    setOrderPlaced(false);
    setOrderId(null);
  };

  return (
    <OrderContext.Provider
      value={{ orderPlaced, orderId, markOrderAsPlaced, resetOrderState }}
    >
      {children}
    </OrderContext.Provider>
  );
};
