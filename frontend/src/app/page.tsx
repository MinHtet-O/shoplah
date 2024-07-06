import Head from "next/head";
import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div>
      <Head>
        <title>ShopLah - Your Premier Online Marketplace</title>
        <link rel="icon" href="/favicon.ico" />
        <script
          defer
          src="https://use.fontawesome.com/releases/v5.14.0/js/all.js"
        ></script>
      </Head>

      <nav
        className="navbar is-white"
        role="navigation"
        aria-label="main navigation"
      >
        <div className="container">
          <div className="navbar-brand">
            <a className={`navbar-item ${styles.navbarBrand}`} href="/">
              ShopLah
            </a>
          </div>
          <div className="navbar-menu">
            <div className="navbar-end">
              <a className="navbar-item">Explore</a>
              <a className="navbar-item">Sell</a>
              <a className="navbar-item">About</a>
              <a className="navbar-item">Contact</a>
              <div className="navbar-item">
                <div className="buttons">
                  <a className="button is-primary">Sign up</a>
                  <a className="button is-light">Log in</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

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

      <section className="section">
        <div className="container">
          <h2 className="title is-2 has-text-centered mb-6">
            Why Choose ShopLah?
          </h2>
          <div className="columns is-multiline">
            <div className="column is-6">
              <div className={styles.featurePanel}>
                <Image
                  src="/images/feature1.png"
                  alt="Vast Selection"
                  className={styles.featureImage}
                  width={800}
                  height={800}
                />
                <div className={styles.featureContent}>
                  <span className={`icon ${styles.featureIcon}`}>
                    <i className="fas fa-search"></i>
                  </span>
                  <h3 className="title is-4">Vast Selection</h3>
                  <p>
                    Explore thousands of items across diverse categories. From
                    electronics to fashion, find everything you need in one
                    place.
                  </p>
                </div>
              </div>
            </div>
            <div className="column is-6">
              <div className={styles.featurePanel}>
                <Image
                  src="/images/feature1.png"
                  alt="Sell with Ease"
                  className={styles.featureImage}
                  width={800}
                  height={800}
                />
                <div className={styles.featureContent}>
                  <span className={`icon ${styles.featureIcon}`}>
                    <i className="fas fa-store"></i>
                  </span>
                  <h3 className="title is-4">Sell with Ease</h3>
                  <p>
                    List items and manage your online shop effortlessly. Our
                    user-friendly platform makes selling a breeze for both new
                    and experienced sellers.
                  </p>
                </div>
              </div>
            </div>
            <div className="column is-6">
              <div className={styles.featurePanel}>
                <Image
                  src="/images/feature1.png"
                  alt="Fast Delivery"
                  className={styles.featureImage}
                  width={800}
                  height={800}
                />
                <div className={styles.featureContent}>
                  <span className={`icon ${styles.featureIcon}`}>
                    <i className="fas fa-truck"></i>
                  </span>
                  <h3 className="title is-4">Fast Delivery</h3>
                  <p>
                    Get your purchases delivered right to your doorstep. Enjoy
                    quick and reliable shipping options for a seamless shopping
                    experience.
                  </p>
                </div>
              </div>
            </div>
            <div className="column is-6">
              <div className={styles.featurePanel}>
                <Image
                  src="/images/feature1.png"
                  alt="Secure & Easy"
                  className={styles.featureImage}
                  width={800}
                  height={800}
                />
                <div className={styles.featureContent}>
                  <span className={`icon ${styles.featureIcon}`}>
                    <i className="fas fa-user-shield"></i>
                  </span>
                  <h3 className="title is-4">Secure & Easy</h3>
                  <p>
                    Enjoy a safe and user-friendly shopping experience. Our
                    platform ensures secure transactions and an intuitive
                    interface for all users.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section has-background-light">
        <div className="container">
          <h2 className="title is-2 has-text-centered mb-6">
            Popular Categories
          </h2>
          <div className="columns is-multiline">
            {["Electronics", "Fashion", "Tech", "Beauty", "Sports", "Toys"].map(
              (category) => (
                <div key={category} className="column is-2">
                  <div
                    className={`box has-text-centered ${styles.categoryItem}`}
                  >
                    <p className="is-size-5">{category}</p>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </section>

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

      <footer className="footer">
        <div className="content has-text-centered">
          <p>© 2023 ShopLah. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
