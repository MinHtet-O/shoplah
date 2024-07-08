// File: app/page.tsx or app/index.tsx

"use client";
import { useRouter } from "next/navigation";
import Landing from "../components/landing/Landing";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { initializeAuth } from "@/store/authSlice";

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
    if (isAuthenticated) {
      router.push("/explorer");
    } else if (!initializing) {
      setIsAuthLoading(false);
    }
  }, [isAuthenticated, initializing, router]);

  if (isAuthLoading) {
    return <div></div>;
  }

  return <div>{!isAuthenticated && <Landing />}</div>;
}
