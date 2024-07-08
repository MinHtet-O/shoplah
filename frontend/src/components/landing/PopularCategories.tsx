import styles from "../../app/page.module.css";

export default function PopularCategories() {
  return (
    <section className={`section ${styles.popularCategoriesSection}`}>
      <div className="container">
        <h2 className="title is-2 has-text-centered mb-6">
          Popular Categories
        </h2>
        <div className="columns is-multiline">
          {["Electronics", "Fashion", "Tech", "Beauty", "Sports", "Toys"].map(
            (category) => (
              <div key={category} className="column is-2">
                <div className={`box has-text-centered ${styles.categoryItem}`}>
                  <p className="is-size-5">{category}</p>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}
