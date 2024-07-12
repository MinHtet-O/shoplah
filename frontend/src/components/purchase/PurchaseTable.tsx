"use client";

import React from "react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { Purchase } from "@/types";
import {
  getItemConditionTagColor,
  getPurchaseTypeTagColor,
} from "@/utils/tagColors";

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
                <figure className="image is-48x48 mr-3">
                  <Image
                    src={
                      purchase.item.image || "https://via.placeholder.com/48"
                    }
                    alt={purchase.item.title}
                    width={48}
                    height={48}
                    style={{ objectFit: "cover" }}
                  />
                </figure>
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
  );
};

export default PurchaseTable;
