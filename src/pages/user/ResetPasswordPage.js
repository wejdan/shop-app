import React, { useState } from "react";
import { NavLink, useParams } from "react-router-dom";

import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { resetPassword } from "../../services/auth";
import Container from "../../components/UI/Container";
import FormInput from "../../components/UI/FormInput";
import Button from "../../components/UI/Button";

function ResetPasswordPage() {
  const [loading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const { token } = useParams(); // Assuming the URL is /reset/:token
  const isDisabled =
    loading || !password.trim() || password !== confirmPassword;

  const onChangePassword = (e) => {
    setPassword(e.target.value);
  };

  const onChangeConfirmPassword = (e) => {
    setConfirmPassword(e.target.value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords don't match.");
      return;
    }
    setIsLoading(true);
    toast.dismiss();
    try {
      await resetPassword(token, password);
      toast.success("Your password has been reset successfully.");
      navigate("/login"); // Redirect the user to the login page
    } catch (error) {
      toast.error(error.message || "Failed to reset password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center mx-auto w-full max-w-md px-6">
      <Container>
        <h2 className="text-lg font-bold text-center">Reset Password</h2>
        <form onSubmit={onSubmit}>
          <FormInput
            label="New Password"
            type="password"
            name="password"
            placeholder="Enter new password"
            value={password}
            onChange={onChangePassword}
          />
          <FormInput
            label="Confirm New Password"
            type="password"
            name="confirmPassword"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={onChangeConfirmPassword}
          />
          <Button
            variant="solid"
            className="w-full mt-3"
            isLoading={loading}
            isDisabled={isDisabled}
          >
            Reset Password
          </Button>
          <div className="flex justify-between items-center mt-6">
            <NavLink
              to="/login"
              className="text-sm text-gray-400 hover:underline"
            >
              Back to Sign In
            </NavLink>
            <NavLink
              to="/signup"
              className="text-sm text-gray-400 hover:underline"
            >
              Sign Up
            </NavLink>
          </div>
        </form>
      </Container>
    </div>
  );
}

export default ResetPasswordPage;
