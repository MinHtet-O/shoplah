import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { makeOffer } from "@/store/offersSlice";
import { OfferSubmission } from "@/types";
import { AppDispatch } from "@/store/store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import "bulma-tooltip/dist/css/bulma-tooltip.min.css";

interface MakeOfferProps {
  productId: string;
  initialOfferPrice: number;
  onOfferSuccess: (offer: { price: number; created_at: string }) => void;
}

const MakeOffer: React.FC<MakeOfferProps> = ({
  productId,
  initialOfferPrice,
  onOfferSuccess,
}) => {
  const [offerPrice, setOfferPrice] = useState<number | string>(
    initialOfferPrice
  );
  const [offerLoading, setOfferLoading] = useState<boolean>(false);

  const dispatch = useDispatch<AppDispatch>();

  const handleMakeOffer = async () => {
    const offerValue =
      typeof offerPrice === "string" ? parseFloat(offerPrice) : offerPrice;
    setOfferLoading(true);
    const offerData: OfferSubmission = {
      item_id: parseInt(productId, 10),
      price: offerValue,
    };
    try {
      const response = await dispatch(makeOffer(offerData)).unwrap();

      setOfferLoading(false);
      onOfferSuccess(response);
    } catch (error) {
      setOfferLoading(false);
    }
  };

  return (
    <div className="offer-panel mt-6">
      <div className="field">
        <label
          className="label has-text-grey"
          style={{ display: "flex", alignItems: "center" }}
        >
          Make an Offer
          <span
            className="icon has-tooltip-arrow ml-2"
            data-tooltip="Make an offer to negotiate a lower price with the seller."
            style={{ marginLeft: "8px" }}
          >
            <FontAwesomeIcon icon={faInfoCircle} className="has-text-grey" />
          </span>
        </label>

        <div className="control">
          <input
            className="input"
            type="number"
            min="0"
            value={offerPrice}
            onChange={(e) => setOfferPrice(e.target.value)}
          />
        </div>
      </div>
      <button
        className={`button is-link is-fullwidth is-light ${
          offerLoading ? "is-loading" : ""
        }`}
        onClick={handleMakeOffer}
        disabled={offerLoading}
      >
        Offer
      </button>
    </div>
  );
};

export default MakeOffer;
