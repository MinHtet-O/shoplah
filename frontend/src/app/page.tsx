"use client";
import Head from "next/head";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Hero from "../components/home/Hero";
import Features from "@/components/home/Feature";
import PopularCategories from "../components/home/PopularCategories";
import SellerCTA from "../components/home/SellerCTA";
import { Provider } from "react-redux";
import { store } from "@/store/store";

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
      <Provider store={store}>
        <Navbar />
        <Hero />
        <Features />
        <PopularCategories />
        <SellerCTA />
        <Footer />
      </Provider>
    </div>
  );
}
