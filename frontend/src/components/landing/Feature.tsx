import Image from "next/image";
import styles from "../../app/page.module.css";

export default function Features() {
  return (
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
                  electronics to fashion, find everything you need in one place.
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
                  user-friendly platform makes selling a breeze for both new and
                  experienced sellers.
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
  );
}
