"use client";

import React from "react";
import { Offer, OfferStatus } from "@/types";
import { format } from "date-fns";

enum OfferView {
  SELLER = "seller",
  BUYER = "buyer",
}

interface OfferModalProps {
  offers: Offer[];
  onClose: () => void;
  view: OfferView;
  title: string; // Added title prop
}

const OfferModal: React.FC<OfferModalProps> = ({
  offers,
  onClose,
  view,
  title,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const dateFormat =
      now.getFullYear() === date.getFullYear()
        ? "MMM d, HH:mm"
        : "MMM d, yyyy, HH:mm";
    return format(date, dateFormat);
  };

  const getStatusTagColor = (status: OfferStatus) => {
    switch (status) {
      case OfferStatus.PENDING:
        return "is-warning";
      case OfferStatus.ACCEPTED:
        return "is-success";
      case OfferStatus.REJECTED:
        return "is-danger";
      case OfferStatus.CANCELLED:
        return "is-dark";
      default:
        return "is-light";
    }
  };

  return (
    <div className="modal is-active">
      <div className="modal-background" onClick={onClose}></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">{title}</p> {/* Use title prop */}
          <button
            className="delete"
            aria-label="close"
            onClick={onClose}
          ></button>
        </header>
        <section className="modal-card-body">
          {offers.length === 0 ? (
            <p>No offers</p>
          ) : (
            <ul style={{ maxHeight: "300px", overflowY: "scroll" }}>
              {offers.map((offer: Offer) => (
                <li key={offer.id} className="mb-3">
                  <div className="is-flex is-align-items-center is-justify-content-space-between">
                    <div>
                      <p className="is-size-6">
                        {view === OfferView.SELLER ? (
                          <>
                            <span className="has-text-weight-bold has-text-grey">
                              ${offer.price}
                            </span>{" "}
                            by {offer.user.username}
                          </>
                        ) : (
                          <span className=" has-text-grey">
                            Offered{" "}
                            <span className="has-text-weight-bold">
                              ${offer.price}
                            </span>
                          </span>
                        )}
                      </p>
                      <p className="is-size-7 has-text-grey">
                        {formatDate(offer.created_at)}
                      </p>
                    </div>
                    <span className={`tag ${getStatusTagColor(offer.status)}`}>
                      {offer.status}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
        <footer className="modal-card-foot">
          <button className="button" onClick={onClose}>
            Close
          </button>
        </footer>
      </div>
    </div>
  );
};

export { OfferView };
export default OfferModal;
