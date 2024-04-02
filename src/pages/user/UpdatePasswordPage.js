import React, { useState } from "react";
import { NavLink } from "react-router-dom";

import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux"; // Import useSelector to access the auth token from the Redux store
import { updateUserPassword } from "../../services/auth";
import Container from "../../components/UI/Container";
import FormInput from "../../components/UI/FormInput";
import Button from "../../components/UI/Button";
import { useAuth } from "../../contexts/AuthContext";

function UpdatePasswordPage() {
  const [loading, setIsLoading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const navigate = useNavigate();
  const { authState } = useAuth(); // Use useAuth for auth state and logout functionality

  const isDisabled =
    loading ||
    !currentPassword.trim() ||
    !newPassword.trim() ||
    newPassword !== confirmNewPassword;

  const onSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      toast.error("New passwords don't match.");
      return;
    }
    setIsLoading(true);
    toast.dismiss();
    try {
      await updateUserPassword(
        authState.accessToken,
        currentPassword,
        newPassword
      );
      toast.success("Your password has been updated successfully.");
      navigate("/"); // Redirect the user to a safe page, e.g., the home page
    } catch (error) {
      toast.error(error.message || "Failed to update password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center mx-auto w-full max-w-md px-6">
      <Container>
        <h2 className="text-lg font-bold text-center">Update Password</h2>
        <form onSubmit={onSubmit}>
          <FormInput
            label="Current Password"
            type="password"
            name="currentPassword"
            placeholder="Enter current password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <FormInput
            label="New Password"
            type="password"
            name="newPassword"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <FormInput
            label="Confirm New Password"
            type="password"
            name="confirmNewPassword"
            placeholder="Confirm new password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
          />
          <Button
            variant="solid"
            className="w-full mt-3"
            isLoading={loading}
            isDisabled={isDisabled}
          >
            Update Password
          </Button>
          <div className="flex justify-between items-center mt-6">
            <NavLink to="/" className="text-sm text-gray-400 hover:underline">
              Return to Home
            </NavLink>
          </div>
        </form>
      </Container>
    </div>
  );
}

export default UpdatePasswordPage;
