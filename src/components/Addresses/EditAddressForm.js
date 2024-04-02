import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import Button from "../UI/Button";
import FormInput from "../UI/FormInput";
import MyMap from "./Map"; // Assuming this is the correct path to your MyMap component
import Modal from "../UI/Modal";
import { FaCheck } from "react-icons/fa";
import PhoneVerificationComponent from "./PhoneVerificationComponent";

function EditAddressForm({ modalData, editAddressMutate }) {
  const address = modalData.address;

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {
      type: address.type,
      name: address.name,
      phone: address.phone,
      isDefault: address.isDefault,
      info: address.info, // Assuming 'info' stores address details like street, city, etc.
      location: address.location || { lat: 0, lng: 0 }, // Use existing location or default to { lat: 0, lng: 0 }
    },
  });

  const setLocation = (newLocation) => {
    setValue("location", newLocation, { shouldDirty: true });
  };

  const setAddressInfo = (newInfo) => {
    setValue("info", newInfo, { shouldDirty: true });
  };

  const onSubmit = (formData) => {
    console.log(formData);
    // Call the mutation function to edit the address
    editAddressMutate.mutate({ ...formData, id: address._id });
  };

  const formData = watch();
  const onPhoneVerified = (verified, phone) => {
    if (verified) {
      setValue("phone", phone); // Set the verified phone number into the form
    } else {
      setValue("phone", ""); // Reset phone number in the form if verification fails
    }
  };
  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 bg-white p-4 rounded-lg "
      >
        <div className="grid grid-cols-2 gap-4">
          <Controller
            control={control}
            name="type"
            rules={{ required: "Type is required" }}
            render={({ field }) => (
              <FormInput
                label="Type"
                placeholder="e.g., Home, Work"
                error={errors.type?.message}
                {...field}
              />
            )}
          />

          <Controller
            control={control}
            name="name"
            rules={{ required: "Name is required" }}
            render={({ field }) => (
              <FormInput
                label="Name"
                placeholder="Full Name"
                error={errors.name?.message}
                {...field}
              />
            )}
          />
          <div className="flex items-center col-span-2 justify-start space-x-2">
            <p className="flex items-center text-green-500">
              <FaCheck className="w-6 h-6" /> {formData.phone}
            </p>
            <Modal.Open opens={"add-phone"}>
              <Button type="button" variant="outline" className="px-2 py-1">
                Edit
              </Button>
            </Modal.Open>
          </div>
          <Controller
            control={control}
            name="isDefault"
            render={({ field: { onChange, onBlur, value, name, ref } }) => (
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isDefault"
                  className="form-checkbox h-5 w-5"
                  name={name}
                  ref={ref}
                  checked={value} // Explicitly setting the checked state based on field.value
                  onChange={onChange} // Using the provided onChange method from Controller
                  onBlur={onBlur} // Using the provided onBlur method from Controller
                />
                <label className="ml-2" htmlFor="isDefault">
                  Set as default address
                </label>
              </div>
            )}
          />

          {/* MyMap Component for selecting location */}
          <div className="col-span-2">
            <MyMap
              location={formData.location}
              address={formData.info}
              setLocation={setLocation}
              setAddress={setAddressInfo}
            />
          </div>

          <Controller
            control={control}
            name="isDefault"
            render={({ field: { onChange, onBlur, value, name, ref } }) => (
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isDefault"
                  className="form-checkbox h-5 w-5"
                  name={name}
                  ref={ref}
                  checked={value} // Explicitly setting the checked state based on field.value
                  onChange={onChange} // Using the provided onChange method from Controller
                  onBlur={onBlur} // Using the provided onBlur method from Controller
                />
                <label className="ml-2" htmlFor="isDefault">
                  Set as default address
                </label>
              </div>
            )}
          />
          <div className="col-span-2 flex justify-center">
            <Button
              isLoading={editAddressMutate.isPending}
              isDisabled={!isDirty}
              type="submit"
              variant="solid"
              className=" mt-4 "
            >
              Save Changes
            </Button>
          </div>
        </div>
      </form>
      <Modal.Window isSmall={true} name={"add-phone"}>
        <PhoneVerificationComponent onVerified={onPhoneVerified} />
      </Modal.Window>
    </>
  );
}

export default EditAddressForm;
