import React from "react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { ItemDetail } from "@/types";

interface ProductInfoProps {
  product: ItemDetail;
}

const ProductInfo: React.FC<ProductInfoProps> = ({ product }) => {
  const listingTimeAgo = formatDistanceToNow(new Date(product.created_at), {
    addSuffix: true,
  });
  console.log(product.image);
  const isSold = product.status === "sold";
  return (
    <div className="columns">
      <div className="column is-half">
        <figure className="image is-square">
          <Image
            src={product.image || "https://via.placeholder.com/250x150"}
            alt="Product Image"
            width={800}
            height={800}
          />
        </figure>
      </div>
      <div className="column">
        <h6 className="title is-5 mb-2 has-text-grey">{product.title}</h6>
        <p className="mb-4">{product.description}</p>
        <div className="content">
          <p className="has-text-weight-bold is-size-5 mb-4">
            ${product.price}
          </p>
          <div className="columns is-multiline">
            <div className="column is-half">
              <p className="has-text-grey mb-1">Category</p>
              <p className="mt-0">{product.category.name}</p>
            </div>
            <div className="column is-half">
              <p className="has-text-grey mb-1">Condition</p>
              <p className="mt-0">{product.condition}</p>
            </div>
            <div className="column is-half">
              <p className="has-text-grey mb-1">Brand</p>
              <p className="mt-0">{product.brand}</p>
            </div>
            <div className="column is-half">
              <p className="has-text-grey mb-1">Listing</p>
              <p className="mt-0">
                {listingTimeAgo} <br />
                by {product.seller.username}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
