"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { fetchItemDetail, buyItem } from "@/store/itemsSlice";
import { RootState, AppDispatch } from "@/store/store";
import withAuth from "@/components/auth/withAuth";
import MakeOffer from "@/components/product/MakeOffer";
import OfferModal, { OfferView } from "@/components/offer/OfferModal";
import ProductInfo from "@/components/product/ProductInfo";
import { Offer } from "@/types";
import { format, formatDistanceToNow } from "date-fns";
import LoadingSpinner from "@/components/loading/LoadingSpinner";

const ProductDetailBuyer: React.FC<{ productId: string }> = ({ productId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const {
    itemDetail: product,
    loading,
    error,
    buyItemLoading,
  } = useSelector((state: RootState) => state.items);
  const currUserId = useSelector((state: RootState) => state.auth.userId);
  const [isOfferModalVisible, setIsOfferModalVisible] = useState(false);

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

  const handleBuyClick = async () => {
    await dispatch(buyItem(product?.id ?? 0));
  };

  const handleOfferSuccess = () => {
    dispatch(fetchItemDetail(productId));
  };

  const openOfferModal = () => {
    setIsOfferModalVisible(true);
  };

  const closeOfferModal = () => {
    setIsOfferModalVisible(false);
  };

  if (loading) {
    return <LoadingSpinner></LoadingSpinner>;
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
        <div className="section">
          <h2 className="is-size-4 is-text-grey">{error}</h2>
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

  const isSold = product.status === "sold";
  const isBuyer = product.purchase && product.purchase.buyer_id === currUserId;
  console.log({ buyItemLoading });
  return (
    <section className="section has-background-light">
      <div className="container" style={{ maxWidth: "1400px" }}>
        <div className="card">
          <div className="card-content">
            {isBuyer && (
              <div className="notification is-link is-light">
                {product.purchase?.type === "offer_accepted" ? (
                  <>
                    Your bought this item for ${product.purchase!.price} on{" "}
                    {format(
                      new Date(product.purchase!.purchased_at),
                      "MMMM d, yyyy 'at' hh:mm:ss a"
                    )}
                  </>
                ) : (
                  <>
                    You bought this item for ${product.purchase!.price} on{" "}
                    {format(
                      new Date(product.purchase!.purchased_at),
                      "MMMM d, yyyy 'at' hh:mm:ss a"
                    )}
                  </>
                )}
                . <a href="/purchases">See your purchase history</a>
              </div>
            )}
            {isSold && !isBuyer && (
              <div className="notification is-info is-light">
                Oops! Someone purchased this already.
              </div>
            )}
            <div className="columns">
              <div className="column is-three-quarters">
                <ProductInfo
                  isOwner={product.seller_id === currUserId}
                  product={product}
                />
              </div>
              <div className="column is-one-quarter">
                {!isSold && (
                  <>
                    <button
                      className={`button is-primary is-fullwidth mb-4 ${
                        buyItemLoading ? "is-loading" : ""
                      }`}
                      onClick={handleBuyClick}
                    >
                      Buy
                    </button>
                    <MakeOffer
                      productId={productId}
                      initialOfferPrice={product.price - 1}
                      onOfferSuccess={handleOfferSuccess}
                      disabled={false}
                    />
                  </>
                )}
                {previousOffer && (
                  <div className="notification mt-4 is-size-6">
                    {`You offered `}
                    <span className="has-text-weight-semibold">
                      ${previousOffer.price}
                    </span>
                    {`, ${formatDistanceToNow(
                      new Date(previousOffer.created_at)
                    )} ago`}
                    <br />
                    <div className="mt-1">
                      <a
                        onClick={openOfferModal}
                        style={{
                          cursor: "pointer",
                          textDecoration: "underline",
                        }}
                      >
                        View offer history
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {isOfferModalVisible && (
        <OfferModal
          title="Your Offer History"
          offers={userOffers.reverse()}
          onClose={closeOfferModal}
          view={OfferView.BUYER}
        />
      )}
    </section>
  );
};

const ProductDetailBuyerPage: React.FC = () => {
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

  return <ProductDetailBuyer productId={id} />;
};

export default withAuth(ProductDetailBuyerPage);
