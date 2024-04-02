import { refreshAuthToken } from "../services/auth";
let isRefreshingToken = false;
let refreshPromise = null;
// Helper to get tokens from local storage
function getAuthData() {
  const authDataString = localStorage.getItem("auth");
  return authDataString ? JSON.parse(authDataString) : null;
}

// Helper to save tokens to local storage
function saveAuthData(authData) {
  localStorage.setItem("auth", JSON.stringify(authData));
}

// Refresh token function
async function refreshToken() {
  const authData = getAuthData();
  if (!authData || !authData.refreshToken) {
    throw new Error("No refresh token available");
  }

  if (!isRefreshingToken) {
    isRefreshingToken = true;
    refreshPromise = refreshAuthToken(authData.refreshToken)
      .then((refreshedTokens) => {
        saveAuthData({
          ...authData,
          accessToken: refreshedTokens.accessToken,
          refreshToken: refreshedTokens.refreshToken,
        });
        isRefreshingToken = false;
        refreshPromise = null;
        return refreshedTokens.accessToken;
      })
      .catch((error) => {
        console.error("Failed to refresh token:", error);
        localStorage.removeItem("auth");
        isRefreshingToken = false;
        refreshPromise = null;
        throw error;
      });
  }

  return refreshPromise;
}

export const customFetch = async (url, options = {}, expectBlob = false) => {
  // console.log(url);
  let accessToken = getAuthData()?.accessToken;

  const defaultHeaders = {};
  if (!(options.body instanceof FormData)) {
    defaultHeaders["Content-Type"] = "application/json";
  }

  if (accessToken) {
    defaultHeaders["Authorization"] = `Bearer ${accessToken}`;
  }

  const fetchOptions = {
    credentials: "include",
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  const makeRequest = async (attemptRefresh = true) => {
    try {
      const response = await fetch(url, fetchOptions);

      //  console.log("responseData", url, responseData);
      if (response.ok) {
        if (expectBlob) {
          return response.blob();
        } else {
          return response.json();
        }
      } else if (response.status === 401 && attemptRefresh) {
        // Token might have expired; try to refresh it
        accessToken = await refreshToken(); // Refresh the token

        // Update the Authorization header with the new access token
        fetchOptions.headers["Authorization"] = `Bearer ${accessToken}`;

        return makeRequest(false); // Retry the original request with the new token
      } else {
        const errorResponse = await response.json();
        // Handle other HTTP errors
        //  const responseData = await response.json();
        const error = new Error(errorResponse.message || "An error occurred");
        //s console.log("response.status", response.status);
        error.status = response.status;
        throw error;
      }
    } catch (error) {
      throw error;
    }
  };

  return makeRequest();
};
