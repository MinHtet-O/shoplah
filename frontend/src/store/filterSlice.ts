// filterSlice.ts or filterSlice.js

import { createSlice } from "@reduxjs/toolkit";

export enum ViewType {
  BUY = "BUY",
  SELL = "SELL",
}

interface FilterState {
  viewType: ViewType;
}

const initialState: FilterState = {
  viewType: ViewType.BUY, // Default to BUY or whichever makes sense
};

const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    setViewType(state, action) {
      state.viewType = action.payload;
    },
  },
});

export const { setViewType } = filterSlice.actions;

export default filterSlice.reducer;
