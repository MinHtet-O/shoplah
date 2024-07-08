"use client";

import React, { useRef, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Category,
  fetchCategories,
  setSelectedCategory,
  fetchItems,
  FetchItemMode,
} from "@/store/itemSlice";
import { RootState, AppDispatch } from "@/store/store";

const CategorySelector: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const categories = useSelector((state: RootState) => state.item.categories);
  const selectedCategory = useSelector(
    (state: RootState) => state.item.selectedCategory
  );
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    const checkArrows = () => {
      if (containerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
        setShowLeftArrow(scrollLeft > 0);
        setShowRightArrow(scrollLeft < scrollWidth - clientWidth);
      }
    };

    checkArrows();

    if (containerRef.current) {
      containerRef.current.addEventListener("scroll", checkArrows);
    }

    window.addEventListener("resize", checkArrows);
    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener("scroll", checkArrows);
      }
      window.removeEventListener("resize", checkArrows);
    };
  }, [categories]);

  const scroll = (direction: "left" | "right") => {
    if (containerRef.current) {
      const scrollAmount = containerRef.current.clientWidth / 2;
      containerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleCategoryClick = (categoryId: number | null) => {
    dispatch(setSelectedCategory(categoryId));
    dispatch(fetchItems({ mode: FetchItemMode.BUY }));
  };

  return (
    <div className="category-selector">
      <div className="is-flex is-align-items-center">
        {showLeftArrow && (
          <button
            className="button is-light mr-1"
            onClick={() => scroll("left")}
          >
            <span className="icon">
              <i className="fas fa-chevron-left"></i>
            </span>
          </button>
        )}
        <div
          ref={containerRef}
          className="is-flex-grow-1 is-flex mx-1"
          style={{
            overflowX: "auto",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          <button
            className={`button is-light mx-1 ${
              selectedCategory === null ? "is-primary" : ""
            }`}
            onClick={() => handleCategoryClick(null)}
          >
            All
          </button>
          {categories.map((category: Category) => (
            <button
              key={category.id}
              className={`button is-light mx-1 ${
                selectedCategory === category.id ? "is-primary" : ""
              }`}
              onClick={() => handleCategoryClick(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
        {showRightArrow && (
          <button
            className="button is-light ml-2"
            onClick={() => scroll("right")}
          >
            <span className="icon">
              <i className="fas fa-chevron-right"></i>
            </span>
          </button>
        )}
      </div>
    </div>
  );
};

export default CategorySelector;
