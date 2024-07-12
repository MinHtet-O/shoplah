"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { createItem } from "@/store/itemsSlice";
import { fetchCategories } from "@/store/categorysSlice";
import { useRouter } from "next/navigation";
import { ItemCondition } from "@/types";
import "bulma/css/bulma.min.css";
import withAuth from "@/components/auth/withAuth";

const CreateItemForm: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();
  const createItemLoading = useSelector(
    (state: RootState) => state.items.createItemLoading
  );
  const createItemError = useSelector(
    (state: RootState) => state.items.createItemError
  );
  const categories = useSelector(
    (state: RootState) => state.categories.categories
  );

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [categoryId, setCategoryId] = useState<number>(1);
  const [condition, setCondition] = useState(ItemCondition.NEW);
  const [brand, setBrand] = useState("");
  const [image, setImage] = useState<File | null>(null);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append(
      "data",
      JSON.stringify({
        category_id: categoryId,
        title,
        description,
        price,
        condition,
        brand,
      })
    );
    if (image) {
      formData.append("image", image);
    }

    const resultAction = await dispatch(createItem(formData));
    console.log(resultAction);
    if (createItem.fulfilled.match(resultAction)) {
      router.push("/");
    }
  };

  return (
    <div className="container">
      <div className="section">
        <h1 className="title is-size-3 has-text-grey has-text-weight-semibold">
          Upload Your Item
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="columns is-multiline">
            <div className="column is-half">
              <div className="field">
                <label className="label">Title</label>
                <div className="control">
                  <input
                    className="input"
                    type="text"
                    placeholder="Item title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="column is-half">
              <div className="field">
                <label className="label">Category</label>
                <div className="control">
                  <div className="select">
                    <select
                      value={categoryId}
                      onChange={(e) => setCategoryId(parseInt(e.target.value))}
                      required
                    >
                      <option value="">Select category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="column is-half">
              <div className="field">
                <label className="label">Price</label>
                <div className="control">
                  <input
                    className="input"
                    type="number"
                    placeholder="Item price"
                    value={price}
                    onChange={(e) => setPrice(parseInt(e.target.value))}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="column is-half">
              <div className="field">
                <label className="label">Condition</label>
                <div className="control">
                  <div className="select">
                    <select
                      value={condition}
                      onChange={(e) =>
                        setCondition(e.target.value as ItemCondition)
                      }
                      required
                    >
                      {Object.values(ItemCondition).map((condition) => (
                        <option key={condition} value={condition}>
                          {condition.replace("_", " ").toLowerCase()}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="column is-half">
              <div className="field">
                <label className="label">Brand</label>
                <div className="control">
                  <input
                    className="input"
                    type="text"
                    placeholder="Brand"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="column is-half">
              <div className="field">
                <label className="label">Image</label>
                <div className="control">
                  <input
                    className="input"
                    type="file"
                    onChange={(e) =>
                      setImage(e.target.files ? e.target.files[0] : null)
                    }
                    required
                  />
                </div>
              </div>
            </div>
            <div className="column is-full">
              <div className="field">
                <label className="label">Description</label>
                <div className="control">
                  <textarea
                    className="textarea"
                    placeholder="Item description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {createItemError && (
            <p className="help is-danger">{createItemError}</p>
          )}

          <div className="control">
            <button
              className={`button is-primary ${
                createItemLoading ? "is-loading" : ""
              }`}
              type="submit"
            >
              List Now
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default withAuth(CreateItemForm);
