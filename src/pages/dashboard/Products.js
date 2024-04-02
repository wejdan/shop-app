import { faCopy, faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import Button from "../../components/UI/Button";
import { Input } from "../../components/UI/Input";
import Modal from "../../components/UI/Modal";
import ProductItem from "../../components/dashboard/ProductItem";
import { useDeleteProduct } from "../../hooks/products/useDeleteProduct";
import EditProductForm from "../../components/dashboard/EditProductForm";
import { useEditProduct } from "../../hooks/products/useEditProduct";
import { useGetProducts } from "../../hooks/products/useGetProducts";

const ConfirmDeleteContent = ({
  handleDirectClose,
  modalData,
  deleteProductMutate,
}) => {
  return (
    <div className="">
      <h2 className="dark:text-white text-black text-lg font-semibold mb-4">
        Delete Confirmation
      </h2>
      <p className="text-gray-400 mb-6">
        Are you sure you want to delete this product?
      </p>
      <div className="flex justify-end space-x-4">
        <Button
          isLoading={deleteProductMutate.isPending}
          variant={"soild"}
          onClick={() => {
            // Perform the delete operation here
            deleteProductMutate.mutate(modalData.productId);
          }}
        >
          Confirm
        </Button>
        <Button variant={"link"} onClick={handleDirectClose}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

const Products = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { data: productsData, isLoading } = useGetProducts(
    searchQuery,
    currentPage
  );
  const deleteProductMutate = useDeleteProduct();
  const editProductMutate = useEditProduct();
  console.log(productsData);
  const totalPages = productsData?.totalPages || 0;
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1); // Reset to the first page with new search results
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  // Assuming your API returns an object with actors and maybe total pages, etc.
  const products = productsData?.products || [];

  return (
    <>
      <div className="flex flex-col h-full">
        <Input
          className="self-end m-4"
          placeholder="Search Movies..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <div className="flex-1 overflow-auto">
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <ul className="space-y-4">
              {products.map((product, index) => (
                <ProductItem key={product.id} product={product} />
              ))}
            </ul>
          )}
        </div>
        <div className="self-end mt-auto flex">
          <Button
            variant={"link"}
            onClick={handlePrevPage}
            isDisabled={currentPage <= 1}
          >
            Prev
          </Button>
          <Button
            variant={"link"}
            onClick={handleNextPage}
            isDisabled={currentPage >= totalPages}
          >
            Next
          </Button>
        </div>
      </div>
      <Modal.Window
        name={"confirm-delete"}
        isPending={deleteProductMutate.isPending}
        isSmall={true}
      >
        <ConfirmDeleteContent deleteProductMutate={deleteProductMutate} />
      </Modal.Window>

      <Modal.Window
        name={"edit-product"}
        isPending={editProductMutate.isPending}
        isSmall={true}
      >
        <EditProductForm editProductMutate={editProductMutate} />
      </Modal.Window>
    </>
  );
};

export default Products;
