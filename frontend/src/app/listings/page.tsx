"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CategorySelector from "@/components/product/CategorySelector";
import { ProductListSell } from "@/components/product/ProductList";
import { fetchItems } from "@/store/itemsSlice";
import { FetchItemMode } from "@/types";
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
        <CategorySelector fetchItemMode={FetchItemMode.SELL} />
        <ProductListSell items={items} />
      </section>
    </div>
  );
};

export default withAuth(Listings);
