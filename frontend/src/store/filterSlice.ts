import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ViewType, ItemCondition } from "../types";

interface FilterState {
  viewType: ViewType;
  selectedCategory: number | null;
  selectedCondition: ItemCondition | null;
  sorting: string | null; // Add sorting state
}

const initialState: FilterState = {
  viewType: ViewType.BUY, // Default to BUY or whichever makes sense
  selectedCategory: null,
  selectedCondition: null,
  sorting: null, // Default to null
};

const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    setViewType(state, action: PayloadAction<ViewType>) {
      state.viewType = action.payload;
    },
    setSelectedCategory(state, action: PayloadAction<number | null>) {
      state.selectedCategory = action.payload;
    },
    setSelectedCondition(state, action: PayloadAction<ItemCondition | null>) {
      state.selectedCondition = action.payload;
    },
    setSorting(state, action: PayloadAction<string | null>) {
      state.sorting = action.payload;
    },
  },
});

export const {
  setViewType,
  setSelectedCategory,
  setSelectedCondition,
  setSorting,
} = filterSlice.actions;

export default filterSlice.reducer;
