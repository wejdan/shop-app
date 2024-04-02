import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Button from "../UI/Button";
import FormInput from "../UI/FormInput";
import ImagePicker from "../UI/ImagePicker";
import { Input, TextArea } from "../UI/Input";
import { FaPlus, FaTimes } from "react-icons/fa";
import Modal, { useModalWindow } from "../UI/Modal";
import { useSelector } from "react-redux";
import Autocomplete from "../UI/AutoSuggust";
import { useGetAllCategories } from "../../hooks/categories/useGetAllCategories";

function AddProductForm({ addProductMutate }) {
  const [imagePreviews, setImagePreviews] = useState([]);
  const [imgError, setImgErr] = useState(null);
  const { data: options, isLoading } = useGetAllCategories();
  const categoryOpts = options?.map((category) => {
    return { value: category, label: category };
  });
  // const { data: categoriesData } = useGetAllCategories();
  const handleCreateCategory = (inputValue) => {
    console.log("New category created:", inputValue);
    // Here you set the new value to the category field in your form
    setValue("category", { value: inputValue, label: inputValue });
    // Optionally, you might want to update your category options state here if needed
  };

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    getValues,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      price: "",
      description: "",
      category: "",
      quantity: "",
      imgs: [],
    },
  });
  const watchedForm = watch();

  const validateImages = (images) => {
    // Check for the total number of images
    if (images.length > 5) {
      setImgErr("You can only select up to 5 images.");
      return false;
    } else if (images.length <= 5) {
      // If the total number of images is 5 or less, clear the error
      setImgErr(null);
    }

    // Check for duplicates based on file names and sizes
    const uniqueFiles = new Set(images.map((file) => file.name + file.size));
    if (uniqueFiles.size < images.length) {
      setImgErr("Duplicate images are not allowed.");
      return false;
    } else if (uniqueFiles.size === images.length) {
      // If there are no duplicates, clear the error
      setImgErr(null);
    }
    return true;
  };

  const onSubmit = (formData) => {
    const productData = {
      ...formData,
      category: formData.category.value,
    };
    if (formData.imgs.length === 0) {
      setImgErr(
        "Please upload at least one image to proceed. Images help to visually represent your product and increase engagement."
      );
      return;
    }
    console.log(productData);
    addProductMutate.mutate(productData);
  };
  const onRemoveImage = (imgBlob) => {
    const indexToRemove = imagePreviews.indexOf(imgBlob);
    let imgsValue = getValues("imgs");
    if (!Array.isArray(imgsValue)) {
      imgsValue = [];
    }
    imgsValue = imgsValue.filter((_, index) => index !== indexToRemove);
    validateImages(imgsValue);
    setImagePreviews((currentPreviews) =>
      currentPreviews.filter((blob, index) => blob !== imgBlob)
    );
    console.log("imgsValue", imgsValue);
    console.log("imagePreviews", imagePreviews, imgBlob);

    // If you're tracking the File objects in a state (e.g., `images`), you should remove the corresponding file as well
    setValue("imgs", imgsValue);
  };
  const handleImageChange = (e) => {
    // Get the current value of 'imgs' from the form
    let imgsValue = getValues("imgs");
    if (!Array.isArray(imgsValue)) {
      imgsValue = [];
    }
    const newFiles = Array.from(e.target.files);
    const totalFiles = [...imgsValue, ...newFiles];

    // Check if the total number of images exceeds 5
    const isValid = validateImages(totalFiles);
    if (isValid) {
      // Proceed to set the value and update image previews
      setValue("imgs", totalFiles);

      // Update image previews
      const newImagePreviews = newFiles.map((file) =>
        URL.createObjectURL(file)
      );
      setImagePreviews((prevPreviews) => [
        ...prevPreviews,
        ...newImagePreviews,
      ]);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="overflow-y-auto max-h-96 flex flex-col text-white"
      style={{ width: "800px" }}
    >
      <div className="grid grid-cols-2 gap-6">
        <div>
          <Controller
            control={control}
            name="name"
            rules={{ required: "Name is required" }}
            render={({ field }) => (
              <FormInput
                label="Name"
                placeholder="Product Name"
                error={errors.name?.message}
                {...field}
              />
            )}
          />

          <Controller
            control={control}
            name="description"
            rules={{ required: "Description is required" }}
            render={({ field }) => (
              <TextArea
                className="mb-4"
                label="Description"
                placeholder="Product Description"
                error={errors.description?.message}
                {...field}
              />
            )}
          />

          {/* <Controller
            control={control}
            name="category"
            rules={{ required: "Category is required" }}
            render={({ field }) => (
              <FormInput
                label="category"
                placeholder="category"
                error={errors.category?.message}
                {...field}
              />
            )}
          /> */}

          <Controller
            control={control}
            name="category"
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <Autocomplete
                options={categoryOpts}
                className="mb-4"
                label="category"
                error={errors.category?.message}
                placeholder="Search categories"
                onChange={(selectedOption) => onChange(selectedOption)} // Pass the selected option back to react-hook-form's onChange
                onBlur={onBlur} // Inform react-hook-form when the field is touched
                value={value} // Pass the current value from react-hook-form to Autocomplete
                ref={ref} // Pass the ref for react-hook-form to register the input
                onCreateOption={handleCreateCategory}
              />
            )}
          />

          <Controller
            control={control}
            name="price"
            rules={{ required: "Price is required" }}
            render={({ field }) => (
              <FormInput
                label="Price"
                type="number"
                placeholder="Product Price"
                error={errors.price?.message}
                {...field}
              />
            )}
          />

          <Controller
            control={control}
            name="quantity"
            rules={{ required: "Quantity is required" }}
            render={({ field }) => (
              <FormInput
                label="Quantity"
                type="number"
                placeholder="Available Quantity"
                error={errors.quantity?.message}
                {...field}
              />
            )}
          />
        </div>

        <div>
          <div className="flex w-full flex-col mb-4">
            <ImagePicker
              id="imgs"
              imagePreviews={imagePreviews}
              error={imgError}
              onImageChange={handleImageChange}
              onRemoveImage={onRemoveImage}
              multiple={true}
              width="80px"
              height="80px"
            />
          </div>
        </div>
      </div>

      <Button
        isDisabled={!watchedForm.category}
        isLoading={addProductMutate.isPending}
        variant="solid"
        className="mx-auto mt-4"
        type="submit"
      >
        Create Product
      </Button>
    </form>
  );
}

export default AddProductForm;
