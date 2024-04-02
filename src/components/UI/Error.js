import React from "react";
import { NavLink } from "react-router-dom";

function Error({ msg }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-6 bg-gray-100 dark:bg-gray-900 dark:text-white  ">
      <span className="text-6xl">❌</span>
      <h1 className="text-4xl font-bold my-6">Oops!</h1>
      <p className="text-xl mb-2">{msg}</p>
      <NavLink to="/" className="mt-6 text-indigo-600 hover:underline">
        Go back home
      </NavLink>
    </div>
  );
}

export default Error;
