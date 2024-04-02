import React from "react";
import { NavLink } from "react-router-dom";
import { useGetAllCategories } from "../../hooks/categories/useGetAllCategories";

const CategoryFilter = () => {
  const { data, isLoading } = useGetAllCategories();
  return (
    <nav className="bg-gray-100 py-3 shadow-sm">
      <div className="container mx-auto flex overflow-x-auto px-4">
        <NavLink
          to={`/`}
          className={({ isActive }) =>
            `whitespace-nowrap px-4 py-2 font-medium text-sm transition-colors duration-200 ${
              isActive ? "text-blue-600" : "text-gray-600 hover:text-blue-500"
            }`
          }
        >
          All
        </NavLink>
        {data?.map((category, index) => (
          <NavLink
            key={index}
            to={`/category/${category}`}
            className={({ isActive }) =>
              `whitespace-nowrap px-4 py-2 font-medium text-sm transition-colors duration-200 ${
                isActive ? "text-blue-600" : "text-gray-600 hover:text-blue-500"
              }`
            }
          >
            {category}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default CategoryFilter;
