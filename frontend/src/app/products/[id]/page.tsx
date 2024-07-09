"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { fetchItemDetail } from "@/store/itemsSlice";
import { RootState, AppDispatch } from "@/store/store";
import withAuth from "@/components/auth/withAuth";
import MakeOffer from "@/components/product/MakeOffer";
import OfferHistory from "@/components/offer/OfferHistory";
import ProductInfo from "@/components/product/ProductInfo";
import { Offer } from "@/types";
import { formatDistanceToNow } from "date-fns";

const ProductDetail: React.FC<{ productId: string }> = ({ productId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    itemDetail: product,
    loading,
    error,
  } = useSelector((state: RootState) => state.items);
  const currUserId = useSelector((state: RootState) => state.auth.userId);
  const [isOfferHistoryVisible, setIsOfferHistoryVisible] = useState(false);

  useEffect(() => {
    dispatch(fetchItemDetail(productId));
  }, [dispatch, productId]);

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
    dispatch(fetchItemDetail(productId));
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

  return (
    <div className="section has-background-light">
      <div className="container" style={{ maxWidth: "1400px" }}>
        <div className="card">
          <div className="card-content">
            <div className="columns">
              <div className="column is-three-quarters">
                <ProductInfo product={product} />
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
                      <div className="mt-1">
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
