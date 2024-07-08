"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CategorySelector from "@/components/product/CategorySelector";
import ProductList from "@/components/product/ProductList";
import { FetchItemMode, fetchItems } from "@/store/itemSlice";
import { AppDispatch, RootState } from "@/store/store";
import withAuth from "@/components/auth/withAuth";

const Explorer: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const items = useSelector((state: RootState) => state.item.items);
  const selectedCategory = useSelector(
    (state: RootState) => state.item.selectedCategory
  );
  const userId = useSelector((state: RootState) => state.auth.userId);

  useEffect(() => {
    dispatch(fetchItems({ mode: FetchItemMode.BUY }));
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

export default withAuth(Explorer);
