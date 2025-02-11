import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "./store";
import { Item, ItemDetail, ItemStatus, Sorting, ViewType } from "../types";
import toast from "react-hot-toast";
import { BACKEND_URL } from "@/utils/loadBackendUrl";
interface ItemState {
  items: Item[];
  itemDetail: ItemDetail | null;
  loading: boolean;
  error: string | null;
  buyItemLoading: boolean;
  createItemLoading: boolean;
  createItemError: string | null;
}

const initialState: ItemState = {
  items: [],
  buyItemLoading: false,
  itemDetail: null,
  loading: false,
  error: null,
  createItemLoading: false,
  createItemError: null,
};

export const createItem = createAsyncThunk(
  "items/createItem",
  async (itemData: FormData, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const token = state.auth.token;

    try {
      const response = await axios.post(`${BACKEND_URL}/items`, itemData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Item created successfully!");
      return response.data;
    } catch (error: any) {
      const createItemFailedErrMsg = "Failed to create item";
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(`${error.response.data.message}`);
        return rejectWithValue(error.response.data.message);
      } else if (error.response && error.response.status === 500) {
        toast.error(createItemFailedErrMsg);
        return rejectWithValue("Internal server error");
      } else {
        toast.error(createItemFailedErrMsg);
        return rejectWithValue("Failed to create item");
      }
    }
  }
);
export const fetchAvailableItems = createAsyncThunk(
  "items/fetchItems",
  async (_, { getState }) => {
    const state = getState() as RootState;
    const viewType = state.filter.viewType;
    const categoryId = state.filter.selectedCategory;
    const condition = state.filter.selectedCondition;
    const sorting = state.filter.sorting;
    const userId = state.auth.userId;
    let url = `${BACKEND_URL}/items`;

    const params = new URLSearchParams();
    if (categoryId !== null) {
      params.append("category_id", categoryId.toString());
    }
    if (condition !== null) {
      params.append("condition", condition);
    }
    if (viewType === ViewType.BUY && userId !== null) {
      params.append("seller_id-ne", userId.toString());
    } else if (viewType === ViewType.SELL && userId !== null) {
      params.append("seller_id", userId.toString());
    }
    params.append("status", ItemStatus.AVAILABLE);

    if (sorting) {
      if (sorting === Sorting.LATEST) {
        params.append("sortField", "created_at");
        params.append("sortOrder", "DESC");
      } else if (sorting === Sorting.HIGHEST_PRICE) {
        params.append("sortField", "price");
        params.append("sortOrder", "DESC");
      } else if (sorting === Sorting.LOWEST_PRICE) {
        params.append("sortField", "price");
        params.append("sortOrder", "ASC");
      }
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
      `${BACKEND_URL}/items/${itemId}`
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
        `${BACKEND_URL}/items/buy`,
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
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAvailableItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAvailableItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchAvailableItems.rejected, (state, action) => {
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
      })
      .addCase(buyItem.pending, (state) => {
        state.buyItemLoading = true;
      })
      .addCase(buyItem.fulfilled, (state) => {
        state.buyItemLoading = false;
      })
      .addCase(buyItem.rejected, (state, action) => {
        state.buyItemLoading = false;
      })
      .addCase(createItem.pending, (state) => {
        state.createItemLoading = true;
        state.createItemError = null;
      })
      .addCase(createItem.fulfilled, (state, action) => {
        state.createItemLoading = false;
      })
      .addCase(createItem.rejected, (state, action) => {
        state.createItemLoading = false;
        state.createItemError = action.payload as string;
      });
  },
});

export default itemsSlice.reducer;
