import React from "react";

const Input = React.forwardRef(
  ({ label, icon, className, inputStyles, error, ...props }, ref) => {
    const inputClassName = `text-gray-900 bg-white dark:bg-gray-800 dark:text-white  border ${
      error ? "border-red-500" : "border-gray-400 dark:border-gray-600"
    } rounded py-2 px-3 w-full leading-tight focus:outline-none  dark:focus:bg-gray-700 dark:focus:border-gray-500 ${
      icon ? "pl-10" : "pl-3"
    }  `;

    return (
      <div className={className}>
        {label && (
          <label className="block text-sm font-bold mb-2 text-gray-400">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            {...props}
            className={`${inputClassName} ${inputStyles}`}
          />
          {/* Reserve space for error message */}
        </div>
        {error && <p className="mt-1 text-xs text-red-500 ">{error}</p>}
      </div>
    );
  }
);

// Custom TextArea component
// Custom TextArea component
const TextArea = React.forwardRef(
  ({ label, icon, className, error, ...props }, ref) => {
    const textareaClassName = `bg-white dark:bg-gray-800 text-gray-900 dark:text-white border ${
      error ? "border-red-500" : "border-gray-400 dark:border-gray-600"
    } rounded py-2 px-3 w-full leading-tight focus:outline-none dark:focus:bg-gray-700 dark:focus:border-gray-500 ${
      icon ? "pl-10" : "pl-3"
    } `;

    return (
      <div className={className}>
        {label && (
          <label className="block text-sm font-bold mb-2 text-gray-900 dark:text-gray-400">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
              {icon}
            </span>
          )}
          <textarea ref={ref} {...props} className={textareaClassName} />
        </div>
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);

// Custom Select component
const Select = React.forwardRef(
  ({ label, icon, className, options, error, ...props }, ref) => {
    const selectClassName = `bg-white  dark:bg-gray-800 text-gray-900 dark:text-white border ${
      error ? "border-red-500" : "border-gray-400 dark:border-gray-600"
    } rounded py-2 px-3 w-full leading-tight focus:outline-none dark:focus:bg-gray-700 dark:focus:border-gray-500 ${
      icon ? "pl-10" : "pl-3"
    } `;

    return (
      <div className={className}>
        {label && (
          <label className="block text-sm font-bold mb-2 text-gray-900 dark:text-gray-400">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
              {icon}
            </span>
          )}
          <select ref={ref} {...props} className={selectClassName}>
            {options.map((option, index) => (
              <option key={index} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        {error && <p className=" text-xs text-red-500">{error || ""}</p>}
      </div>
    );
  }
);

export { Input, TextArea, Select };
