import React from "react";
import Modal from "../../components/UI/Modal";
import AddAddressForm from "../../components/Addresses/AddAddressForm";
import { useAddAddress } from "../../hooks/addresses/useAddAddress";
import { useGetAllUserAddresses } from "../../hooks/addresses/useGetAllUserAddresses";
import EditAddressForm from "../../components/Addresses/EditAddressForm";
import { useDeleteAddress } from "../../hooks/addresses/useDeleteAddress";
import { useEditAddress } from "../../hooks/addresses/useEditAddress";
import Button from "../../components/UI/Button";
import ConfirmDeleteContent from "../../components/UI/Confirmation";
import { useSetDefault } from "../../hooks/addresses/useSetDefault";

const AddressPage = () => {
  // Handler functions
  const addAddressMutate = useAddAddress();
  const deleteAddressMutate = useDeleteAddress();
  const editAddressMutate = useEditAddress();
  const setDefaultMutate = useSetDefault();

  const { data, isLoading } = useGetAllUserAddresses();
  const addresses = data?.addresses || [];
  console.log("addresses page re-renderes", addresses);
  if (isLoading) {
    return <div>Loading ...</div>;
  }
  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Addresses</h1>
        <p className="mb-6">
          Manage your saved addresses for fast and easy checkout across our
          marketplaces
        </p>

        <Modal.Open opens={"add-address"}>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-8">
            ADD NEW ADDRESS
          </button>
        </Modal.Open>
        <div className="mb-4">
          <div className="font-semibold mb-2">Default address</div>
          {/* Map over your addresses */}
          {addresses.map((address, index) => (
            <div
              key={address.id}
              className={`bg-gray-100 p-4 rounded mb-4 ${
                address.isDefault ? "border-2 border-blue-500" : ""
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-bold">{address.type}</div>
                  <div>Name: {address.name}</div>
                  <div>Address: {address.info}</div>
                  <div>Phone: {address.phone}</div>
                </div>
                <div className="flex space-x-2">
                  <Modal.Open data={{ address }} opens={"edit-address"}>
                    <button className="text-sm bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-2 rounded">
                      Edit
                    </button>
                  </Modal.Open>
                  <Modal.Open
                    data={{ id: address._id }}
                    opens={"delete-address"}
                  >
                    <button className="text-sm bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded">
                      Delete
                    </button>
                  </Modal.Open>
                  {!address.isDefault && (
                    <button
                      isLoading={setDefaultMutate.isPending}
                      onClick={() => setDefaultMutate.mutate(address._id)}
                      className="text-sm bg-green-500 hover:bg-green-600 text-white py-1 px-2 rounded"
                    >
                      Set as default
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Modal.Window
        isSmall={true}
        isPending={addAddressMutate.isPending}
        name={"add-address"}
      >
        <AddAddressForm addAddressMutate={addAddressMutate} />
      </Modal.Window>
      <Modal.Window
        name={"delete-address"}
        isPending={deleteAddressMutate.isPending}
        isSmall={true}
      >
        <ConfirmDeleteContent
          message={"Are you sure you want to delete this address"}
          deleteMutate={deleteAddressMutate}
        />
      </Modal.Window>

      <Modal.Window
        name={"edit-address"}
        isPending={editAddressMutate.isPending}
        isSmall={true}
      >
        <EditAddressForm editAddressMutate={editAddressMutate} />
      </Modal.Window>
    </>
  );
};

export default AddressPage;
