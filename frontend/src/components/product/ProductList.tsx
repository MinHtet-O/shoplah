// File: components/item/ProductList.tsx

"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Item } from "@/types";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";

interface ProductListProps {
  items: Item[];
}

export const ProductListBuy: React.FC<ProductListProps> = ({ items }) => {
  const router = useRouter();
  const handleProductClick = (itemId: number) => {
    router.push(`/explorer/${itemId}`);
  };
  return (
    <div className="columns is-multiline">
      {items.map((item: Item) => (
        <Product
          onProductClick={handleProductClick}
          key={item.id}
          item={item}
        />
      ))}
    </div>
  );
};

export const ProductListSell: React.FC<ProductListProps> = ({ items }) => {
  const router = useRouter();
  const handleProductClick = (itemId: number) => {
    router.push(`/listings/${itemId}`);
  };
  return (
    <div className="columns is-multiline">
      {items.map((item: Item) => (
        <Product
          onProductClick={handleProductClick}
          key={item.id}
          item={item}
        />
      ))}
    </div>
  );
};

interface ProductProps {
  item: Item;
  onProductClick: (itemId: number) => void;
}

const Product: React.FC<ProductProps> = ({ item, onProductClick }) => {
  return (
    <div
      className="column is-one-quarter-desktop is-half-tablet"
      onClick={() => {
        onProductClick(item.id);
      }}
      style={{ cursor: "pointer" }}
    >
      <div className="card">
        <div className="card-image">
          <figure className="image is-4by3">
            <Image
              src={item.photo || "https://via.placeholder.com/250x150"}
              alt={item.title}
              width={250}
              height={150}
              style={{ objectFit: "cover" }}
            />
          </figure>
        </div>
        <div className="card-content">
          <p className="title is-6">{item.title}</p>
          <p className="subtitle is-6">${item.price}</p>
          <p>{item.description}</p>
          <p className="is-size-7 has-text-grey mt-2">
            {formatDistanceToNow(new Date(item.created_at), {
              addSuffix: true,
            })}
          </p>
        </div>
      </div>
    </div>
  );
};
