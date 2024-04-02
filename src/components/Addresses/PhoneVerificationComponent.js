import React, { useState } from "react";
import { Input } from "../UI/Input";
import Button from "../UI/Button";
import toast from "react-hot-toast";
import {
  startPhoneVerification,
  verifyPhoneNumber,
} from "../../services/addresses";

const PhoneVerificationComponent = ({
  userToken,
  onVerified,
  handleDirectClose,
}) => {
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [verificationStarted, setVerificationStarted] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [verifyingCode, setVerifyingCode] = useState(false);
  const [requestId, setRequestId] = useState("");

  const handleStartVerification = async () => {
    setSendingCode(true);
    try {
      const response = await startPhoneVerification(userToken, `966${phone}`);
      setVerificationStarted(true);
      setRequestId(response.status.requestId);
      toast.success("Verification code sent to your phone.");
    } catch (error) {
      console.error("Verification start failed", error);
      toast.error("Failed to start verification. Please try again.");
    } finally {
      setSendingCode(false);
    }
  };

  const handleVerifyPhone = async () => {
    setVerifyingCode(true);
    try {
      await verifyPhoneNumber(userToken, requestId, code);
      toast.success("Phone verified successfully!");
      onVerified(true, `966${phone}`); // Invoke the callback with true and the verified phone number
      handleDirectClose();
    } catch (error) {
      console.error("Phone verification failed", error);
      toast.error(
        "Failed to verify phone. Please check the code and try again."
      );
      onVerified(false, ""); // Invoke the callback with false in case of verification failure
    } finally {
      setVerifyingCode(false);
    }
  };

  return (
    <div className=" max-w-sm mx-auto bg-white ">
      {verificationStarted ? (
        <div>
          <Input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Verification code"
            className="mb-4 p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <Button
            variant={"outline"}
            onClick={handleVerifyPhone}
            disabled={verifyingCode}
          >
            {verifyingCode ? "Verifying..." : "Verify Phone"}
          </Button>
          <Button
            variant={"link"}
            onClick={handleStartVerification}
            disabled={sendingCode}
          >
            {sendingCode ? "Sending..." : "Resend Verification Code"}
          </Button>
        </div>
      ) : (
        <div className="flex flex-col">
          <div className="flex items-center mb-4">
            <div
              className="p-2 bg-gray-200 text-gray-600 rounded-l select-none"
              style={{ width: "60px" }}
            >
              +966
            </div>
            <Input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ""))}
              placeholder="540077852"
            />
          </div>
          <Button
            variant={"outline"}
            onClick={handleStartVerification}
            disabled={sendingCode}
            className={"self-center"}
          >
            {sendingCode ? "Sending..." : "Send Verification Code"}
          </Button>
        </div>
      )}
    </div>
  );
};
export default PhoneVerificationComponent;
