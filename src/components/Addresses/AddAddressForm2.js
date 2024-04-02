import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import Button from "../UI/Button";
import FormInput from "../UI/FormInput";
import { Input } from "../UI/Input";
import MyMap from "./Map";
import { reverseGeocode } from "../../services/addresses";

function AddAddressForm({ addAddressMutate }) {
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [otp, setOtp] = useState("");

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      type: "",
      name: "",

      phone: "",
      isDefault: false,
      info: "",
      location: { lat: 0, lng: 0 },
    },
  });
  const setAddress = (newLocation) => {
    setValue("info", newLocation);
  };
  const setLocation = (newLocation) => {
    setValue("location", newLocation);
  };
  const onSubmit = async (data) => {
    console.log(data);
    addAddressMutate.mutate(data); // Assume addAddress is a function passed down as a prop for mutation
  };
  const formData = watch();

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 bg-white p-4 rounded-lg"
    >
      <div className="grid grid-cols-2 gap-4">
        {/* Left column */}
        {/* Type */}
        <Controller
          control={control}
          name="type"
          rules={{ required: "Address type is required" }}
          render={({ field }) => (
            <FormInput
              label="Type"
              placeholder="e.g., Home, Work"
              error={errors.type?.message}
              {...field}
            />
          )}
        />
        {/* Name */}
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
        <Controller
          control={control}
          name="phone"
          rules={{ required: "Phone number is required" }}
          render={({ field }) => (
            <FormInput
              label="Phone Number"
              placeholder="Phone Number"
              error={errors.phone?.message}
              {...field}
            />
          )}
        />
        <Controller
          control={control}
          name="isDefault"
          render={({ field }) => (
            <div className="flex items-center mt-2">
              <label className="mr-2">Set as default:</label>
              <Input type="checkbox" className="w-5 h-5" {...field} />
            </div>
          )}
        />
        <div className="col-span-2">
          <MyMap
            location={formData.location}
            address={formData.info}
            setLocation={setLocation}
            setAddress={setAddress}
          />
        </div>{" "}
        {/* Submit Button */}
        <div className="col-span-2 flex justify-center">
          <Button
            isLoading={addAddressMutate.isPending}
            type="submit"
            variant="solid"
            className="mt-4"
          >
            Add Address
          </Button>
        </div>
      </div>

      {/* Submit Button */}
    </form>
  );
}

export default AddAddressForm;
