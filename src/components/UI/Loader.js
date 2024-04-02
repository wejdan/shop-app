import React from "react";

function Loader({ blur, message, transparent }) {
  return (
    <div
      className={`z-50  ${blur ? "backdrop-blur-sm" : ""} absolute inset-0 ${
        transparent ? "" : "bg-slate-200/10 dark:bg-slate-400/0"
      } flex justify-center items-center min-h-screen`}
    >
      {message && <p>{message}</p>}
      <div class="relative">
        <div class="w-20 h-20 border-blue-400 dark:border-slate-500 border-4 rounded-full"></div>
        <div class="border-t-transparent border-solid animate-spin  rounded-full border-gray-500   border-4  absolute left-0 top-0 h-20 w-20"></div>
      </div>
    </div>
  );
}

export default Loader;
