import React from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Item } from "@/types";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import LoadingSpinner from "../loading/LoadingSpinner";
import { getItemConditionTagColor } from "@/utils/tagColors";

interface ProductListProps {
  items: Item[];
  isLoading: boolean;
  isError: boolean;
}

const truncateDescription = (description: string, maxLength: number) => {
  if (description.length <= maxLength) {
    return description;
  }
  return description.slice(0, maxLength) + "...";
};

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
              src={item.image || "https://via.placeholder.com/250x150"}
              alt={item.title}
              width={250}
              height={150}
              style={{ objectFit: "cover" }}
            />
          </figure>
        </div>
        <div className="card-content">
          <div className="is-flex is-align-items-center">
            <p className="title is-6 mb-0 has-text-grey">{item.title}</p>
            <span
              className={`tag ${getItemConditionTagColor(
                item.condition
              )} is-light ml-2`}
            >
              {item.condition.replace("_", " ")}
            </span>
          </div>
          <p className="mt-2 mb-2 is-8 has-text-grey has-text-weight-semibold">
            ${item.price}
          </p>
          <p>{truncateDescription(item.description, 100)}</p>
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

export default ProductList;
