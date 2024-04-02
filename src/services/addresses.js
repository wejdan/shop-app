import { customFetch } from "../utils/utils";

const URL = `${process.env.REACT_APP_API_URL}/addresses`;
const API_KEY = process.env.REACT_APP_API_KEY;

// Function to fetch the user's addresses
export const fetchAddresses = async (token) => {
  return customFetch(`${URL}`, {
    method: "GET",
    token,
  });
};

// Function to add a new address
export const addAddress = async (token, addressData) => {
  return customFetch(`${URL}`, {
    method: "POST",
    body: JSON.stringify(addressData),
    token,
  });
};

// Function to update an existing address
export const updateAddress = async (token, addressData) => {
  console.log("updateAddress was called");
  const {
    id: addressId,

    ...restOfData
  } = addressData;
  return customFetch(`${URL}/${addressId}`, {
    method: "PATCH",
    body: JSON.stringify(restOfData),
    token,
  });
};

// Function to delete an address
export const deleteAddress = async (token, addressId) => {
  return customFetch(`${URL}/${addressId}`, {
    method: "DELETE",
    token,
  });
};

// Function to set a default address
export const setDefaultAddress = async (token, addressId) => {
  return customFetch(`${URL}/set-default/${addressId}`, {
    method: "PATCH",
    token,
  });
};
export async function reverseGeocode({ lat, lng }) {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${API_KEY}`;
  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === "OK") {
      if (data.results[0]) {
        return data.results[0].formatted_address; // Return the formatted address
      } else {
        console.log("No results found");
        return null; // Return null if no results found
      }
    } else {
      console.log("Geocoder failed due to: " + data.status);
      return null; // Return null if the API call failed
    }
  } catch (error) {
    console.log("Error:", error);
    return null; // Return null if there was an error in fetching or processing the request
  }
}
export const startPhoneVerification = async (token, phone) => {
  const url = `${URL}/start-phone-verification`;
  return customFetch(url, {
    method: "POST",
    body: JSON.stringify({ phone }),
    token,
  });
};

// Function to verify the phone number with the OTP code
export const verifyPhoneNumber = async (token, requestId, code) => {
  const url = `${URL}/verify-phone`;
  return customFetch(url, {
    method: "POST",
    body: JSON.stringify({ requestId, code }),
    token,
  });
};
