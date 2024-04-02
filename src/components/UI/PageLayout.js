import React, { useEffect, useRef, useState } from "react";
import Navbar from "./Navbar";
import { Outlet, useLocation } from "react-router-dom";
import { useOrder } from "../../contexts/OrderContext";

function PageLayout() {
  const navbarRef = useRef(null); // Ref for the navbar
  const [navbarHeight, setNavbarHeight] = useState(0); // State to store the navbar height
  const location = useLocation();
  const { resetOrderState } = useOrder();

  useEffect(() => {
    // Check if the current path is not '/order-success'
    if (location.pathname !== "/order-success") {
      resetOrderState();
    }
  }, [location, resetOrderState]);
  useEffect(() => {
    // Calculate and set the navbar height
    if (navbarRef.current) {
      setNavbarHeight(navbarRef.current.offsetHeight);
    }
  }, []); // Empty dependency array means this runs once on mount

  return (
    <div
      className={`flex flex-col  min-h-screen  bg-gray-100 dark:bg-gray-900 dark:text-white `}
    >
      <div ref={navbarRef}>
        <Navbar />
      </div>

      <main className="container flex flex-col  flex-grow  max-w-6xl mx-auto px-4 py-2">
        <Outlet />
      </main>
    </div>
  );
}

export default PageLayout;
