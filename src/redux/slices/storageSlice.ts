import { createSlice } from "@reduxjs/toolkit";

const storageSlice = createSlice({
  name: "storage",
  initialState: {},
  reducers: {
    setStoredData: (state, action) => {
      const { key, value } = action.payload;
      state[key] = value;
    },
    removeStoredData: (state, action) => {
        delete state[action.payload];
      },
  },
});

export const { setStoredData,removeStoredData } = storageSlice.actions;
export default storageSlice;
