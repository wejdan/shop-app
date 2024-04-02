import React from "react";
import { BASE_URL } from "../../utils/constants";
import { useGetProductDetails } from "../../hooks/products/useGetProductDetails";
import { useUpdateCart } from "../../hooks/cart/useUpdateCart";
import { useDeleteFromCart } from "../../hooks/cart/useDeleteFromCart";
import { FaTrash } from "react-icons/fa"; // Import the FaTrash icon
import Loader from "../UI/Loader";
const CartItem = ({ item }) => {
  const updateMutation = useUpdateCart();
  const deleteMutaion = useDeleteFromCart();
  const onDelete = () => {
    deleteMutaion.mutate(item._id);
  };
  const onUpdateQuantity = (updateItem) => {
    updateMutation.mutate(updateItem);
  };
  if (deleteMutaion.isPending) {
    return <Loader blur={true} />;
  }
  return (
    <div className="flex justify-between items-center p-4 bg-white shadow-md rounded-lg mb-4">
      <div className="flex items-center flex-grow">
        <img
          src={`${BASE_URL}/` + item.imgs[0]}
          alt={item.name}
          className="w-20 h-20 object-cover mr-4 rounded"
        />
        <div className="">
          <h3 className="text-lg font-semibold">{item.name}</h3>
          <p className="text-sm text-gray-600">Price: ${item.price}</p>
        </div>
      </div>
      <div className="flex items-center">
        <button
          onClick={() =>
            onUpdateQuantity({ productId: item._id, quantity: -1 })
          }
          className="bg-gray-200 p-2 rounded text-gray-700 mr-2"
        >
          -
        </button>
        <div className="text-xs w-2 flex items-center justify-center">
          {item.quantity}
        </div>
        <button
          onClick={() => onUpdateQuantity({ productId: item._id, quantity: 1 })}
          className="bg-gray-200 p-2 rounded text-gray-700 ml-2"
        >
          +
        </button>
      </div>
      <button
        onClick={() => onDelete()}
        className=" ml-5 text-red-500 hover:text-red-700 transition duration-300"
      >
        <FaTrash size={20} /> {/* Replace the text with the FaTrash icon */}
      </button>
    </div>
  );
};

export default CartItem;
