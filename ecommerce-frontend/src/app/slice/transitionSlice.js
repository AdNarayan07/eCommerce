import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isPending: false,
};

const transitionSlice = createSlice({
  name: "transition",
  initialState,
  reducers: {
    setPending(state, action) {
      state.isPending = action.payload;
    },
  },
});

export const { setPending } = transitionSlice.actions;
export default transitionSlice.reducer;