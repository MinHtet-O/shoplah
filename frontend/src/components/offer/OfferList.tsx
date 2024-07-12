"use client";

import React from "react";
import { Offer } from "@/types";
import { format } from "date-fns";

interface OfferListProps {
  offers: Offer[];
  onAcceptOffer: (offerId: number) => void;
}

const OfferList: React.FC<OfferListProps> = ({ offers, onAcceptOffer }) => {
  const highestPriceOffer = offers.reduce((prev, current) => {
    return prev.price > current.price ? prev : current;
  }, offers[0]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const dateFormat =
      now.getFullYear() === date.getFullYear()
        ? "MMM d, HH:mm"
        : "MMM d, yyyy, HH:mm";
    return format(date, dateFormat);
  };

  const sortedOffers = [
    highestPriceOffer,
    ...offers.filter((offer) => offer.id !== highestPriceOffer.id),
  ];

  return (
    <>
      <h3 className="title is-5 has-text-grey">
        Pending Offers{" "}
        <span className="tag is-info is-light">{offers.length}</span>
      </h3>
      {offers.length === 0 ? (
        <p>No offers yet</p>
      ) : (
        <ul style={{ maxHeight: "300px", overflowY: "scroll" }}>
          {sortedOffers.map((offer: Offer) => (
            <li key={offer.id} className="mb-1">
              <div
                className={`p-2 ${
                  offer.id === highestPriceOffer.id
                    ? "has-background-light"
                    : ""
                } is-flex is-align-items-center is-justify-content-space-between`}
              >
                <div>
                  <p className="is-size-6">
                    <span className="has-text-weight-bold has-text-grey">
                      ${offer.price}
                    </span>{" "}
                    by {offer.user.username}
                  </p>
                  <p className="is-size-7 has-text-grey">
                    {formatDate(offer.created_at)}
                    {offer.id === highestPriceOffer.id && (
                      <span className="has-text-weight-semibold tag is-warning ml-2 is-small ">
                        top offer
                      </span>
                    )}
                  </p>
                </div>
                <button
                  className={`button is-text is-small`}
                  onClick={() => onAcceptOffer(offer.id)}
                >
                  Accept
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default OfferList;
