"use client";

import React from "react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { Purchase } from "@/types";
import {
  getItemConditionTagColor,
  getPurchaseTypeTagColor,
} from "@/utils/tagColors";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

interface PurchaseTableProps {
  data: Purchase[];
  onRowClick: (id: number) => void;
}

const PurchaseTable: React.FC<PurchaseTableProps> = ({ data, onRowClick }) => {
  return (
    <table className="table is-fullwidth is-striped is-hoverable">
      <thead>
        <tr>
          <th>Item</th>
          <th>Condition</th>
          <th>Type</th>
          <th>Price</th>
          <th>Sales Price</th>
          <th>Seller</th>
          <th>Buyer</th>
          <th>Brand</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        {data.map((purchase: Purchase) => (
          <tr key={purchase.id} onClick={() => onRowClick(purchase.id)}>
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
            <td>${purchase.item.price}</td>
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
  );
};

export default PurchaseTable;
