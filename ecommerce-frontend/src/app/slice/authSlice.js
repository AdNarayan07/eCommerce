import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null, // Initial state for user
  token: null, // Initial state for token
};

const authSlice = createSlice({
  name: 'auth', // Name of the slice
  initialState, // Initial state
  reducers: {
    loginSuccess: (state, action) => {
      state.token = action.payload.token; // Update token on successful login
    },
    fetchUserSuccess: (state, action) => {
      state.user = action.payload; // Set user data on fetch success
    },
    logout: (state) => {
      state.user = null; // Clear user data on logout
      state.token = null; // Clear token on logout
    },
  },
});

// Export actions for use in components
export const { loginSuccess, fetchUserSuccess, logout } = authSlice.actions;

// Export reducer to be used in the store
export default authSlice.reducer;
