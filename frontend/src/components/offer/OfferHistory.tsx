import React from "react";
import { formatDistanceToNow } from "date-fns";
import { Offer } from "@/store/types";

interface OfferHistoryProps {
  offers: Offer[];
  onClose: () => void;
}

const getStatusTagClass = (status: string) => {
  switch (status) {
    case "pending":
      return "is-warning";
    case "accepted":
      return "is-success";
    case "rejected":
      return "is-danger";
    default:
      return "is-light";
  }
};

const OfferHistory: React.FC<OfferHistoryProps> = ({ offers, onClose }) => {
  // Sort offers in descending order by creation date
  const sortedOffers = offers.sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return (
    <div className={`modal ${offers.length > 0 ? "is-active" : ""}`}>
      <div className="modal-background" onClick={onClose}></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">Offer History</p>
          <button
            className="delete"
            aria-label="close"
            onClick={onClose}
          ></button>
        </header>
        <section className="modal-card-body">
          {sortedOffers.length > 0 ? (
            <ul>
              {sortedOffers.map((offer, index) => (
                <li key={index} className="mb-4">
                  <div>
                    You offered <strong>${offer.price}</strong>,{" "}
                    {formatDistanceToNow(new Date(offer.created_at))} ago{" "}
                    <span className={`tag ${getStatusTagClass(offer.status)}`}>
                      {offer.status}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No offers made.</p>
          )}
        </section>
        <footer className="modal-card-foot">
          <button className="button" onClick={onClose}>
            Ok
          </button>
        </footer>
      </div>
    </div>
  );
};

export default OfferHistory;
