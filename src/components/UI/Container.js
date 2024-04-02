import React from "react";

const Container = ({ children }) => {
  return (
    <div className="flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-sm text-white dark:text-gray-800">
        {children}
      </div>
    </div>
  );
};

export default Container;
