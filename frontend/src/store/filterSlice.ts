import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ViewType, ItemCondition } from "../types";
import { Sorting } from "../types";

const DEFAULT_SORTING = Sorting.LATEST;

interface FilterState {
  viewType: ViewType;
  selectedCategory: number | null;
  selectedCondition: ItemCondition | null;
  sorting: Sorting;
}

const initialState: FilterState = {
  viewType: ViewType.BUY, // Default to BUY or whichever makes sense
  selectedCategory: null,
  selectedCondition: null,
  sorting: DEFAULT_SORTING,
};

const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    setViewType(state, action: PayloadAction<ViewType>) {
      localStorage.setItem("viewType", action.payload);
      state.viewType = action.payload;
      state.selectedCategory = null;
      state.selectedCondition = null;
      state.sorting = DEFAULT_SORTING;
    },
    loadViewTypeFromLocalStorage: (state) => {
      const savedViewType = localStorage.getItem("viewType");
      if (savedViewType) {
        state.viewType = savedViewType as ViewType;
      }
    },
    setSelectedCategory(state, action: PayloadAction<number | null>) {
      state.selectedCategory = action.payload;
    },
    setSelectedCondition(state, action: PayloadAction<ItemCondition | null>) {
      state.selectedCondition = action.payload;
    },
    setSorting(state, action: PayloadAction<Sorting>) {
      state.sorting = action.payload;
    },
  },
});

export const {
  setViewType,
  setSelectedCategory,
  setSelectedCondition,
  setSorting,
  loadViewTypeFromLocalStorage,
} = filterSlice.actions;

export default filterSlice.reducer;
