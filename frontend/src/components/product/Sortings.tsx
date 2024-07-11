import React from "react";
import { useDispatch } from "react-redux";
import { fetchItems } from "@/store/itemsSlice";
import { AppDispatch } from "@/store/store";
import { setSorting } from "@/store/filterSlice";

const Sortings: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const handleSortingChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    dispatch(setSorting(value));
    dispatch(fetchItems());
  };

  return (
    <div>
      <div className="columns">
        <div className="column">
          <div className="field">
            <label className="has-text-grey label">Sort by Date</label>
            <div className="control">
              <div className="select is-fullwidth">
                <select onChange={handleSortingChange}>
                  <option value="latest">Latest</option>
                  <option value="oldest">Oldest</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className="column">
          <div className="field">
            <label className="label has-text-grey">Sort by Price</label>
            <div className="control">
              <div className="select is-fullwidth">
                <select onChange={handleSortingChange}>
                  <option value="price_high_to_low">Price High to Low</option>
                  <option value="price_low_to_high">Price Low to High</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sortings;
