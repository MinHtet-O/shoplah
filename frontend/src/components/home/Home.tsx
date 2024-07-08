import React from "react";
import CategorySelector from "../item/CategorySelector";
import ProductList from "../item/ProductList";

const Home: React.FC = () => {
  return (
    <div className="container">
      <section className="section">
        <CategorySelector />
      </section>
      <section className="section">
        <ProductList />
      </section>
    </div>
  );
};

export default Home;
