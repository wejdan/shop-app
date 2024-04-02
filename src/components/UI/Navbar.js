import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FaTachometerAlt,
  FaMoon,
  FaSun,
  FaUser,
  FaShoppingCart,
  FaSignOutAlt,
  FaHome,
  FaCreditCard,
  FaRegListAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";
import CategoryFilter from "../product/CategoryFilter";
import { useGetTotalCartItems } from "../../hooks/cart/useGetTotalCartItems";
import { useOrder } from "../../contexts/OrderContext";
import { Input } from "./Input";
import Menu from "./Menu";
import { setMode } from "../../store/appSettingsSlice";
import { useAuth } from "../../hooks/auth/useAuth";
import { useUserData } from "../../hooks/auth/useUserData";
import { useIsAdmin } from "../../hooks/auth/useIsAdmin";

// Custom hook for theme toggle to simplify Navbar component
function useThemeToggle() {
  const dispatch = useDispatch();
  const isDarkMode = useSelector((state) => state.appSettings.isDarkMode);
  const toggleTheme = () => dispatch(setMode(!isDarkMode));
  return { toggleTheme, isDarkMode };
}

const Navbar = () => {
  const { userData } = useUserData(); // Use useUserData for user data
  const isAdmin = userData && userData.role === "admin";
  const count = useGetTotalCartItems();

  const { toggleTheme, isDarkMode } = useThemeToggle();
  return (
    <>
      <nav className={`bg-white dark:bg-gray-800 dark:text-white px-4`}>
        <div className="container max-w-6xl mx-auto flex justify-between items-center">
          <NavLink to="/" className="hover:text-gray-300">
            <img
              src={isDarkMode ? "/logo193.png" : "/logo192.png"}
              alt="Company Logo"
              className="h-16"
            />
          </NavLink>
          <div className="flex items-center space-x-4">
            <ThemeToggleButton
              toggleTheme={toggleTheme}
              isDarkMode={isDarkMode}
            />
            <Input placeholder="Search..." />
            {userData ? (
              <>
                <Menu>
                  <Menu.Open>
                    <span className="hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer">
                      Hi {userData.name}
                    </span>
                  </Menu.Open>
                  <UserMenu isAdmin={isAdmin} count={count} />
                </Menu>
                {!isAdmin && <CartIcon count={count} />}
              </>
            ) : (
              <GuestLinks count={count} />
            )}
          </div>
          <div className="md:hidden">Menu</div>
        </div>
      </nav>
      <CategoryFilter />
    </>
  );
};

function ThemeToggleButton({ toggleTheme, isDarkMode }) {
  return (
    <button
      onClick={toggleTheme}
      className="hover:text-gray-600 dark:hover:text-gray-300"
    >
      {isDarkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
    </button>
  );
}

function GuestLinks({ count }) {
  return (
    <>
      <NavLink
        to="/login"
        className="hover:text-gray-600 dark:hover:text-gray-300"
      >
        Login
      </NavLink>
      <CartIcon count={count} />
    </>
  );
}

function UserMenu({ isAdmin }) {
  const { logout } = useAuth(); // Use useAuth for auth state and logout functionality

  const { resetOrderState } = useOrder();
  const navigate = useNavigate();

  const handleLogout = () => {
    //  dispatch(logout());
    console.log("handleLogout");
    logout();
    resetOrderState();
    navigate("/");
  };

  return (
    <Menu.MenuItems>
      {isAdmin && (
        <Menu.Item onClick={() => navigate("/dashboard")}>
          <div className="hover:text-gray-600 dark:hover:text-gray-300 flex items-center">
            <FaTachometerAlt className="mr-2" />
            Dashboard
          </div>
        </Menu.Item>
      )}
      <Menu.Item onClick={() => navigate("/profile")}>
        <div className="hover:text-gray-600 dark:hover:text-gray-300 flex items-center">
          <FaUser className="mr-2" />
          Profile
        </div>
      </Menu.Item>
      {!isAdmin && (
        <>
          <Menu.Item onClick={() => navigate("/orders")}>
            <div className="hover:text-gray-600 dark:hover:text-gray-300 flex items-center">
              <FaRegListAlt className="mr-2" />
              Orders
            </div>
          </Menu.Item>
          <Menu.Item onClick={() => navigate("/addresses")}>
            <div className="hover:text-gray-600 dark:hover:text-gray-300 flex items-center">
              <FaMapMarkerAlt className="mr-2" />
              Addresses
            </div>
          </Menu.Item>
          <Menu.Item onClick={() => navigate("/payments")}>
            <div className="hover:text-gray-600 dark:hover:text-gray-300 flex items-center">
              <FaCreditCard className="mr-2" />
              Payments
            </div>
          </Menu.Item>
        </>
      )}
      <Menu.Item onClick={handleLogout}>
        <div className="hover:text-gray-600 dark:hover:text-gray-300 w-full flex items-center">
          <FaSignOutAlt className="mr-2" />
          Logout
        </div>
      </Menu.Item>
    </Menu.MenuItems>
  );
}

function CartIcon({ count }) {
  return (
    <NavLink
      to="/cart"
      className="relative hover:text-gray-600 dark:hover:text-gray-300"
    >
      <FaShoppingCart className="mr-2" />
      {count > 0 && (
        <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
          {count}
        </span>
      )}
    </NavLink>
  );
}

export default Navbar;
