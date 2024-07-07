import Image from "next/image";
import styles from "../../app/page.module.css";

export default function SellerCTA() {
  return (
    <section className="section">
      <div className="container">
        <div className="columns is-vcentered">
          <div className="column is-6">
            <h2 className="title is-2">Ready to start selling?</h2>
            <p className="subtitle">
              Join thousands of successful sellers on ShopLah.
            </p>
            <a className={`button is-large ${styles.callToAction}`}>
              Open Your Shop
            </a>
          </div>
          <div className="column is-6">
            <figure className="image is-4by3">
              <Image
                src="https://via.placeholder.com/800x600"
                alt="Selling on ShopLah"
                width={800}
                height={600}
              />
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}
