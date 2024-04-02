import React, { useState } from "react";
import { NavLink } from "react-router-dom";

import { toast } from "react-hot-toast";
import { requestPasswordReset } from "../../services/auth";
import Container from "../../components/UI/Container";
import FormInput from "../../components/UI/FormInput";
import Button from "../../components/UI/Button";
// Import the service function for requesting a password reset
// Assuming it's named requestPasswordReset and available in your auth services

function ForgetPasswordPage() {
  const [loading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const isDisabled = loading || !email.trim();

  const onChange = (e) => {
    setEmail(e.target.value);
  };

  const onSubmit = async (e) => {
    e.preventDefault(); // Prevent form submission from reloading the page
    setIsLoading(true);
    toast.dismiss(); // Dismiss any existing toasts before showing a new one
    try {
      await requestPasswordReset(email);
      toast.success("Password reset link sent. Check your email.");
      // Optionally, redirect the user to the login page or show further instructions
    } catch (error) {
      toast.error(error.message || "Failed to request password reset.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-start mx-auto w-full max-w-md px-6">
      <div className="mx-5 mt-32 flex justify-start items-end space-x-4 mb-4 border-b-2 border-b-gray-300">
        <NavLink to="/login" className="text-lg text-gray-500 font-bold   pb-2">
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
        <h2 className="text-lg font-bold text-center">Forgot Password</h2>
        <form onSubmit={onSubmit}>
          <FormInput
            label="Email"
            type="email"
            name="email"
            placeholder="example@gmail.com"
            value={email}
            onChange={onChange}
          />
          <Button
            variant="solid"
            className="w-full mt-3"
            isLoading={loading}
            isDisabled={isDisabled}
          >
            Send Reset Link
          </Button>
        </form>
      </Container>
    </div>
  );
}

export default ForgetPasswordPage;
