import React from "react";
import { CardElement } from "@stripe/react-stripe-js";

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#32325d",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  },
};

const PaymentForm = ({ onChange }) => {
  const handleCardDetailsChange = (event) => {
    // Propagate changes back to parent component, if needed
    if (onChange) {
      onChange(event);
    }
  };

  return (
    <div className="payment-form">
      <label htmlFor="card-element">Credit or Debit Card</label>
      <CardElement
        id="card-element"
        options={CARD_ELEMENT_OPTIONS}
        onChange={handleCardDetailsChange}
      />
      {/* Display any error that occurs when processing the payment */}
      {/* You can also use the CardElement's onChange to handle and display form errors in real-time */}
    </div>
  );
};

export default PaymentForm;
