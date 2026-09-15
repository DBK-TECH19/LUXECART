import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import ProductCard from "../components/ProductCard";
import WhyChooseUs from "../components/WhyChooseUs";
import CategorySection from "../components/CategorySection";
import { getProducts } from "../services/api";
import { useStoreSettings } from "../context/StoreSettingsContext";
import Testimonials from "../components/Testimonials";
import "../components/ProductCard.css";
import "./Home.css";

function Home() {
  const { settings } = useStoreSettings();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);

    async function loadFeaturedProducts() {
      try {
        const data = await getProducts();

        const allProducts =
          data?.value || data || [];

        const featuredProducts = Array.isArray(
          allProducts
        )
          ? allProducts.filter(
              (product) =>
                product.isFeatured === true
            )
          : [];

        setProducts(featuredProducts);
      } catch (error) {
        console.error(
          "Failed to load featured products:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    loadFeaturedProducts();
  }, []);

  return (
    <main
      className={`home-page ${
        visible ? "home-visible" : ""
      }`}
    >
      {/* HERO */}

      <Hero />

      {/* FEATURED PRODUCTS */}

      <section className="featured-products home-section">
        <div className="section-heading home-reveal">
          <div className="section-heading-top">
            <span className="section-line" />

            <p>
              {settings.storeName}{" "}
              • OUR SELECTION
            </p>

            <span className="section-line" />
          </div>

          <h2>
            Featured Products
          </h2>

          <span className="section-description">
            Discover carefully selected pieces
            designed to bring quality, style and
            elegance into your everyday life.
          </span>
        </div>

        {loading ? (
          <div className="featured-loading">
            <div className="loading-circle" />

            <p>
              Curating your selection...
            </p>
          </div>
        ) : products.length === 0 ? (
          <div className="featured-empty">
            <p>
              No featured products available.
            </p>
          </div>
        ) : (
          <div className="products-grid home-products-grid">
            {products
              .slice(0, 4)
              .map((product, index) => (
                <div
                  key={product.id}
                  className="home-product-item"
                  style={{
                    animationDelay: `${
                      index * 0.12
                    }s`,
                  }}
                >
                  <ProductCard
                    product={{
                      ...product,
                      image: product.imageUrl,
                    }}
                  />
                </div>
              ))}
          </div>
        )}

        <div className="featured-view-all">
          <Link
            to="/products"
            className="view-all-button"
          >
            View Full Collection
            <span>→</span>
          </Link>
        </div>
      </section>

      {/* LUXURY STATEMENT */}

      <section className="luxury-statement">
        <div className="luxury-statement-glow" />

        <div className="luxury-statement-content">
          <span>
            THE LUXECART EXPERIENCE
          </span>

          <h2>
            Beautiful things.
            <br />
            Thoughtfully selected.
          </h2>

          <p>
            From everyday essentials to pieces
            that make a statement, discover a
            collection built around quality,
            confidence and modern living.
          </p>

          <Link
            to="/products"
            className="luxury-button"
          >
            Explore Collection
            <span>↗</span>
          </Link>
        </div>
      </section>

      {/* CATEGORIES */}

      <section className="home-category-section">
        <CategorySection />
      </section>

      {/* WHY CHOOSE US */}

      <section className="home-why-section">
        <WhyChooseUs />
        <Testimonials />
      </section>

      

      {/* FINAL CTA */}

      <section className="home-final-cta">
        <div className="home-final-inner">

          <span>
            {settings.storeName}
          </span>

          <h2>
            Find something
            <br />
            special today.
          </h2>

          <p>
            Your next favourite piece might
            already be waiting.
          </p>

          <Link
            to="/products"
            className="final-shop-button"
          >
            Shop Now
            <span>→</span>
          </Link>

        </div>

        <div className="final-orb orb-one" />
        <div className="final-orb orb-two" />
        <div className="final-orb orb-three" />

      </section>
    </main>
  );
}

export default Home;