import React, { useState } from "react";
import { NavLink } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { authenticate, setUserData } from "../../store/authSlice";
import FormInput from "../../components/UI/FormInput";
import Button from "../../components/UI/Button";
import Container from "../../components/UI/Container";
import { syncCart } from "../../store/cartSlice";
import { useLogin } from "../../hooks/auth/useLogin";
import { useAuth } from "../../hooks/auth/useAuth";

function LoginPage() {
  const { login, isLoginLoading, isLoginError, loginError } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const isDisabled =
    isLoginLoading ||
    Object.values(formData).some((value) => value.trim() === "");

  const onChange = (e) => {
    const { name, value } = e.target;
    // If the input field is 'email', convert its value to lowercase
    const updatedValue = name === "email" ? value.toLowerCase() : value;
    setFormData((prevState) => ({
      ...prevState,
      [name]: updatedValue,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    toast.dismiss(); // Dismiss any existing toasts before showing a new one
    try {
      const result = await login(formData);
      console.log("onSubmit", result);

      // Redirect or show success message
    } catch (error) {
      toast.error(error.message); // Simplified toast error call
    }
  };

  return (
    <div className=" flex flex-grow flex-col justify-start mx-auto   w-full max-w-md px-6">
      <div className="mx-5 mt-32 flex justify-start items-end space-x-4 mb-4 border-b-2 border-b-gray-300">
        <NavLink to="/login" className="text-3xl text-black font-bold   pb-2">
          Login
        </NavLink>
        <NavLink
          to="/signup"
          className="text-lg text-gray-500  font-bold  border-b-2 border-transparent pb-2 "
        >
          Sign Up
        </NavLink>
      </div>
      <Container>
        <form>
          <FormInput
            label="Email"
            type="email"
            name="email"
            placeholder="example@gmail.com"
            value={formData.email}
            onChange={onChange}
          />
          <FormInput
            label="Password"
            type="password"
            name="password"
            placeholder="********"
            value={formData.password}
            onChange={onChange}
          />
          <Button
            variant="solid"
            className="w-full mt-3"
            isLoading={isLoginLoading}
            onClick={onSubmit}
            isDisabled={isDisabled}
          >
            Sign In
          </Button>
          <div className="flex justify-between items-center mt-6">
            <NavLink
              to="/forgot-password"
              className="text-sm text-gray-700  dark:text-gray-400 hover:underline"
            >
              Forgot password?
            </NavLink>
          </div>
        </form>
      </Container>
    </div>
  );
}

export default LoginPage;
