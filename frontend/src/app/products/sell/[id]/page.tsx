// File: components/item/ProductDetailSeller.tsx

"use client";

import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { fetchItemDetail } from "@/store/itemsSlice";
import { acceptOffer } from "@/store/offersSlice";
import { RootState, AppDispatch } from "@/store/store";
import withAuth from "@/components/auth/withAuth";
import ProductInfo from "@/components/product/ProductInfo";
import { Offer } from "@/types";
import { format, formatDistanceToNow } from "date-fns";

const ProductDetailSeller: React.FC<{ productId: string }> = ({
  productId,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const {
    itemDetail: product,
    loading,
    error,
  } = useSelector((state: RootState) => state.items);
  const currUserId = useSelector((state: RootState) => state.auth.userId);

  useEffect(() => {
    dispatch(fetchItemDetail(productId));
  }, [dispatch, productId]);

  const handleAcceptOffer = async (offerId: number) => {
    try {
      await dispatch(acceptOffer({ offer_id: offerId })).unwrap();
      dispatch(fetchItemDetail(productId)); // Refresh product details after accepting offer
    } catch (error) {
      // Error handling already taken care of in the slice
    }
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

  const isSold = product.status === "sold";
  const isSeller = product.seller_id === currUserId;

  return (
    <div className="section has-background-light">
      <div className="container" style={{ maxWidth: "1400px" }}>
        <div className="card">
          <div className="card-content">
            {isSold && isSeller && (
              <div className="notification is-info is-light">
                {product.purchase?.type === "direct_purchase" ? (
                  <>
                    You sold this item on{" "}
                    {format(
                      new Date(product.purchase!.purchased_at),
                      "MMMM d, yyyy 'at' hh:mm a"
                    )}
                    . <a href="/sales-history">See your sales history</a>
                  </>
                ) : (
                  <>
                    You accepted an offer and sold this item on{" "}
                    {format(
                      new Date(product.purchase!.purchased_at),
                      "MMMM d, yyyy 'at' hh:mm a"
                    )}{" "}
                    for ${product.purchase!.price}.{" "}
                    <a href="/sales-history">See your sales history</a>
                  </>
                )}
              </div>
            )}
            <div className="columns">
              <div className="column is-three-quarters">
                <ProductInfo product={product} />
              </div>
              <div className="column is-one-quarter">
                <div className="box">
                  {!isSold && (
                    <>
                      <h3 className="title is-5">Offers</h3>
                      {product.offers.length === 0 ? (
                        <p>No offers yet</p>
                      ) : (
                        <ul>
                          {product.offers.map((offer: Offer) => (
                            <li key={offer.id} className="mb-3">
                              <div className="box">
                                <p className="is-size-6 has-text-weight-bold">
                                  ${offer.price}
                                </p>
                                <p className="is-size-7 has-text-grey">
                                  {formatDistanceToNow(
                                    new Date(offer.created_at),
                                    {
                                      addSuffix: true,
                                    }
                                  )}
                                </p>
                                <button
                                  className="button is-primary is-small mt-2"
                                  onClick={() => handleAcceptOffer(offer.id)}
                                >
                                  Accept
                                </button>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
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
