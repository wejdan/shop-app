import React from "react";
import { Input } from "./Input"; // Ensure Input supports forwardRef

// Updated FormInput to support forwardRef
const FormInput = React.forwardRef(({ label, ...props }, ref) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-bold mb-2 text-gray-900 dark:text-gray-400">
          {label}
        </label>
      )}
      {/* Forward the ref to the Input component */}
      <Input ref={ref} {...props} />
    </div>
  );
});

export default FormInput;
