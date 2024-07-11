import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchItems } from "@/store/itemsSlice";
import { AppDispatch, RootState } from "@/store/store";
import { setSorting } from "@/store/filterSlice";
import { Sorting } from "@/types";

const Sortings: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const activeSorting = useSelector((state: RootState) => state.filter.sorting);

  const handleSortingChange = (sorting: Sorting) => {
    dispatch(setSorting(sorting));
    dispatch(fetchItems());
  };

  const getButtonClass = (sorting: Sorting) => {
    return `button ${activeSorting === sorting ? "is-link is-light" : ""}`;
  };

  return (
    <div>
      <div className="columns">
        <div className="column">
          <div className="field">
            <label className="has-text-grey label">Sort by</label>
            <div className="control">
              <div className="buttons">
                <button
                  className={getButtonClass(Sorting.LATEST)}
                  onClick={() => handleSortingChange(Sorting.LATEST)}
                >
                  Latest
                </button>
                <button
                  className={getButtonClass(Sorting.LOWEST_PRICE)}
                  onClick={() => handleSortingChange(Sorting.LOWEST_PRICE)}
                >
                  Cheapest
                </button>
                <button
                  className={getButtonClass(Sorting.HIGHEST_PRICE)}
                  onClick={() => handleSortingChange(Sorting.HIGHEST_PRICE)}
                >
                  Highest Price
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sortings;
