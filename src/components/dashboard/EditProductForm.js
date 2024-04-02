import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Button from "../UI/Button";
import FormInput from "../UI/FormInput";
import ImagePicker from "../UI/ImagePicker";
import { Input, TextArea } from "../UI/Input";
import { FaPlus, FaTimes } from "react-icons/fa";
import Modal, { useModalWindow } from "../UI/Modal";
import { useSelector } from "react-redux";
import { useGetAllCategories } from "../../hooks/categories/useGetAllCategories";
import Autocomplete from "../UI/AutoSuggust";
const BASE_URL = `${process.env.REACT_APP_BASE_URL}`;

function EditProductForm({ modalData, editProductMutate }) {
  const product = modalData.product;
  const [imgError, setImgErr] = useState(null);
  const [existingImages, setExistingImages] = useState(product.imgs);
  const [newImages, setNewImages] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);
  // const { data: categoriesData } = useGetAllCategories();
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

  const [imagePreviews, setImagePreviews] = useState(
    product.imgs.map((img) => `${BASE_URL}/` + img)
  );

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    getValues,
    setError,
    clearErrors,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {
      name: product.name,
      price: product.price,
      description: product.description,
      category: { value: product.category, label: product.category },
      quantity: product.quantity,
      imgs: product.imgs,
    },
  });

  // State to control the "enable" state of your button or form
  const [isDisabled, setIsDisabled] = useState(true);
  const watchedForm = watch();
  useEffect(() => {
    // Check if there are any changes in the form fields, new images added, or images removed
    const hasChanges = () => {
      // Check if there are new or removed images
      const hasImageChanges = newImages.length > 0 || removedImages.length > 0;

      // Return true if the form is dirty (any field has changed) or there are image changes
      return isDirty || hasImageChanges;
    };

    // Set the disabled state based on whether there are changes
    setIsDisabled(!hasChanges());
  }, [newImages, removedImages, isDirty]);
  const validateImages = (images) => {
    // Check for the total number of images

    // Check for duplicates based on file names and sizes
    const uniqueFiles = new Set(images.map((file) => file.name + file.size));
    console.log("uniqueFiles", uniqueFiles);
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
    if (existingImages.length + newImages.length === 0) {
      setImgErr(
        "Please upload at least one image to proceed. Images help to visually represent your product and increase engagement."
      );
      return;
    }

    productData.id = product._id;
    productData.newImgs = newImages.map((newImg) => newImg.file);
    productData.retainedImgs = existingImages;

    productData.removedImgs = removedImages;
    delete productData.imgs;
    console.log(productData);
    editProductMutate.mutate(productData);
  };
  const onRemoveImage = (imagePreview) => {
    // Check if the image to remove is a new image based on its blob URL
    if (imagePreview.startsWith("blob:")) {
      // Remove the image from newImages if its blobUrl matches imagePreview
      setNewImages((current) =>
        current.filter((image) => image.blobUrl !== imagePreview)
      );
      // Don't forget to revoke the blob URL to free up memory
      URL.revokeObjectURL(imagePreview);
    } else {
      // Handle removing existing images...
      setExistingImages((current) =>
        current.filter((img) => `${BASE_URL}/` + img !== imagePreview)
      );
      setRemovedImages((current) => [
        ...current,
        imagePreview.replace(`${BASE_URL}/`, ""),
      ]);
    }

    // Update imagePreviews in both cases
    setImagePreviews((currentPreviews) =>
      currentPreviews.filter((preview) => preview !== imagePreview)
    );
  };

  const handleImageChange = (e) => {
    // Get the current value of 'imgs' from the form

    const newFiles = Array.from(e.target.files);
    const totalFiles = [...newImages, ...newFiles];

    // Check if the total number of images exceeds 5
    if (totalFiles.length + existingImages.length > 5) {
      setImgErr("You can only select up to 5 images.");
      return false;
    } else if (totalFiles.length + existingImages.length <= 5) {
      // If the total number of images is 5 or less, clear the error
      setImgErr(null);
    }
    const isValid = validateImages(totalFiles);
    if (isValid) {
      // Proceed to set the value and update image previews
      const fileObjects = totalFiles.map((file) => ({
        file,
        blobUrl: URL.createObjectURL(file), // Create and store the blob URL
      }));

      setNewImages((prevImages) => [...prevImages, ...fileObjects]);

      // Update imagePreviews to include new blob URLs
      setImagePreviews((prevPreviews) => [
        ...prevPreviews,
        ...fileObjects.map((obj) => obj.blobUrl),
      ]);

      // Update image previews
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
        isDisabled={isDisabled || !watchedForm.category}
        isLoading={editProductMutate.isPending}
        variant="solid"
        className="mx-auto mt-4"
        type="submit"
      >
        Edit Product
      </Button>
    </form>
  );
}

export default EditProductForm;
