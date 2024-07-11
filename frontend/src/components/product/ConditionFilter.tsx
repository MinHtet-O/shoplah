import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedCondition } from "@/store/filterSlice";
import { fetchItems } from "@/store/itemsSlice";
import { ItemCondition } from "@/types";
import { RootState, AppDispatch } from "@/store/store";

const ConditionFilter: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const selectedCondition = useSelector(
    (state: RootState) => state.filter.selectedCondition
  );

  const [conditionOptions] = useState<
    { value: ItemCondition | null; label: string }[]
  >([
    { value: null, label: "All Conditions" },
    { value: ItemCondition.NEW, label: "New" },
    { value: ItemCondition.ALMOST_NEW, label: "Almost New" },
    { value: ItemCondition.LIGHTLY_USED, label: "Lightly Used" },
    { value: ItemCondition.HEAVILY_USED, label: "Heavily Used" },
    { value: ItemCondition.REFURBISHED, label: "Refurbished" },
  ]);

  const handleConditionChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value =
      event.target.value === "null"
        ? null
        : (event.target.value as ItemCondition);
    dispatch(setSelectedCondition(value));
    dispatch(fetchItems());
  };

  return (
    <div className="field">
      <div className="control">
        <div className="select is-fullwidth">
          <select
            value={selectedCondition ?? "null"}
            onChange={handleConditionChange}
          >
            {conditionOptions.map((option) => (
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

export default ConditionFilter;
