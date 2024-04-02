import { faCopy, faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import Modal from "../UI/Modal";
const BASE_URL = `${process.env.REACT_APP_BASE_URL}`;
function ProductItem({ product }) {
  // Join genre values into a comma-separated string
  return (
    <li
      className="rounded overflow-hidden flex items-center justify-between
                   bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-center">
        <img
          src={`${BASE_URL}/` + product.imgs[0]}
          alt={product.name}
          className="w-24 h-24 object-cover mr-4"
        />
        <div className="p-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            {product.name}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">{product.price}</p>
        </div>
      </div>
      <div className="flex pr-4 items-center">
        <FontAwesomeIcon
          icon={faCopy}
          className="text-gray-600 dark:text-gray-400 mr-2 cursor-pointer"
        />
        <Modal.Open opens={"edit-product"} data={{ product }}>
          <FontAwesomeIcon
            icon={faEdit}
            className="text-gray-600 dark:text-gray-400 mr-2 cursor-pointer"
          />
        </Modal.Open>

        <Modal.Open opens={"confirm-delete"} data={{ productId: product.id }}>
          <FontAwesomeIcon
            icon={faTrashAlt}
            className="text-gray-600 dark:text-gray-400 cursor-pointer"
          />
        </Modal.Open>
      </div>
    </li>
  );
}

export default ProductItem;
