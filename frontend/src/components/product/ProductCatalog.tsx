"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Filters from "./Filters"; // Import the new Filters component
import Sortings from "./Sortings"; // Import the new Sortings component
import ProductList from "@/components/product/ProductList";
import { fetchItems } from "@/store/itemsSlice";
import { AppDispatch, RootState } from "@/store/store";
import withAuth from "@/components/auth/withAuth";

const ProductCatalog: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const items = useSelector((state: RootState) => state.items.items);
  const selectedCategory = useSelector(
    (state: RootState) => state.filter.selectedCategory
  );
  const selectedCondition = useSelector(
    (state: RootState) => state.filter.selectedCondition
  );
  const userId = useSelector((state: RootState) => state.auth.userId);
  const { loading, error } = useSelector((state: RootState) => state.items);

  useEffect(() => {
    dispatch(fetchItems());
  }, [dispatch, selectedCategory, selectedCondition, userId]);

  return (
    <div className="container">
      <div className="section">
        <div className="columns mt-6">
          <div className="column is-half">
            <Filters /> {/* Use the Filters component */}
          </div>
          <div className="column is-half">
            <Sortings /> {/* Use the Sortings component */}
          </div>
        </div>
        <ProductList
          isLoading={loading}
          isError={error ? true : false}
          items={items}
        />
      </div>
    </div>
  );
};

export default withAuth(ProductCatalog);
