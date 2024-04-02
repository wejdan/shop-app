import React, { useRef } from "react";
import { FaImage, FaPlus, FaTimes } from "react-icons/fa";

function ImagePicker({
  imagePreviews, // This should now be an array
  onImageChange,
  id,
  disabled,
  width,
  height,
  error,
  onRemoveImage,
  rounded, // New prop for rounded corners
  multiple, // Allow multiple files
}) {
  const fileInputRef = useRef(null);
  const handleImageClick = () => {
    if (!disabled) {
      fileInputRef.current.click();
    }
  };

  // Conditionally apply rounded styles
  const roundedStyle = rounded ? { borderRadius: "50%" } : {};
  return (
    <>
      <div
        style={{
          width,
          height,
          cursor: disabled ? "not-allowed" : "pointer",
          ...roundedStyle, // Apply rounded style conditionally
        }}
        className={`bg-gray-200 self-center mb-5`}
        onClick={handleImageClick}
      >
        <div className="flex justify-center items-center w-full h-full">
          <FaPlus className="text-3xl" />
        </div>
      </div>
      {imagePreviews && imagePreviews.length > 0 && (
        <div
          style={{
            display: "flex", // Display previews in a flex container
            flexWrap: "wrap", // Wrap them to next line if space is not enough
            gap: "10px", // Add some gap between previews
          }}
        >
          {imagePreviews.map((preview, index) => (
            <div key={index} style={{ position: "relative", width, height }}>
              <img
                src={preview}
                alt={`Preview ${index}`}
                style={{
                  width: "100%",
                  height: "100%",
                  ...roundedStyle, // Apply rounded style conditionally
                }}
              />
              <button
                type="button"
                onClick={() => onRemoveImage(preview)} // Call onRemoveImage with the index of the image to remove
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  background: "rgba(255, 255, 255, 0.7)", // Slightly transparent background
                  borderRadius: "50%", // Round shape
                  cursor: "pointer",
                }}
              >
                <FaTimes className="text-red-500" />
              </button>
            </div>
          ))}
        </div>
      )}
      <input
        hidden
        ref={fileInputRef}
        id={id}
        name={id}
        type="file"
        onChange={onImageChange}
        accept=".jpg,.jpeg,.png"
        multiple={multiple} // Enable multiple file selection
      />
      <p className="text-xs text-red-500">{error || ""}</p>
    </>
  );
}

export default ImagePicker;
