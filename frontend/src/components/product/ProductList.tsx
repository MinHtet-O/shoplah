import React from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Item } from "@/types";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import ClipLoader from "react-spinners/ClipLoader";
import LoadingSpinner from "../loading/LoadingSpinner";

interface ProductListProps {
  items: Item[];
  isLoading: boolean;
  isError: boolean;
}

const ProductList: React.FC<ProductListProps> = ({
  items,
  isLoading,
  isError,
}) => {
  const router = useRouter();
  const viewType = useSelector((state: RootState) => state.filter.viewType);

  const handleProductClick = (itemId: number) => {
    const basePath = viewType === "BUY" ? "/explorer" : "/listings";
    router.push(`${basePath}/${itemId}`);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h2 className="is-size-4">
          {" "}
          Error loading items. Please try again later.
        </h2>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h2 className="is-size-4 is-text-grey">No items found!</h2>
      </div>
    );
  }

  return (
    <div className="columns is-multiline">
      {items.map((item: Item) => (
        <Product
          key={item.id}
          item={item}
          onProductClick={() => handleProductClick(item.id)}
        />
      ))}
    </div>
  );
};

interface ProductProps {
  item: Item;
  onProductClick: () => void;
}

const Product: React.FC<ProductProps> = ({ item, onProductClick }) => {
  return (
    <div
      className="column is-one-quarter-desktop is-half-tablet"
      onClick={onProductClick}
      style={{ cursor: "pointer" }}
    >
      <div className="card">
        <div className="card-image">
          <figure className="image is-4by3">
            <Image
              src={item.photo || "https://via.placeholder.com/250x150"}
              alt={item.title}
              width={250}
              height={150}
              style={{ objectFit: "cover" }}
            />
          </figure>
        </div>
        <div className="card-content">
          <div className="is-flex is-align-items-center">
            <p className="title is-6 mb-0">{item.title}</p>
            <span
              className={`tag ${getConditionTagColor(
                item.condition
              )} is-light ml-2`}
            >
              {item.condition.replace("_", " ")}
            </span>
          </div>
          <p className="subtitle is-6">${item.price}</p>
          <p>{item.description}</p>
          <p className="is-size-7 has-text-grey mt-2">
            {formatDistanceToNow(new Date(item.created_at), {
              addSuffix: true,
            })}
          </p>
        </div>
      </div>
    </div>
  );
};

const getConditionTagColor = (condition: string) => {
  switch (condition) {
    case "new":
      return "is-success";
    case "almost_new":
      return "is-info";
    case "lightly_used":
      return "is-warning";
    case "heavily_used":
      return "is-danger";
    case "refurbished":
      return "is-primary";
    default:
      return "";
  }
};

export default ProductList;
