import React from "react";
import { FaSearch, FaPlus } from "react-icons/fa"; // Import icons from react-icons
import { Input } from "../UI/Input";
import Button from "../UI/Button";
import Menu from "../UI/Menu";
import Modal from "../UI/Modal";
import AddProductForm from "./AddProductForm";
import { useDispatch, useSelector } from "react-redux";
import { FaTachometerAlt, FaMoon, FaSun } from "react-icons/fa";
import { setMode } from "../../store/appSettingsSlice";
import { useAddProduct } from "../../hooks/products/useAddProduct";

const Navbar = () => {
  const addProductMutate = useAddProduct();
  const isDarkMode = useSelector((state) => state.appSettings.isDarkMode);
  const dispatch = useDispatch();
  const toggleTheme = () => {
    dispatch(setMode(!isDarkMode));
    // Here, you would also update the global theme state or apply the theme change logic
  };
  return (
    <>
      <nav className="bg-gray-100 dark:bg-gray-900 dark:text-white max-w-5xl p-4 flex justify-between items-center">
        <div className="flex items-center">
          <Input placeholder="search ..." />
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className="hover:text-gray-600 dark:hover:text-gray-300"
          >
            {isDarkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
          </button>
          <Menu>
            <Menu.Open>
              <Button variant="outline">
                <span className="flex items-center">
                  Add
                  <FaPlus className="ml-2" />
                </span>
              </Button>
            </Menu.Open>
            <Menu.MenuItems>
              <Modal.Open opens={"add-product"}>
                <Menu.Item>
                  <span>Product</span>
                </Menu.Item>
              </Modal.Open>
            </Menu.MenuItems>
          </Menu>
        </div>
      </nav>
      <Modal.Window
        isPending={addProductMutate.isPending}
        name={"add-product"}
        isSmall={true}
      >
        <AddProductForm addProductMutate={addProductMutate} />
      </Modal.Window>
    </>
  );
};

export default Navbar;
