import React from "react";
import { BASE_URL } from "../../utils/constants";
import { useGetProductDetails } from "../../hooks/products/useGetProductDetails";
import { useDispatch } from "react-redux";
import { removeItem, updateItemQuantity } from "../../store/cartSlice";
import { FaTrash } from "react-icons/fa";
import { removeItemFromCart } from "../../services/cart";

const LocalItem = ({ item }) => {
  const { data, isLoading } = useGetProductDetails(item.productId);
  const dispatch = useDispatch();
  const itemData = data && { ...data };
  const onDelete = (itemId) => {
    dispatch(removeItem(itemId));
  };
  const onUpdateQuantity = (updateItem) => {
    dispatch(updateItemQuantity(updateItem));
  };
  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="flex justify-between items-center p-4 bg-white shadow-md rounded-lg mb-4">
      <div className="flex items-center flex-grow">
        <img
          src={`${BASE_URL}/` + itemData.imgs[0]}
          alt={itemData.name}
          className="w-20 h-20 object-cover mr-4 rounded"
        />
        <div className="">
          <h3 className="text-lg font-semibold">{itemData.name}</h3>
          <p className="text-sm text-gray-600">Price: ${itemData.price}</p>
        </div>
      </div>
      <div className="flex items-center">
        <button
          onClick={() =>
            onUpdateQuantity({ productId: itemData.id, quantity: -1 })
          }
          className="bg-gray-200 p-2 rounded text-gray-700 mr-2"
        >
          -
        </button>
        <div className="text-xs w-2 flex items-center justify-center">
          {item.quantity}
        </div>
        <button
          onClick={() =>
            onUpdateQuantity({ productId: itemData.id, quantity: 1 })
          }
          className="bg-gray-200 p-2 rounded text-gray-700 ml-2"
        >
          +
        </button>
      </div>
      <button
        onClick={() => onDelete(itemData.id)}
        className=" ml-5 text-red-500 hover:text-red-700 transition duration-300"
      >
        <FaTrash size={20} /> {/* Replace the text with the FaTrash icon */}
      </button>
    </div>
  );
};

export default LocalItem;
