import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FetchItemMode, Item, fetchItems } from "@/store/itemSlice";
import { AppDispatch, RootState } from "@/store/store";
import Image from "next/image";

const ProductList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const items = useSelector((state: RootState) => state.item.items);
  const loading = useSelector((state: RootState) => state.item.loading);
  const error = useSelector((state: RootState) => state.item.error);
  const selectedCategory = useSelector(
    (state: RootState) => state.item.selectedCategory
  );
  const userId = useSelector((state: RootState) => state.auth.userId);

  useEffect(() => {
    dispatch(fetchItems({ mode: FetchItemMode.BUY }));
  }, [dispatch, selectedCategory, userId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="columns is-multiline">
      {items.map((item: Item) => (
        <div
          key={item.id}
          className="column is-one-quarter-desktop is-half-tablet"
        >
          <div className="card">
            <div className="card-image">
              <figure className="image is-4by3">
                <Image
                  src={item.photo || "https://via.placeholder.com/250x150"}
                  alt={item.title}
                  width={250}
                  height={150}
                  objectFit="cover"
                />
              </figure>
            </div>
            <div className="card-content">
              <p className="title is-4">{item.title}</p>
              <p className="subtitle is-6">${item.price}</p>
              <p>{item.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
