// File: app/listing/Listing.tsx
"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CategorySelector from "@/components/product/CategorySelector";
import ProductList from "@/components/product/ProductList";
import { fetchItems } from "@/store/itemsSlice";
import { FetchItemMode } from "@/store/types";
import { AppDispatch, RootState } from "@/store/store";
import withAuth from "@/components/auth/withAuth";

const Listings: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const items = useSelector((state: RootState) => state.items.items);
  const selectedCategory = useSelector(
    (state: RootState) => state.items.selectedCategory
  );
  const userId = useSelector((state: RootState) => state.auth.userId);

  useEffect(() => {
    dispatch(fetchItems({ mode: FetchItemMode.SELL }));
  }, [dispatch, selectedCategory, userId]);

  return (
    <div className="container">
      <section className="section">
        <CategorySelector />
      </section>
      <section className="section">
        <ProductList items={items} />
      </section>
    </div>
  );
};

export default withAuth(Listings);
