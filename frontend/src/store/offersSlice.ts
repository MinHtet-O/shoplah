// File: store/offerSlice.ts

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "./store";
import { Offer } from "../types";
import toast from "react-hot-toast";

interface OfferState {
  offers: Offer[];
  loading: boolean;
  error: string | null;
}

const initialState: OfferState = {
  offers: [],
  loading: false,
  error: null,
};

export const makeOffer = createAsyncThunk(
  "offers/makeOffer",
  async (
    { item_id, price }: { item_id: number; price: number },
    { getState, rejectWithValue }
  ) => {
    const state = getState() as RootState;
    const token = state.auth.token;

    try {
      const response = await axios.post(
        "http://localhost:8080/offers",
        { item_id, price },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Offer made successfully!");
      return response.data;
    } catch (error: any) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message);
        return rejectWithValue(error.response.data.message);
      } else if (error.response && error.response.status === 500) {
        toast.error("Internal server error. Please try again later.");
        return rejectWithValue("Internal server error");
      } else {
        toast.error("Failed to make offer");
        return rejectWithValue("Failed to make offer");
      }
    }
  }
);

export const acceptOffer = createAsyncThunk(
  "offers/acceptOffer",
  async ({ offer_id }: { offer_id: number }, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const token = state.auth.token;
    try {
      const response = await axios.post(
        "http://localhost:8080/items/accept-offer",
        { offer_id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Offer accepted successfully!");
      return response.data;
    } catch (error: any) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message);
        return rejectWithValue(error.response.data.message);
      } else if (error.response && error.response.status === 500) {
        toast.error("Internal server error. Please try again later.");
        return rejectWithValue("Internal server error");
      } else {
        toast.error("Failed to accept offer");
        return rejectWithValue("Failed to accept offer");
      }
    }
  }
);

export const fetchOffersByItemId = createAsyncThunk(
  "offers/fetchOffersByItemId",
  async (item_id: number, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const token = state.auth.token;

    try {
      const response = await axios.get(
        `http://localhost:8080/offers?item_id=${item_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        return rejectWithValue(error.response.data.message);
      } else if (error.response && error.response.status === 500) {
        return rejectWithValue("Internal server error");
      } else {
        return rejectWithValue("Failed to fetch offers");
      }
    }
  }
);

const offersSlice = createSlice({
  name: "offers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(makeOffer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(makeOffer.fulfilled, (state, action) => {
        state.loading = false;
        state.offers.push(action.payload);
      })
      .addCase(makeOffer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(acceptOffer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(acceptOffer.fulfilled, (state, action) => {
        state.loading = false;
        // Optionally, you might want to remove the accepted offer from the state or update the product status
      })
      .addCase(acceptOffer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchOffersByItemId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOffersByItemId.fulfilled, (state, action) => {
        state.loading = false;
        state.offers = action.payload;
      })
      .addCase(fetchOffersByItemId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default offersSlice.reducer;
