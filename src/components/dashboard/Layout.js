import React from "react";
import Navbar from "./Navbar"; // Import your Navbar component
import Sidebar from "./Sidebar"; // Import your Sidebar component
import { Outlet } from "react-router-dom";

const Layout = ({ children }) => {
  return (
    <div className="bg-gray-100 dark:bg-gray-900 dark:text-white flex  min-h-screen">
      <Sidebar /> {/* Sidebar on the left */}
      <div className="flex-1 flex flex-col">
        <Navbar /> {/* Navbar at the top */}
        <main className="flex-1 max-w-5xl p-4 text-white overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
