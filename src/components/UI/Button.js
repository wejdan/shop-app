import React from "react";

const Button = ({
  variant,
  className,
  children,
  isLoading,
  isDisabled,
  ...props
}) => {
  const baseStyle =
    "py-2 px-4 font-bold rounded focus:outline-none transition duration-300 ease-in-out text-sm";

  let typeStyle;

  // Determine styles based on variant and state
  switch (variant) {
    case "solid":
      typeStyle =
        isLoading || isDisabled
          ? "bg-slate-900 text-gray-300 dark:bg-white dark:text-gray-400 border border-transparent shadow"
          : "bg-black text-white  dark:bg-white dark:text-gray-800 border border-transparent  dark:hover:bg-gray-200 shadow";
      break;
    case "outline":
      typeStyle =
        isLoading || isDisabled
          ? "text-gray-400 border border-gray-400"
          : "text-slate-900 dark:text-gray-200 border border-slate-600 dark:border-gray-400 hover:border-slate-500 dark:hover:border-white dark:hover:text-white";
      break;
    case "link":
      typeStyle =
        isLoading || isDisabled
          ? "text-gray-400 cursor-not-allowed"
          : "text-gray-900 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-300 ";
      break;
    default:
      typeStyle =
        isLoading || isDisabled
          ? "bg-gray-800 text-gray-400"
          : "bg-gray-800 text-white hover:bg-gray-700"; // Default to 'solid' if no variant is provided
  }

  // Additional styles for loading or disabled state
  const additionalStyle =
    isLoading || isDisabled ? "opacity-50 cursor-not-allowed " : "";

  return (
    <button
      {...props}
      className={`${baseStyle} ${typeStyle} ${additionalStyle} ${className}`}
      disabled={isDisabled || isLoading}
    >
      <span className="flex items-center justify-center">
        {children}
        {isLoading && <div className="spinner ml-2"></div>}
      </span>
    </button>
  );
};

export default Button;
