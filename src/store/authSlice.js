import { createSlice } from "@reduxjs/toolkit";

import { createAsyncThunk } from "@reduxjs/toolkit";
import { getUserData, logoutUser, refreshAuthToken } from "../services/auth";

export const fetchUserData = createAsyncThunk(
  "user/fetchUserData",
  async (token, thunkAPI) => {
    try {
      const results = await getUserData(token);
      return results;
    } catch (error) {
      if (error.message === "user dose not exist") {
        thunkAPI.dispatch(logout());
      }
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
export const refreshToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, thunkAPI) => {
    const refreshToken = thunkAPI.getState().auth.user.refreshToken;
    try {
      const response = await refreshAuthToken(refreshToken);
      const data = await response.json();
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const performLogout = createAsyncThunk(
  "auth/logout",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.refreshToken; // Assuming token is stored in auth slice
      await logoutUser(token);
      // Perform additional cleanup if needed
      return true; // Indicate success
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Add cases in extraReducers for handling pending, fulfilled, and rejected states

const initialState = {
  user: null,
  userData: null,
  error: null,
  isAuthenticating: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authenticate: (state, action) => {
      const { payload } = action;
      console.log("authenticate", payload.user);
      state.user = payload.user;
      // state.accessToken = action.payload.accessToken;
      // state.refreshToken = action.payload.refreshToken;
      //  console.log('newState', state);
    },
    setIsAuthenticating: (state, action) => {
      const { payload } = action;
      state.isAuthenticating = payload.isAuthenticating;

      //  console.log('newState', state);
    },

    logout: (state, action) => {
      state.user = null;
      state.userData = null;
      state.isAuthenticating = false;
      state.token = null; // Clear the stored token
      state.isAdmin = false;
      // state.didTryAutoLogin = false;
    },
    setTokens: (state, action) => {
      state.user.token = action.payload.accessToken;
      state.user.refreshToken = action.payload.refreshToken;
    },
    setUserData: (state, action) => {
      const { payload } = action;

      state.userData = payload.userData;
      state.isAuthenticating = false;
      // state.didTryAutoLogin = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.isAuthenticating = true;
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.userData = action.payload?.user;
        state.isAdmin = action.payload?.isAdmin;
        state.isAuthenticating = false;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.user = null;
        state.userData = null;
        state.isAuthenticating = false;
        state.error = action.payload;
      })
      .addCase(performLogout.fulfilled, (state) => {
        // Reset state to initial upon successful logout
        state.user = null;
        state.userData = null;
        state.isAuthenticating = false;
        state.token = null;
        // Optionally, redirect the user to the login page or perform other cleanup actions
      })
      .addCase(performLogout.rejected, (state, action) => {
        // Optionally handle logout failure, e.g., by setting an error state
        state.user = null;
        state.userData = null;
        state.isAuthenticating = false;
        state.token = null;
      });
  },
});

// Action creators are generated for each case reducer function
export const {
  authenticate,
  logout,
  setTokens,
  setUserData,
  setIsAuthenticating,
} = authSlice.actions;

export default authSlice.reducer;
