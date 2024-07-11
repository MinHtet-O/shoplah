import React from "react";
import CategoryFilter from "./CategoryFilter";
import ConditionFilter from "./ConditionFilter";

const Filters: React.FC = () => {
  return (
    <div>
      <div className="columns">
        <div className="column">
          <div className="field">
            <label className="label has-text-grey">Search by Category</label>
            <div className="control">
              <CategoryFilter />
            </div>
          </div>
        </div>
        <div className="column">
          <div className="field">
            <label className="label has-text-grey">Search by Condition</label>
            <div className="control">
              <ConditionFilter />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filters;
