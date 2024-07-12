"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { fetchItemDetail } from "@/store/itemsSlice";
import { fetchOffersByItemId, acceptOffer } from "@/store/offersSlice";
import { RootState, AppDispatch } from "@/store/store";
import withAuth from "@/components/auth/withAuth";
import ProductInfo from "@/components/product/ProductInfo";
import OfferList from "@/components/offer/OfferList";
import OfferModal, { OfferView } from "@/components/offer/OfferModal";
import { format } from "date-fns";
import LoadingSpinner from "@/components/loading/LoadingSpinner";

interface ProductDetailSellerProps {
  productId: string;
}
const ProductDetailSeller: React.FC<ProductDetailSellerProps> = ({
  productId,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const [showModal, setShowModal] = useState(false);

  const {
    itemDetail: product,
    loading: itemLoading,
    error: itemError,
  } = useSelector((state: RootState) => state.items);
  const {
    offers,
    loading: offersLoading,
    error: offersError,
  } = useSelector((state: RootState) => state.offers);
  const currUserId = useSelector((state: RootState) => state.auth.userId);

  useEffect(() => {
    dispatch(fetchItemDetail(productId));
    dispatch(fetchOffersByItemId(Number(productId)));
  }, [dispatch, productId]);

  const handleRefreshOffers = () => {
    dispatch(fetchOffersByItemId(Number(productId)));
    dispatch(fetchItemDetail(productId));
  };

  const handleAcceptOffer = async (offerId: number) => {
    await dispatch(acceptOffer({ offer_id: offerId })).unwrap();
    handleRefreshOffers();
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  if (itemLoading || offersLoading) {
    return <LoadingSpinner></LoadingSpinner>;
  }

  if (itemError) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div className="section">
          <h2 className="is-size-4 is-text-grey">{itemError}</h2>
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
  const isSeller = product.seller_id === currUserId;

  const pendingOffers = offers.filter((offer) => offer.status === "pending");
  const nonPendingOffers = offers.filter((offer) => offer.status !== "pending");
  console.log({ nonPendingOffers });
  return (
    <section className="section">
      <div className="container" style={{ maxWidth: "1400px" }}>
        <div className="card">
          <div className="card-content">
            {isSold && isSeller && (
              <div className="notification is-link is-light">
                {product.purchase?.type === "direct_purchase" ? (
                  <>
                    You sold this item on{" "}
                    {format(
                      new Date(product.purchase!.purchased_at),
                      "MMMM d, yyyy 'at' hh:mm a"
                    )}
                    . <a href="/sales">See your sales history</a>
                  </>
                ) : (
                  <>
                    You accepted an offer and sold this item on{" "}
                    {format(
                      new Date(product.purchase!.purchased_at),
                      "MMMM d, yyyy 'at' hh:mm a"
                    )}{" "}
                    for ${product.purchase!.price}.{" "}
                    <a href="/sales">See your sales history</a>
                  </>
                )}
              </div>
            )}
            <div className="columns">
              <div className="column is-three-quarters">
                <ProductInfo product={product} />
              </div>
              <div className="column is-one-quarter">
                {isSold ? (
                  <>
                    <button
                      className="button is-text mt-4"
                      onClick={handleShowModal}
                      disabled={nonPendingOffers.length === 0}
                    >
                      View offer history
                    </button>
                    {showModal && (
                      <OfferModal
                        title="Offer History"
                        offers={offers}
                        onClose={handleCloseModal}
                        view={OfferView.SELLER}
                      />
                    )}
                  </>
                ) : (
                  <>
                    <div className="">
                      <OfferList
                        offers={pendingOffers}
                        onAcceptOffer={handleAcceptOffer}
                      />
                      <button
                        className="button is-text mt-4 p-0"
                        onClick={handleShowModal}
                        disabled={nonPendingOffers.length === 0}
                      >
                        View cancelled offers
                      </button>
                      {showModal && (
                        <OfferModal
                          title="Cancelled Offers"
                          offers={nonPendingOffers}
                          onClose={handleCloseModal}
                          view={OfferView.SELLER}
                        />
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const ProductDetailSellerPage: React.FC = () => {
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

  return <ProductDetailSeller productId={id} />;
};

export default withAuth(ProductDetailSellerPage);
