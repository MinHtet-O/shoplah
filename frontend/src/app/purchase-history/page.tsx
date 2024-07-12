"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { fetchPurchases } from "@/store/purchaseSlice";
import { AppDispatch, RootState } from "@/store/store";
import { Purchase } from "@/types";
import withAuth from "@/components/auth/withAuth";
import LoadingSpinner from "@/components/loading/LoadingSpinner";
import {
  getItemConditionTagColor,
  getPurchaseTypeTagColor,
} from "@/utils/tagColors";

const PurchaseHistory: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { purchases, loading, error } = useSelector(
    (state: RootState) => state.purchase
  );

  useEffect(() => {
    dispatch(fetchPurchases());
  }, [dispatch]);

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
        <h1 className="title is-2 mb-6">Purchase History</h1>
        {purchases.length === 0 ? (
          <p className="has-text-centered is-size-4 has-text-grey">
            No purchase history available.
          </p>
        ) : (
          <table className="table is-fullwidth is-striped is-hoverable">
            <thead>
              <tr>
                <th>Item</th>
                <th>Condition</th>
                <th>Type</th>
                <th>Price</th>
                <th>Seller</th>
                <th>Buyer</th>
                <th>Brand</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {purchases.map((purchase: Purchase) => (
                <tr key={purchase.id}>
                  <td>
                    <div className="is-flex is-align-items-center">
                      <p>{purchase.item.title}</p>
                    </div>
                  </td>
                  <td>
                    <span
                      className={`tag ${getItemConditionTagColor(
                        purchase.item.condition
                      )} is-light`}
                    >
                      {purchase.item.condition.replace("_", " ")}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`tag ${getPurchaseTypeTagColor(
                        purchase.type
                      )} is-light`}
                    >
                      {purchase.type.replace("_", " ")}
                    </span>
                  </td>
                  <td>${purchase.price}</td>
                  <td>{purchase.seller.username}</td>
                  <td>{purchase.buyer.username}</td>
                  <td>{purchase.item.brand}</td>
                  <td>
                    {formatDistanceToNow(new Date(purchase.purchased_at), {
                      addSuffix: true,
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
};

export default withAuth(PurchaseHistory);
