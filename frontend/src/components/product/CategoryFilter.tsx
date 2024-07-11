import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchCategories } from "@/store/categorysSlice";
import { setSelectedCategory } from "@/store/filterSlice";
import { fetchItems } from "@/store/itemsSlice";
import { Category } from "@/types";
import { RootState, AppDispatch } from "@/store/store";

const CategoryFilter: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const categories = useSelector(
    (state: RootState) => state.categories.categories
  );
  const selectedCategory = useSelector(
    (state: RootState) => state.filter.selectedCategory
  );

  const [categoryOptions, setCategoryOptions] = useState<
    { value: number | null; label: string }[]
  >([]);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    const options = categories.map((category: Category) => ({
      value: category.id,
      label: category.name,
    }));
    setCategoryOptions([{ value: null, label: "All" }, ...options]);
  }, [categories]);

  const handleCategoryChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value =
      event.target.value === "null" ? null : Number(event.target.value);
    dispatch(setSelectedCategory(value));
    dispatch(fetchItems());
  };

  return (
    <div className="field">
      <div className="control">
        <div className="select is-fullwidth">
          <select
            value={selectedCategory ?? "null"}
            onChange={handleCategoryChange}
          >
            {categoryOptions.map((option) => (
              <option
                key={option.value}
                value={option.value === null ? "null" : option.value}
              >
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default CategoryFilter;
