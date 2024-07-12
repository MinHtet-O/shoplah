"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { fetchSales } from "@/store/purchaseSlice";
import { AppDispatch, RootState } from "@/store/store";
import withAuth from "@/components/auth/withAuth";
import LoadingSpinner from "@/components/loading/LoadingSpinner";
import PurchaseTable from "@/components/purchase/PurchaseTable";

const SalesHistory: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { sales, loading, error } = useSelector(
    (state: RootState) => state.purchase
  );

  useEffect(() => {
    dispatch(fetchSales());
  }, [dispatch]);
  throw new Error("gg");
  const handleSaleClick = (saleId: number) => {
    // TODO: implement purchase detail
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="section">
        <div className="container">
          <div className="notification is-danger">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <section className="section">
      <div className="container">
        <h1 className="title is-2 mb-6">Sales History</h1>
        {sales.length === 0 ? (
          <p className="has-text-centered is-size-4 has-text-grey">
            No data available.
          </p>
        ) : (
          <PurchaseTable data={sales} onRowClick={handleSaleClick} />
        )}
      </div>
    </section>
  );
};

export default withAuth(SalesHistory);
