import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  products: null, // Initial state for products
};

const productsSlice = createSlice({
  name: 'products', // Name of the slice
  initialState, // Initial state
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload; // Update products with the provided payload
    },
  },
});

// Export action creator for setting products
export const { setProducts } = productsSlice.actions;

// Export reducer to be used in the store
export default productsSlice.reducer;
