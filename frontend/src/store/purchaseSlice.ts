// src/features/purchase/purchaseSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Purchase } from "@/types";
import { RootState } from "./store";
import axios from "axios";
import { BACKEND_URL } from "@/utils/loadBackendUrl";

export const fetchPurchases = createAsyncThunk(
  "purchase/fetchPurchases",
  async (_, { getState }) => {
    const { auth } = getState() as RootState;
    const token = auth.token;
    console.log("before fetch");
    const response = await axios.get(
      `${BACKEND_URL}/purchases?buyer_id=${auth.userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  }
);

export const fetchSales = createAsyncThunk(
  "purchase/fetchSales",
  async (_, { getState }) => {
    const { auth } = getState() as RootState;
    const token = auth.token;
    const response = await axios.get(
      `${BACKEND_URL}/purchases?seller_id=${auth.userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  }
);

interface PurchaseState {
  purchases: Purchase[];
  sales: Purchase[];
  loading: boolean;
  error: string | null;
}

const initialState: PurchaseState = {
  purchases: [],
  sales: [],
  loading: false,
  error: null,
};

const purchaseSlice = createSlice({
  name: "purchase",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPurchases.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchPurchases.fulfilled,
        (state, action: PayloadAction<Purchase[]>) => {
          state.loading = false;
          state.purchases = action.payload;
        }
      )
      .addCase(fetchPurchases.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch purchases";
      })
      .addCase(fetchSales.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchSales.fulfilled,
        (state, action: PayloadAction<Purchase[]>) => {
          state.loading = false;
          state.sales = action.payload;
        }
      )
      .addCase(fetchSales.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch sales";
      });
  },
});

export default purchaseSlice.reducer;
