// src/features/purchase/purchaseSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Purchase } from "@/types";
import { RootState } from "./store";
import axios from "axios";
import { BACKEND_URL } from "@/utils/loadBackendUrl";
import toast from "react-hot-toast";

export const fetchPurchases = createAsyncThunk(
  "purchase/fetchPurchases",
  async (_, { getState }) => {
    try {
      const { auth } = getState() as RootState;
      const token = auth.token;
      const response = await axios.get(
        `${BACKEND_URL}/purchases?buyer_id=${auth.userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (err) {
      console.log("purchaseSlice error handling");
      console.log(err);
      let errMsg = (err as any).response?.data?.message;
      if (errMsg) {
        throw new Error(errMsg);
      }
      throw err;
    }
  }
);

export const fetchSales = createAsyncThunk(
  "purchase/fetchSales",
  async (_, { getState }) => {
    try {
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
    } catch (err) {
      let errMsg = (err as any).response?.data?.message;
      if (errMsg) {
        throw new Error(errMsg);
      }
      throw err;
    }
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
