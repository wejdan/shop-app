import React, { useState } from "react";
import { NavLink } from "react-router-dom";

import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import { requestOtp, signUp, verifyOtp } from "../../services/auth";
import { authenticate, setUserData } from "../../store/authSlice";
import FormInput from "../../components/UI/FormInput";
import Button from "../../components/UI/Button";
import Container from "../../components/UI/Container";
import OtpInput from "../../components/UI/OtpInput";
import { useLogin } from "../../hooks/auth/useLogin";
import { useSignup } from "../../hooks/auth/useSignup";
import { useAuth } from "../../hooks/auth/useAuth";

function Signup() {
  const dispatch = useDispatch();
  const { signup, isSignupLoading, isSignupError, signupError } = useAuth();
  const [loading, setIsLoading] = useState(false);
  const [generatingOTP, setIsGeneratingOTP] = useState(false);
  const [otpKey, setOtpKey] = useState(Date.now()); // Initialize otpKey state

  const [currentStep, setCurrentStep] = useState("requestOtp"); // 'requestOtp', 'verifyOtp', 'completeSignup'
  const [otp, setOtp] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const isDisabled =
    loading ||
    Object.values(formData).some((value) => value.trim() === "") ||
    formData.password !== formData.confirmPassword;

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

    console.log(formData);
    toast.dismiss(); // Dismiss any existing toasts before showing a new one
    try {
      // Assuming your signup function needs a name, email, and password

      await signup({
        email: formData.email,
        password: formData.password,
        name: formData.name,
      });

      toast.success("Signup successful!"); // Display success message
      // Redirect to dashboard or another page
    } catch (error) {
      toast.error(error.message || "Signup failed."); // Display error message
    }
  };
  const onRequestOtp = async (e) => {
    e.preventDefault();
    setOtp("");
    // Update otpKey to a new value to trigger re-mounting of OtpInput
    setIsGeneratingOTP(true);

    try {
      await requestOtp(formData.email);
      toast.success("OTP sent to your email.");
      setCurrentStep("verifyOtp");
      setOtpKey(Date.now());
    } catch (error) {
      toast.error(error.message || "Failed to send OTP.");
    } finally {
      setIsGeneratingOTP(false);
    }
  };
  const onVerifyOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await verifyOtp(formData.email, otp);
      toast.success("OTP verified.");
      setCurrentStep("completeSignup");
    } catch (error) {
      toast.error(error.message || "Failed to verify OTP.");
    } finally {
      setIsLoading(false);
    }
  };
  const requestOtpForm = (
    <form onSubmit={onRequestOtp}>
      <FormInput
        label="Email"
        type="email"
        name="email"
        placeholder="example@gmail.com"
        value={formData.email}
        onChange={onChange}
      />
      <Button
        variant="solid"
        className="w-full mt-3"
        isLoading={generatingOTP}
        isDisabled={formData.email.trim() === ""}
      >
        Request OTP
      </Button>
    </form>
  );
  const verifyOtpForm = (
    <form onSubmit={onVerifyOtp}>
      <OtpInput
        key={otpKey} // Use otpKey state as the key
        length={6}
        onComplete={(otpValue) => {
          console.log("otpValue", otpValue);
          setOtp(otpValue); // Set the otp state when all inputs are filled
        }}
      />
      <Button
        variant="solid"
        className="w-full mt-3"
        isLoading={loading || generatingOTP}
        isDisabled={otp.length !== 6}
      >
        {generatingOTP ? "Requesting a new OTP" : " Verify OTP"}
      </Button>
    </form>
  );

  return (
    <div className="flex flex-grow flex-col justify-start mx-auto   w-full max-w-md px-6">
      <div className="mx-5 mt-32 flex justify-start items-end space-x-4 mb-4 border-b-2 border-b-gray-300">
        <NavLink
          to="/login"
          className="text-lg text-gray-500   font-bold   pb-2"
        >
          Login
        </NavLink>
        <NavLink
          to="/signup"
          className="text-3xl text-black font-bold  border-b-2 border-transparent pb-2 "
        >
          Sign Up
        </NavLink>
      </div>
      <Container>
        {currentStep === "requestOtp" && requestOtpForm}
        {currentStep === "verifyOtp" && verifyOtpForm}
        {currentStep === "completeSignup" && (
          <form onSubmit={onSubmit}>
            <FormInput
              label="Name"
              type="text"
              name="name"
              placeholder="John Doe"
              value={formData.name}
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
            {/* Confirm Password input */}
            <FormInput
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={onChange} // Update to use the onChange handler
            />
            <Button
              variant="solid"
              className="w-full mt-3"
              isLoading={isSignupLoading}
              isDisabled={isDisabled} // Button is disabled if passwords don't match or any field is empty
            >
              Sign up
            </Button>
          </form>
        )}
        {currentStep === "verifyOtp" && (
          <Button onClick={onRequestOtp} variant={"link"}>
            Resend Token
          </Button>
        )}
      </Container>
    </div>
  );
}

export default Signup;
