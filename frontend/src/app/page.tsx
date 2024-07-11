// File: app/index.tsx

"use client";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState, AppDispatch } from "@/store/store";
import { initializeAuth } from "@/store/authSlice";
import Landing from "../components/landing/Landing";
import ProductCatalog from "../components/product/ProductCatalog"; // Adjust path as needed

export default function Index() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, initializing } = useSelector(
    (state: RootState) => state.auth
  );
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  useEffect(() => {
    if (!initializing) {
      setIsAuthLoading(false);
    }
  }, [initializing]);

  if (isAuthLoading) {
    return <div>Loading...</div>; // Adjust loading state as needed
  }

  return (
    <div>
      {!isAuthenticated && <Landing />}{" "}
      {isAuthenticated && (
        <div>
          <ProductCatalog />
        </div>
      )}{" "}
    </div>
  );
}
