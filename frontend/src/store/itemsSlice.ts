import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "./store";
import { Item, ItemDetail, FetchItemMode } from "@/types";

interface ItemState {
  items: Item[];
  itemDetail: ItemDetail | null;
  loading: boolean;
  error: string | null;
  selectedCategory: number | null;
}

const initialState: ItemState = {
  items: [],
  itemDetail: null,
  loading: false,
  error: null,
  selectedCategory: null,
};

export const fetchItems = createAsyncThunk(
  "items/fetchItems",
  async ({ mode }: { mode: FetchItemMode }, { getState }) => {
    const state = getState() as RootState;
    const categoryId = state.items.selectedCategory;
    const userId = state.auth.userId;
    let url = "http://localhost:8080/items";

    const params = new URLSearchParams();
    if (categoryId !== null) {
      params.append("category_id", categoryId.toString());
    }

    if (mode === FetchItemMode.BUY && userId !== null) {
      params.append("seller_id-ne", userId.toString());
    } else if (mode === FetchItemMode.SELL && userId !== null) {
      params.append("seller_id", userId.toString());
    }

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const response = await axios.get<Item[]>(url);
    return response.data;
  }
);

export const fetchItemDetail = createAsyncThunk(
  "items/fetchItemDetail",
  async (itemId: string) => {
    const response = await axios.get<ItemDetail>(
      `http://localhost:8080/items/${itemId}`
    );
    return response.data;
  }
);

const itemsSlice = createSlice({
  name: "items",
  initialState,
  reducers: {
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch items";
      })
      .addCase(fetchItemDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.itemDetail = null;
      })
      .addCase(fetchItemDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.itemDetail = action.payload;
      })
      .addCase(fetchItemDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch item details";
      });
  },
});

export const { setSelectedCategory } = itemsSlice.actions;
export default itemsSlice.reducer;
