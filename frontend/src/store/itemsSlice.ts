// itemsSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "./store";
import { Item, ItemDetail, FetchItemMode, ItemStatus } from "../types";
import toast from "react-hot-toast";
import { ViewType } from "./filterSlice";

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
  async (_, { getState }) => {
    const state = getState() as RootState;
    const viewType = state.filter.viewType; // Fetch viewType from state
    const categoryId = state.items.selectedCategory;
    const userId = state.auth.userId;
    let url = "http://localhost:8080/items";

    const params = new URLSearchParams();
    if (categoryId !== null) {
      params.append("category_id", categoryId.toString());
    }

    if (viewType === ViewType.BUY && userId !== null) {
      params.append("seller_id-ne", userId.toString());
      params.append("status", ItemStatus.AVAILABLE);
    } else if (viewType === ViewType.SELL && userId !== null) {
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
  async (itemId: string, { getState }) => {
    const response = await axios.get<ItemDetail>(
      `http://localhost:8080/items/${itemId}`
    );
    return response.data;
  }
);

export const buyItem = createAsyncThunk(
  "items/buyItem",
  async (itemId: number, { getState, dispatch, rejectWithValue }) => {
    const state = getState() as RootState;
    const token = state.auth.token;

    try {
      const response = await axios.post(
        "http://localhost:8080/items/buy",
        { item_id: itemId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Item purchased successfully!");
      dispatch(fetchItemDetail(itemId.toString())); // Re-fetch item details after successful purchase
      return response.data;
    } catch (error: any) {
      const buyItemFailedErrMsg = "Failed to purchase item";
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(`${error.response.data.message}`);
        return rejectWithValue(error.response.data.message);
      } else if (error.response && error.response.status === 500) {
        toast.error(buyItemFailedErrMsg);
        return rejectWithValue("Internal server error");
      } else {
        toast.error(buyItemFailedErrMsg);
        return rejectWithValue("Failed to purchase item");
      }
    }
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
      })
      .addCase(fetchItemDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.itemDetail = action.payload;
      })
      .addCase(fetchItemDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch item detail";
      });
    // .addCase(buyItem.pending, (state) => {
    //   state.loading = true;
    //   state.error = null;
    // })
    // .addCase(buyItem.fulfilled, (state, action) => {
    //   state.loading = false;
    //   state.itemDetail = action.payload;
    // })
    // .addCase(buyItem.rejected, (state, action) => {
    //   state.loading = false;
    //   state.error = action.payload as string;
    // });
  },
});

export const { setSelectedCategory } = itemsSlice.actions;
export default itemsSlice.reducer;
