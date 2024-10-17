import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isPending: false, // Initial state indicating no pending request
};

const transitionSlice = createSlice({
  name: "transition", // Name of the slice
  initialState, // Initial state
  reducers: {
    setPending(state, action) {
      state.isPending = action.payload; // Update the pending state based on action payload
    },
  },
});

// Export the action creator for setting the pending state
export const { setPending } = transitionSlice.actions;

// Export the reducer to be used in the store
export default transitionSlice.reducer;
