import React from "react";
import { NavLink } from "react-router-dom";
import { FaHome, FaFilm, FaUser, FaSignOutAlt } from "react-icons/fa"; // Import the logout icon
import { useDispatch, useSelector } from "react-redux"; // If you're using Redux for state management
import { logout } from "../../store/authSlice"; // Adjust the import path as necessary

const Sidebar = () => {
  const dispatch = useDispatch(); // If using Redux
  const { userData } = useSelector((state) => state.auth);
  // Function to determine the class name based on isActive
  const isDarkMode = useSelector((state) => state.appSettings.isDarkMode);

  const getNavLinkClass = (isActive) =>
    isActive
      ? "flex items-center p-2 text-base font-normal text-black dark:text-white rounded-lg bg-gray-300 dark:bg-gray-700"
      : "flex items-center p-2 text-base font-normal   text-black dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700";

  // Logout function, adjust as necessary for your application's logic
  const handleLogout = () => {
    // Example logout action, adjust according to your app's logic
    dispatch(logout());
    // Redirect to home/login page or perform additional cleanup if needed
  };

  return (
    <aside className="w-64 flex flex-col flex-shrink-0" aria-label="Sidebar">
      <div
        className="flex flex-col overflow-y-auto py-4 px-3 bg-white dark:bg-gray-800 flex-grow"
        style={{ minHeight: "100vh" }}
      >
        {" "}
        {/* Navigation links */}
        <div className="flex-1">
          {" "}
          <div className="flex items-center justify-center mb-6">
            <NavLink to="/">
              {isDarkMode ? (
                <img src="/logo193.png" alt="Company Logo" className="h-32" />
              ) : (
                <img src="/logo192.png" alt="Company Logo" className="h-32" />
              )}
            </NavLink>
          </div>
          <ul className="space-y-2">
            {/* Existing navigation items */}
            <li>
              <NavLink
                to="/dashboard"
                className={({ isActive }) => getNavLinkClass(isActive)}
              >
                <FaHome className="mr-3" /> Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/products"
                className={({ isActive }) => getNavLinkClass(isActive)}
              >
                <FaFilm className="mr-3" /> Products
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/orders"
                className={({ isActive }) => getNavLinkClass(isActive)}
              >
                <FaUser className="mr-3" /> Orders
              </NavLink>
            </li>
          </ul>
        </div>
        {/* Logout button */}
        <div className="mt-auto">
          <button
            onClick={handleLogout}
            className="flex items-center justify-start space-x-1 p-2 text-sm font-normal text-white rounded-lg hover:bg-gray-700 w-full"
          >
            <FaSignOutAlt className="text-center" />
            <span className="text-center">Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
