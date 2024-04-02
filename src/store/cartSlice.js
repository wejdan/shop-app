import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { syncCartWithServer } from "../services/cart";
export const syncCart = createAsyncThunk(
  "cart/syncCartWithServer",
  async ({ token, cart }, { getState }) => {
    console.log("inside syncCart", token, cart);
    const response = await syncCartWithServer(token, cart);
    return response.cart; // Assuming the server responds with the updated cart
  }
);
const initialState = {
  items: [], // Array of cart items
  totalCount: 0, // Initialize totalCount
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem(state, action) {
      console.log("addItem");
      const newItem = action.payload;
      const existingItem = state.items.find(
        (item) => item.productId === newItem.productId
      );
      if (existingItem) {
        existingItem.quantity += newItem.quantity;
      } else {
        state.items.push(newItem);
      }
      state.totalCount += newItem.quantity;
    },

    removeItem(state, action) {
      const productId = action.payload;
      const existingItem = state.items.find(
        (item) => item.productId === productId
      );
      if (existingItem) {
        // Deduct the quantity of the removed item from totalCount
        state.totalCount -= existingItem.quantity;
        state.items = state.items.filter(
          (item) => item.productId !== productId
        );
      }
    },

    updateItemQuantity(state, action) {
      const { productId, quantity } = action.payload;
      const existingItem = state.items.find(
        (item) => item.productId === productId
      );

      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;

        if (newQuantity <= 0) {
          // Deduct the quantity of the removed item from totalCount before removing it
          state.totalCount -= existingItem.quantity;
          state.items = state.items.filter(
            (item) => item.productId !== productId
          );
        } else {
          // Adjust totalCount based on the new quantity
          state.totalCount += quantity;
          existingItem.quantity = newQuantity;
        }
      }
    },

    clearCart(state) {
      state.items = [];
      state.totalCount = 0;
    },
    setCart(state, action) {
      state.items = action.payload;
      state.totalCount = state.items.reduce(
        (total, item) => total + item.quantity,
        0
      );
    },
  },
  extraReducers: (builder) => {
    builder.addCase(syncCart.fulfilled, (state, action) => {
      state.items = []; // Update the local cart with the server-synced cart
      state.totalCount = 0;
    });
    // Handle other states (pending, rejected) if necessary
  },
});

export const { addItem, removeItem, updateItemQuantity, clearCart, setCart } =
  cartSlice.actions;

export default cartSlice.reducer;
