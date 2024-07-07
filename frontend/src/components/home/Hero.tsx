import styles from "../../app/page.module.css";

export default function Hero() {
  return (
    <section className={`hero is-medium ${styles.heroBackground}`}>
      <div className="hero-body">
        <div className="container">
          <h1 className="title is-1 has-text-white">Welcome to ShopLah</h1>
          <h2 className="subtitle has-text-white">
            Your Premier Online Marketplace
          </h2>
          <a className={`button is-large ${styles.callToAction}`}>
            Start Shopping Now
          </a>
        </div>
      </div>
    </section>
  );
}
