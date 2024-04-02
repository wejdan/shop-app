import { customFetch } from "../utils/utils";

// Assuming your API's base URL is stored in an environment variable
const URL = `${process.env.REACT_APP_API_URL}/orders`;
// Assuming your API's base URL is stored in a variable like BASE_URL
const BASE_URL = process.env.REACT_APP_API_URL;

// Function to create a checkout session
export const createCheckoutSession = async (token) => {
  // Construct the URL for the create-checkout-session endpoint
  const checkoutSessionUrl = `${URL}/create-checkout-session`;

  // Call the customFetch utility function
  return customFetch(checkoutSessionUrl, {
    method: "POST",

    token: true,
  });
};

export const handleDownloadInvoice = async (orderId, token) => {
  const invoiceUrl = `${URL}/download-invoice/${orderId}`;
  console.log("invoiceUrl", invoiceUrl);
  try {
    // Call customFetch with the URL, options, and set expectBlob to true
    const blob = await customFetch(
      invoiceUrl,
      { method: "GET", token: true },
      true
    );

    // Create a URL for the Blob and trigger the download
    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = `invoice-${orderId}.pdf`; // Set a filename for the downloaded invoice
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(downloadUrl); // Clean up the URL object
    document.body.removeChild(a); // Remove the <a> element from the document
  } catch (error) {
    console.error("Error downloading the invoice:", error);
    // Handle error (e.g., show notification to the user)
  }
};

// Function to perform the checkout process
export const checkout = async (token, orderDetails) => {
  // Construct the URL for the checkout endpoint

  // Call the customFetch utility function
  return customFetch(`${URL}/checkout`, {
    method: "POST",
    body: JSON.stringify(orderDetails),
    token,
  });
};
export const fetchUserOrders = async (token, currentPage, limit) => {
  const params = new URLSearchParams({
    page: currentPage,
    limit,
  });
  return customFetch(`${URL}/user-orders?${params.toString()}`, {
    method: "GET",
    token,
  });
};

// Function to fetch all orders (for admin users)
export const fetchAllOrders = async (token, currentPage, limit) => {
  const params = new URLSearchParams({
    page: currentPage,
    limit,
  });
  return customFetch(`${URL}/?${params.toString()}`, {
    method: "GET",
    token,
  });
};
