import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "./store";

export interface Category {
  id: number;
  name: string;
}

export interface Seller {
  id: number;
  username: string;
  email: string;
}

export interface Offer {
  id: number;
  item_id: number;
  user_id: number;
  price: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Item {
  id: number;
  seller_id: number;
  category_id: number;
  title: string;
  description: string;
  price: number;
  status: string;
  created_at: string;
  updated_at: string;
  photo?: string;
}

export interface ItemDetail extends Item {
  category: Category;
  seller: Seller;
  offers: Offer[];
}

export enum FetchItemMode {
  BUY = "buy",
  SELL = "sell",
}

interface ItemState {
  categories: Category[];
  items: Item[];
  loading: boolean;
  error: string | null;
  selectedCategory: number | null;
}

const initialState: ItemState = {
  categories: [],
  items: [],
  loading: false,
  error: null,
  selectedCategory: null,
};

export const fetchItems = createAsyncThunk(
  "item/fetchItems",
  async ({ mode }: { mode: FetchItemMode }, { getState }) => {
    const state = getState() as RootState;
    const categoryId = state.item.selectedCategory;
    const userId = state.auth.userId; // Get the logged-in user ID from the auth state
    let url = "http://localhost:8080/items";

    const params = new URLSearchParams();
    if (categoryId !== null) {
      params.append("category_id", categoryId.toString());
    }

    if (mode === FetchItemMode.BUY && userId !== null) {
      params.append("seller_id-ne", userId.toString()); // Assuming your API can handle the not equal filter
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

export const fetchCategories = createAsyncThunk(
  "item/fetchCategories",
  async () => {
    const response = await axios.get<Category[]>(
      "http://localhost:8080/categories"
    );
    return response.data;
  }
);

const itemSlice = createSlice({
  name: "item",
  initialState,
  reducers: {
    setSelectedCategory: (state, action: PayloadAction<number | null>) => {
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
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      });
  },
});

export const { setSelectedCategory } = itemSlice.actions;
export default itemSlice.reducer;
