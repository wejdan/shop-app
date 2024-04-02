import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../../../components/UI/Button";
import { useCheckOut } from "../../../hooks/orders/useCheckout";
import { useGetUserCart } from "../../../hooks/cart/useGetUserCart";
import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useGetAllUserAddresses } from "../../../hooks/addresses/useGetAllUserAddresses";
import Modal from "../../../components/UI/Modal";
import { FaPlus } from "react-icons/fa";
import { useAddAddress } from "../../../hooks/addresses/useAddAddress";
import AddAddressForm from "../../../components/Addresses/AddAddressForm2";
import { loadStripe } from "@stripe/stripe-js";
import PaymentForm from "../../../components/payment/PaymentForm";
import toast from "react-hot-toast";
import { createCheckoutSession } from "../../../services/orders";
const CheckoutPage = () => {
  const navigate = useNavigate();
  const checkOutMutation = useCheckOut();
  const addAddressMutate = useAddAddress();
  const stripe = useStripe();
  const elements = useElements();
  const { data: cartItems, isLoading: isCartLoading } = useGetUserCart();
  const { data: addressData, isLoading: isAddressLoading } =
    useGetAllUserAddresses();

  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [loading, setLoading] = useState(false);

  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const sessionId = queryParams.get("session_id");

    if (sessionId && selectedAddressId) {
      // Call the createOrder endpoint with the session ID
      const orderDetails = {
        shippingAddressId: selectedAddressId,
        sessionId,
        // Add other necessary order details
      };
      try {
        // Replace with your actual API call
        checkOutMutation.mutate(orderDetails, {
          onSuccess: () => {
            navigate("/order-success"); // Redirect to a success page
          },
        });
      } catch (error) {
        console.error("Network or server error:", error);
        toast.error(error.message, {
          duration: 5000,
          // isClosable is not a supported option in react-hot-toast
        });
        // Handle error
      } finally {
        setLoading(false);
      }
    }
  }, [location, navigate, selectedAddressId]);
  // Setting default address as selected address
  useEffect(() => {
    const defaultAddress = addressData?.addresses?.find(
      (address) => address.isDefault
    );
    if (defaultAddress) {
      setSelectedAddressId(defaultAddress._id);
    }
  }, [addressData]);

  const total = cartItems?.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handleSelectAddress = (addressId) => {
    setSelectedAddressId(addressId);
  };

  const handleCheckout = async (e) => {
    console.log("handleCheckout");
    e.preventDefault();

    if (!stripe || !elements) {
      console.log("Stripe has not loaded");
      return;
    }
    setLoading(true);

    const cardElement = elements.getElement(CardElement);
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });

    console.log("paymentMethod", paymentMethod);
    if (error) {
      setLoading(false);

      console.error("Error creating payment method:", error);
      toast.error(error.message, {
        duration: 5000,
        // isClosable is not a supported option in react-hot-toast
      });
      return;
    }

    // Now call your backend API with the payment method ID and other order details
    const orderDetails = {
      shippingAddressId: selectedAddressId,
      paymentMethodId: paymentMethod.id,
      // Add other necessary order details
    };
    console.log("orderDetails", orderDetails);

    try {
      // Replace with your actual API call
      checkOutMutation.mutate(orderDetails, {
        onSuccess: () => {
          navigate("/order-success"); // Redirect to a success page
        },
      });
    } catch (error) {
      console.error("Network or server error:", error);
      toast.error(error.message, {
        duration: 5000,
        // isClosable is not a supported option in react-hot-toast
      });
      // Handle error
    } finally {
      setLoading(false);
    }
  };
  const redirectToCheckout = async () => {
    // Get Stripe.js instance

    // Fetch the Checkout Session ID from your server
    setLoading(true);
    const session = await createCheckoutSession();

    // Redirect to Stripe Checkout
    const result = await stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (result.error) {
      // Handle any errors that occur during the redirect
      console.error(result.error.message);
      toast.error(result.error.message, {
        duration: 5000,
        // isClosable is not a supported option in react-hot-toast
      });
    }

    setLoading(false);
  };
  return (
    <>
      {" "}
      <div className="bg-gray-100 py-8">
        <div className="container mx-auto px-4">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 border-b">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Checkout
              </h3>
            </div>
            <div className="px-4 py-5 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Cart Items */}
              <div>
                <h4 className="mb-4 text-lg font-medium text-gray-900">
                  Your Cart Items
                </h4>
                <ul className="divide-y divide-gray-200">
                  {cartItems?.map((item) => (
                    <li
                      key={item.id}
                      className="py-4 flex justify-between items-center"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          {item.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 text-right">
                  <p className="text-lg font-semibold text-gray-900">
                    Total: ${total?.toFixed(2)}
                  </p>
                </div>
              </div>
              {/* Shipping and Payment */}

              {/* Addresses Section */}
              <div className="flex  flex-col justify-between">
                {/* <PaymentForm /> */}
                <h4 className="mb-4 mt-8  text-lg font-bold text-gray-900">
                  Select Shipping Address
                </h4>
                <div className="grid grid-cols-1 gap-4">
                  {addressData?.addresses.map((address) => (
                    <div
                      key={address._id}
                      className={`p-4 border rounded-lg ${
                        selectedAddressId === address._id
                          ? "border-blue-500 bg-blue-100"
                          : "border-gray-300"
                      }`}
                      onClick={() => handleSelectAddress(address._id)}
                      role="button"
                    >
                      <p className="font-semibold">{address.type}</p>
                      <p>{address.name}</p>
                      <p>{address.info}</p>

                      <p>{address.phone}</p>
                    </div>
                  ))}
                  {addressData?.addresses.length === 0 && (
                    <Modal.Open opens={"add-address"}>
                      <FaPlus className="cursor-pointer mx-auto" />
                    </Modal.Open>
                  )}
                </div>

                <Button
                  isLoading={checkOutMutation.isPending || loading}
                  isDisabled={!selectedAddressId}
                  onClick={redirectToCheckout}
                  className="self-center mt-5"
                >
                  {checkOutMutation.isPending || loading
                    ? "Processing..."
                    : "Place your order"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal.Window
        isSmall={true}
        isPending={addAddressMutate.isPending}
        name={"add-address"}
      >
        <AddAddressForm addAddressMutate={addAddressMutate} />
      </Modal.Window>
    </>
  );
};

export default CheckoutPage;
