import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { getProducts } from "../services/api";
import { useStoreSettings } from "../context/StoreSettingsContext";
import "./Products.css";

function Products() {
  const { settings } = useStoreSettings();

  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchParams] = useSearchParams();

  const categories = [
    "All",
    "Fashion",
    "Electronics",
    "Home & Living",
    "Beauty",
    "Accessories",
    "Sports",
    "Footwear",
  ];

  useEffect(() => {
    const categoryFromUrl = searchParams.get("category");

    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    } else {
      setSelectedCategory("All");
    }
  }, [searchParams]);

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await getProducts();

        setProducts(data.value || data);
      } catch (error) {
        console.error("Failed to load products:", error);
        setError("Unable to load products.");
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter(
          (product) =>
            product.category?.toLowerCase() ===
            selectedCategory.toLowerCase()
        );

  return (
    <main className="products-page">

      <section className="products-header">
        <p>{settings.storeName} • OUR COLLECTION</p>

        <h1>Shop All Products</h1>

        <p>
          Discover carefully selected pieces designed for style,
          comfort and everyday living.
        </p>
      </section>

      <section className="products-content">

        <div className="category-filters">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={
                selectedCategory === category ? "active" : ""
              }
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {loading && (
          <p className="products-message">
            Loading products...
          </p>
        )}

        {error && (
          <p className="products-message">
            {error}
          </p>
        )}

        {!loading && !error && filteredProducts.length === 0 && (
          <p className="products-message">
            No products found in this category.
          </p>
        )}

        {!loading && !error && filteredProducts.length > 0 && (
          <div className="products-grid">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={{
                  ...product,
                  image: product.imageUrl,
                }}
              />
            ))}
          </div>
        )}

      </section>

    </main>
  );
}

export default Products;