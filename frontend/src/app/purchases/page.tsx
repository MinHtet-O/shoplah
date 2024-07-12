"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { fetchPurchases } from "@/store/purchaseSlice";
import { AppDispatch, RootState } from "@/store/store";
import withAuth from "@/components/auth/withAuth";
import LoadingSpinner from "@/components/loading/LoadingSpinner";
import PurchaseTable from "@/components/purchase/PurchaseTable";

const PurchaseHistory: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { purchases, loading, error } = useSelector(
    (state: RootState) => state.purchase
  );

  useEffect(() => {
    dispatch(fetchPurchases());
  }, [dispatch]);

  const handlePurchaseClick = (purchaseId: number) => {
    // TODO: implement purchase detail
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h2 className="is-size-4 is-text-grey">{error}</h2>
      </div>
    );
  }

  return (
    <section className="section">
      <div className="container">
        <h1 className="title is-size-3 has-text-grey has-text-weight-semibold">
          Purchase History
        </h1>
        {purchases.length === 0 ? (
          <p className="has-text-centered is-size-4 has-text-grey">
            No data available
          </p>
        ) : (
          <PurchaseTable data={purchases} onRowClick={handlePurchaseClick} />
        )}
      </div>
    </section>
  );
};

export default withAuth(PurchaseHistory);
