"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { ItemDetail } from "@/store/types";
import withAuth from "@/components/auth/withAuth";
import MakeOffer from "@/components/product/MakeOffer";
import OfferHistory from "@/components/offer/OfferHistory";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { Offer } from "@/store/types";

const ProductDetail: React.FC<{ productId: string }> = ({ productId }) => {
  const [product, setProduct] = useState<ItemDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isOfferHistoryVisible, setIsOfferHistoryVisible] = useState(false);
  const currUserId = useSelector((state: RootState) => state.auth.userId);

  const fetchProductDetails = async () => {
    try {
      const response = await axios.get<ItemDetail>(
        `http://localhost:8080/items/${productId}`
      );
      setProduct(response.data);
      setLoading(false);
    } catch (error) {
      setError((error as any).message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, [productId, currUserId]);

  const userOffers = product
    ? product.offers.filter((offer: Offer) => offer.user_id === currUserId)
    : [];

  const previousOffer =
    userOffers.length > 0
      ? userOffers.reduce((latest: Offer, current: Offer) =>
          new Date(latest.created_at) > new Date(current.created_at)
            ? latest
            : current
        )
      : null;

  const handleBuyClick = () => {
    alert("Buy functionality not implemented yet");
  };

  const handleOfferSuccess = () => {
    fetchProductDetails();
  };

  const openOfferHistory = () => {
    setIsOfferHistoryVisible(true);
  };

  const closeOfferHistory = () => {
    setIsOfferHistoryVisible(false);
  };

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

  const listingTimeAgo = formatDistanceToNow(new Date(product.created_at), {
    addSuffix: true,
  });

  return (
    <div className="section has-background-light">
      <div className="container" style={{ maxWidth: "1400px" }}>
        <div className="card">
          <div className="card-content">
            <div className="columns">
              <div className="column is-three-quarters">
                <div className="columns">
                  <div className="column is-half">
                    <figure className="image is-square">
                      <Image
                        src={product.photo || "/images/feature1.png"}
                        alt="Product Image"
                        width={800}
                        height={800}
                      />
                    </figure>
                  </div>
                  <div className="column">
                    <h6 className="title is-5 mb-2 has-text-grey">
                      {product.title}
                    </h6>
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
              </div>
              <div className="column is-one-quarter">
                <div className="box">
                  <button
                    className="button is-primary is-fullwidth mb-4"
                    onClick={handleBuyClick}
                  >
                    Buy
                  </button>
                  <MakeOffer
                    productId={productId}
                    initialOfferPrice={product.price - 1}
                    onOfferSuccess={handleOfferSuccess}
                  />
                  {previousOffer && (
                    <div className="notification mt-4 is-size-6">
                      {`you offered `}
                      <span className="has-text-weight-semibold">
                        ${previousOffer.price}
                      </span>
                      {`, ${formatDistanceToNow(
                        new Date(previousOffer.created_at)
                      )} ago`}
                      <br />
                      <a
                        onClick={openOfferHistory}
                        style={{
                          cursor: "pointer",
                          textDecoration: "underline",
                        }}
                      >
                        view offer history
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isOfferHistoryVisible && (
        <OfferHistory offers={userOffers} onClose={closeOfferHistory} />
      )}
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

export default withAuth(ProductDetailPage);
