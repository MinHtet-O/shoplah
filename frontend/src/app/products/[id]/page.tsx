"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import { ItemDetail } from "@/store/itemSlice"; // Adjust the path as needed

const ProductDetail: React.FC<{ productId: string }> = ({ productId }) => {
  const [product, setProduct] = useState<ItemDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get<ItemDetail>(`http://localhost:8080/items/${productId}`)
      .then((response) => {
        setProduct(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, [productId]);

  if (loading) {
    return (
      <div className="section has-background-light">
        <div className="container">
          <div className="notification is-info">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="section has-background-light">
        <div className="container">
          <div className="notification is-danger">Error: {error}</div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="section has-background-light">
        <div className="container">
          <div className="notification is-warning">Product not found</div>
        </div>
      </div>
    );
  }

  const latestOffer = product.offers.length > 0 ? product.offers[0] : null;

  return (
    <div className="section has-background-light">
      <div className="container">
        <div className="card">
          <div className="card-content">
            <div className="columns">
              <div className="column is-one-third">
                <figure className="image is-square">
                  <Image
                    src="/images/feature1.png"
                    alt="Product Image"
                    width={800}
                    height={800}
                  />
                </figure>
              </div>
              <div className="column">
                <h6 className="title is-4 mb-2">{product.title}</h6>
                <p className="mb-4">{product.description}</p>
                <div className="content">
                  <p className="has-text-weight-bold is-size-4 mb-4">
                    ${product.price}
                  </p>
                  <p className="mb-4">
                    <div className="has-text-grey ">Category</div>
                    <div>{product.category.name}</div>
                  </p>
                  <p className="mb-4">
                    <div className="has-text-grey ">Seller</div>
                    <div>{product.seller.username} </div>
                  </p>
                  {latestOffer && (
                    <div className="notification is-primary">
                      Someone is offering ${latestOffer.price} for this item
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductDetailPage: React.FC = () => {
  const params = useParams();
  const { id } = params;

  if (!id || Array.isArray(id)) {
    return (
      <div className="section has-background-light">
        <div className="container">
          <div className="notification is-warning">Invalid product ID</div>
        </div>
      </div>
    );
  }

  return <ProductDetail productId={id} />;
};

export default ProductDetailPage;
